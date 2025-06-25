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
import {EntityInfo, QueryParams} from "@/config/Web_Const";

const manager = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesManager.vue'));
const browser = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesBrowser.vue'));

const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const relatedEntities = ref<any>([]);
const loading = ref(false);
let total = 0;
const queryParams = ref<QueryParams>(new QueryParams());

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});

onMounted((() => {
  initQueryParam();
  getRelatedEntities();
}))


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

const initQueryParam = () => {
  queryParams.value = {
    first: 0,
    rows: props.displayCount,
    sortField: null,
    sortOrder: null,
    filters: {
      entityType: {value: entityInfo.value?.type},
      entityId: {value: entityInfo.value?.id},
      relatedGroup: {value: props.relatedGroup}
    }
  };
}

const openEditDialog = () => {
  dialog.open(manager, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '900px',
      },
      modal: true,
      closable: true
    },
    data: {
      relatedGroup: props.relatedGroup
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          getRelatedEntities();
        }
      }
    }
  });
}

const detail = () => {
  dialog.open(browser, {
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

const getRelatedEntities = async () => {
  loading.value = true;
  const res = await axios.post(API.RELATION_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    relatedEntities.value = res.data.data;
    total = res.data.total;
  }
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
                @click="openEditDialog" v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}">
          <span class="pi pi-cog"/>
        </Button>
        <Button :label="total.toString()" severity="success" size="small" outlined class="mr-2"
                @click="detail" :disabled="!relatedEntities || total <= 5"
                v-tooltip.bottom="{value: t('ViewAll'), class: 'common-tooltip', disabled: !relatedEntities || total <= 5}"/>
      </template>
      <BlockUI :blocked="loading">
        <div class="grid" v-if="relatedEntities">
          <div class="flex flex-wrap">
            <div v-for="(entity, index) in relatedEntities" :key="index" class="p-2">
              <div class="grid" style="border-radius: 5px;background: #18181b">
                <div class="col-fixed p-1" style="width: 45px">
                  <div class="entry-thumb">
                    <img role="presentation" :alt="entity.target.label" :src="entity.thumb"/>
                  </div>
                </div>
                <div class="col p-1" style="width: 240px">
                    <span class="block data-table-field-text-overflow-hidden">
                      <a :href="`${API.ENTRY_DETAIL_PATH}/${entity.target.value}`" :title="entity.target.label">{{ entity.target.label }}</a>
                    </span>
                  <small style="color: gray" class="block data-table-field-text-overflow-hidden">
                    {{ entity.subName }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <span class="empty-search-result">{{ t('NoInfo') }}</span>
        </div>
      </BlockUI>
    </Panel>
  </div>
</template>

<style scoped lang="scss">
</style>