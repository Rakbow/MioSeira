<script setup lang="ts">
import {defineAsyncComponent, defineProps, onBeforeMount, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {EntityInfo, META, QueryParams} from "@/config/Web_Const";

const RelationEntity = defineAsyncComponent(() => import('@/components/related/RelatedEntity.vue'));
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
  load();
}))


const props = defineProps({
  header: {
    type: String,
    required: true
  },
  subType: {
    type: Number,
    required: true
  },
  targetType: {
    type: Number,
    required: false,
    default: META.ENTITY.ENTRY
  },
  targetSubTypes: {
    type: Array,
    required: false,
    default: []
  },
  displayCount: {
    type: Number,
    required: false,
    default: 5
  },
  showRole: {
    type: Boolean,
    default: false
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
      targetEntityType: {value: props.targetType},
      targetEntitySubTypes: {value: props.targetSubTypes}
    }
  };
}

const openManager = () => {
  dialog.open(manager, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '90rem'
      },
      modal: true,
      closable: true
    },
    data: {
      entityType: entityInfo.value?.type,
      entitySubType: props.subType,
      entityId: entityInfo.value?.id,
      type: props.targetType,
      subTypes: props.targetSubTypes
    },
    onClose: (options: any) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          load();
        }
      }
    }
  });
}

const openBrowser = () => {
  dialog.open(browser, {
    props: {
      header: props.header,
      style: {
        width: '60rem',
      },
      modal: true,
      closable: true
    },
    data: {
      entityType: entityInfo.value?.type,
      entityId: entityInfo.value?.id,
      type: props.targetType,
      subTypes: props.targetSubTypes
    }
  });
}

const load = async () => {
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
  <Panel class="entity-detail-side-panel">
    <template #header>
      <span><i class="pi pi-list"/><strong>{{ props.header }}</strong></span>
    </template>
    <template #icons>
      <Button v-if="userStore.user && userStore.user.type > 1" text
              @click="openManager" v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}">
        <MaterialIcon name="edit_square"/>
      </Button>
      <Button severity="success" outlined @click="openBrowser" :disabled="!relatedEntities"
              v-tooltip.bottom="{value: t('ViewAll'), class: 'common-tooltip', disabled: !relatedEntities}">
        <template #icon>
          <span>{{ total.toString() }}</span>
        </template>
      </Button>
    </template>
    <i v-if="loading" class="pi pi-spin pi-spinner" style="font-size: 2rem"/>
    <div v-else>
      <div v-if="relatedEntities" v-for="entity in relatedEntities">
        <RelationEntity :entity="entity" :showRole="showRole"/>
      </div>
      <div v-else>
        <span class="empty-search-result">{{ t('NoInfo') }}</span>
      </div>
    </div>
  </Panel>
</template>

<style scoped lang="scss">
</style>