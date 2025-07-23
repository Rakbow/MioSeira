<template>
  <DataTable :value="param.result.data" class="entity-manager-datatable"
             lazy :loading="param.loading" size="small" paginator columnResizeMode="fit"
             @sort="onSort($event)" alwaysShowPaginator :rows="param.query.size"
             dataKey="id" removableSort scrollable scrollHeight="flex" responsiveLayout="scroll">
    <template #paginatorcontainer>
      <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                  :total="param.result.total" @page="onPage($event)" :time="param.result.time"/>
    </template>
    <template #empty>
      <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
      <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <RIcon class="pi-spin" name="autorenew" size="10rem"/>
    </template>

    <Column :header="t('Operate.Field')" field="field.label" :sortable="true" style="width: 9rem" />
    <Column :header="t('Operate.Operate')" field="operate.label" :sortable="true" style="width: 9rem" />
    <Column :header="t('Operate.Operator')" field="operator" :sortable="true" style="width: 9rem" />
    <Column :header="t('Operate.OperateTime')" field="operateTime" :sortable="true" style="width: 14rem" />
  </DataTable>
</template>

<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";

const {t} = useI18n();
const param = ref(new EntitySearchParam());
const dialogRef = inject<any>('dialogRef');

onBeforeMount(async () => {
  param.value.initFilters({
    entityType: {value: dialogRef.value.data.type},
    entityId: {value: dialogRef.value.data.id}
  });
})

onMounted(() => {
  param.value.query.size = 10;
  load();
})

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage();
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};

const load = async () => {
  param.value.load();
  const res = await Axios.post(API.CHANGELOG.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
}
</script>

<style scoped>

</style>