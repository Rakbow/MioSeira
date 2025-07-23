<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, defineProps, inject} from "vue";
import {bs} from "@/service/baseService";

const browser = defineAsyncComponent(() => import('@/components/common/ChangelogBrowser.vue'));

const {t} = useI18n();
const entity = inject<Entity>('entity')!;

const props = defineProps({
  info: {
    type: Object,
    default: () => ({
      visitCount: 0
    })
  } as any,
  addedTime: {
    type: String
  },
  editedTime: {
    type: String
  }
});

const openBrowser = () => {
  bs!.dialog.open(browser, {
    props: {
      header: t('Changelog'),
      style: {
        width: '75rem'
      },
      modal: true,
      closable: true
    },
    data: {
      type: entity!.type,
      id: entity!.id,
    }
  });
}
</script>

<template>
  <Panel>
    <template #header>
      <span><RIcon name="acute"/><strong>{{ t('Changelog') }}</strong></span>
    </template>
    <template #icons>
      <Button label="11" outlined @click="openBrowser"/>
    </template>

    <div class="formgrid grid">
      <div class="col-fixed">
        <i class="pi pi-chevron-circle-right"/><strong class="label-title">{{ t('AddedTime') }}</strong>
      </div>
      <div class="col-11 col-offset-1 mb-2">{{ addedTime }}</div>
      <div class="col-fixed">
        <i class="pi pi-chevron-circle-right"/><strong class="label-title">{{ t('EditedTime') }}</strong>
      </div>
      <div class="col-11 col-offset-1 mb-2">{{ editedTime }}</div>
      <div class="col-fixed">
        <i class="pi pi-chart-bar"/><strong class="label-title">{{ t('PageTraffic') }}</strong>
      </div>
      <div class="col-11 col-offset-1 mb-2">
        <i class="pi pi-eye"/><strong>{{ t('Visit') }}: </strong>
        <span class="text-center">{{ info.visitCount }}</span>
      </div>
    </div>
  </Panel>
</template>

<style scoped lang="scss">
</style>