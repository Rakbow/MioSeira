<script setup lang="ts">
import { defineProps } from 'vue';
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const props = defineProps({
  info: {
    type: Object,
    default: () => ({
      visitCount: 0
    })
  },
  addedTime: {
    type: String,
    default: () => ('????/??/?? ??:??:??')
  },
  editedTime: {
    type: String,
    default: () => ('????/??/?? ??:??:??')
  }
});
</script>

<template>
  <Card class="page-info">
    <template #content>
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
    </template>
  </Card>
</template>

<style scoped>
</style>