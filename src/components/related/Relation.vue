<script setup lang="ts">
import {defineAsyncComponent, defineProps, getCurrentInstance, ref} from 'vue';
import {useUserStore} from "@/store/modules/user";
import {useDialog} from "primevue/usedialog";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {META} from "@/config/Web_Const";

const RelationEntity = defineAsyncComponent(() => import('@/components/related/RelatedEntity.vue'));
const manager = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesManager.vue'));
const browser = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesBrowser.vue'));
const {t} = useI18n();
const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const relatedEntities = ref<any>([]);
const loading = ref(false);

const props = defineProps({
  header: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
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
  total: {
    type: Number,
    required: true
  },
  showRole: {
    type: Boolean,
    default: false
  },
  entities: {
    type: Array,
    required: false
  }
});

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
      entityType: props.type,
      entitySubType: props.subType,
      entityId: props.id,
      type: props.targetType,
      subTypes: props.targetSubTypes
    },
    onClose: (options: any) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
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
      entityType: props.type,
      entityId: props.id,
      type: props.targetType,
      subTypes: props.targetSubTypes
    }
  });
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
        <MaterialIcon name="edit_square" />
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
      <div v-if="entities?.length" v-for="entity in entities">
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