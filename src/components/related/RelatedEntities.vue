<script setup lang="ts">
import '@/assets/entity-detail.scss';
import '@/assets/entity-global.scss';
import {defineAsyncComponent, defineProps, onBeforeMount, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {EntityInfo, META} from "@/config/Web_Const";
const editor = defineAsyncComponent(() => import('@/components/related/RelationEditor.vue'));
const allRelatedEntities = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesTable.vue'));

const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});
onMounted((() => {
  getRelations();
}))

const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const relatedEntities = ref([]);
const loading = ref(false);
let total = 0;
const entityName = ref("");
const props = defineProps({
  header: {
    type: String,
    required: true
  },
  relatedGroup: {
    type: Number,
    required: true
  },
  displayCount: {
    type: Number,
    required: false,
    default: 5
  }
});

const openEditDialog = () => {
  dialog.open(editor, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '900px',
      },
      modal: true,
      closable: true
    },
    data: {
      relatedGroup: props.relatedGroup,
      direction: META.RELATION_RELATED_DIRECTION.POSITIVE
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          getRelations();
        }
      }
    }
  });
}

const detail = () => {
  dialog.open(allRelatedEntities, {
    props: {
      header: props.header,
      style: {
        width: '600px',
      },
      modal: true,
      closable: true
    },
    data: {
      entityType: entityInfo.value?.type,
      entityId: entityInfo.value?.id,
      relatedGroup: props.relatedGroup
    }
  });
}

const getRelations = async () => {
  loading.value = true;
  let param = {
    relatedGroup: props.relatedGroup,
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    direction: META.RELATION_RELATED_DIRECTION.POSITIVE,
    param: {first: 0, row: props.displayCount}
  }
  const res = await axios.post(API.GET_RELATED_ENTITIES, param);
  if (res.state === axios.SUCCESS)
    relatedEntities.value = res.data.data;
    total = res.data.total;
  loading.value = false;
}

</script>

<template>
  <div class="mt-2 entity-detail-side-panel">
    <Panel>
      <template #header>
        <span>
            <i class="pi pi-list"/><span><strong>{{ props.header }}</strong></span>
        </span>
      </template>
      <template #icons>
        <Button v-if="userStore.user && userStore.user.type > 1" class="p-panel-header-icon p-link ml-2" text rounded
                @click="openEditDialog" v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}">
          <span class="pi pi-cog"/>
        </Button>
        <Button :label="total.toString()" severity="success" size="small" outlined class="mr-2"
                @click="detail" :disabled="!relatedEntities"
                v-tooltip.bottom="{value: $t('ViewAll'), class: 'common-tooltip', disabled: !relatedEntities}" />
      </template>
      <BlockUI :blocked="loading">
        <div class="grid" v-if="relatedEntities">
          <div class="flex flex-wrap">
            <div v-for="(entry, index) in relatedEntities" :key="index" class="p-2">
              <div class="grid" style="border-radius: 5px;background: #18181b">
                <div class="col-fixed p-1" style="width: 45px">
                  <div class="entry-thumb">
                    <img role="presentation" :alt="entry.name" :src="entry.cover"/>
                  </div>
                </div>
                <div class="col p-1" style="width: 240px">
                    <span class="block data-table-field-text-overflow-hidden">
                      <a :href="`${API.ENTRY_DETAIL}/${entry.id}`" :title="entry.name">{{ entry.name }}</a>
                    </span>
                  <small style="color: gray" class="block data-table-field-text-overflow-hidden">
                    {{ (entry as any).subName }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <span class="empty-search-result">{{ $t('NoInfo') }}</span>
        </div>
      </BlockUI>
    </Panel>
  </div>
</template>

<style scoped lang="scss">
</style>