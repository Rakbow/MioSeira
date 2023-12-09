<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  info: {
    type: Object,
    default: () => ({

    })
  }
});
</script>

<template>
  <div class="page-info mt-2">
    <Card>
      <template #content>
        <div class="formgrid grid">
          <div class="col-fixed">
            <i class="pi pi-chevron-circle-right mr-2 ml-2"></i><strong
              class="label">录入时间</strong>
          </div>
          <div class="col-11 col-offset-1 mb-2">{{ info.addedTime }}</div>
          <div class="col-fixed">
            <i class="pi pi-chevron-circle-right mr-2 ml-2"></i><strong
              class="label">编辑时间</strong>
          </div>
          <div class="col-11 col-offset-1 mb-2">{{ info.editedTime }}</div>
          <div class="col-fixed">
            <i class="pi pi-chart-bar mr-2 ml-2"></i><strong class="label">页面流量</strong>
          </div>
          <div class="col-11 col-offset-1 mb-2">
            <i class="pi pi-eye mr-2"></i><strong>访问数：</strong>
            <span class="text-center">{{ info.visitCount }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>

@import '@/assets/bootstrap/myBootstrap.min.css';

/* rakbow page info */

.page-info .p-card {
  background: #2f364f;
}

.page-info .p-card-body {
  padding: 6px 10px 6px 10px;
}

.page-info .p-card .p-card-content {
  padding: 0;
}
</style>