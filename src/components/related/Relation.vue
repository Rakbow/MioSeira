<script setup lang="ts">
import {defineAsyncComponent, defineProps, inject, ref} from 'vue';
import {useI18n} from "vue-i18n";
import {META} from "@/config/Web_Const";
import {bs} from '@/service/baseService';

const RelationEntity = defineAsyncComponent(() => import('@/components/related/RelatedEntity.vue'));
const manager = defineAsyncComponent(() => import('@/components/related/RelationManager.vue'));
const browser = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesBrowser.vue'));
const {t} = useI18n();
const loading = ref(false);
const entity = inject<Entity>('entity');

const props = defineProps({
  header: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false,
    default: 'list'
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
    required: true
  }
});

const openManager = () => {
  bs!.dialog.open(manager, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '90rem'
      },
      modal: true,
      closable: true
    },
    data: {
      entityType: entity!.type,
      entitySubType: entity!.subType,
      entityId: entity!.id,
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
  bs!.dialog.open(browser, {
    props: {
      header: props.header,
      style: {
        width: '60rem',
      },
      modal: true,
      closable: true
    },
    data: {
      entityType: entity!.type,
      entityId: entity!.id,
      type: props.targetType,
      subTypes: props.targetSubTypes
    }
  });
}

</script>

<template>
  <Panel>
    <template #header>
      <span><i :class="`pi pi-${props.icon}`"/><strong>{{ props.header }}</strong></span>
    </template>
    <template #icons>
      <RButton v-permission
               @click="openManager" action="update" />
      <Button :label="total.toString()" outlined @click="openBrowser" :disabled="total <= 5"
              v-tooltip.bottom="{value: t('ViewAll'), disabled: total <= 5}"/>
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