<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {EntitySearchParam, loadEditor} from "@/service/entityService";
import {getIcon} from "material-file-icons";
import {PColumn} from "@/service/frame";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const dt = ref();
const param = ref(new EntitySearchParam());

onBeforeMount(async () => {
  param.value.initFilters({
    keyword: {value: ''}
  });
  param.value.initColumns([
    new PColumn('addedTime', t('AddedTime')),
    new PColumn('editedTime', t('EditedTime'))
  ])
})

onMounted(() => {
  initQueryParam();
  load();
})

const initQueryParam = async () => {
  const {query} = route;

  if (query.sort) {
    param.value.query.sortField = query.sort.toString();
    if (query.order) {
      param.value.query.sortOrder = query.order.toString() === 'desc' ? -1 : 1;
    }
  }

  param.value.query.page = parseInt(query.page?.toString() ?? '1');
  param.value.query.filters.keyword.value = query.keyword?.toString() ?? '';
}

const updateQueryParam = () => {
  const {query: {filters, sortField, sortOrder, page}} = param.value;
  const curQuery = {...route.query};

  curQuery.page = page.toString();

  ['keyword'].forEach(key => {
    if (filters[key]?.value) {
      curQuery[key] = filters[key].value;
    } else {
      delete curQuery[key];
    }
  });

  if (sortField) {
    curQuery.sort = sortField;
    curQuery.order = sortOrder === 1 ? 'asc' : sortOrder === -1 ? 'desc' : null;
  } else {
    delete curQuery.sort;
    delete curQuery.order;
  }

  router.push({path: route.path, query: curQuery});
};
//endregion

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage();
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};
const onFilter = () => {
  param.value.initPage();
  load();
};

const load = async () => {
  updateQueryParam();
  param.value.load();
  const res = await Axios.post(API.FILE.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
}

//region item CRUD
const displayDeleteDialog = ref(false);

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}
//endregion

const exportCSV = () => {
  dt.value.exportCSV();
};

</script>

<template>
  <DataTable ref="dt" :value="param.result.data" class="entity-manager-datatable"
             lazy v-model:filters="param.query.filters" :loading="param.loading"
             @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator alwaysShowPaginator :rows="param.query.size" stripedRows size="small"
             v-model:selection="param.selectedData" dataKey="id" removableSort showGridlines
             scrollable scrollHeight="flex" responsiveLayout="scroll">
    <template #paginatorcontainer>
      <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                  :total="param.result.total" @page="onPage($event)" :time="param.result.time"
                  :sizeOptions="[15, 30 ,50]" @update:rows="param.query.size = $event"/>
    </template>
    <template #header>
      <BlockUI :blocked="param.blocking">
        <RButton @click="confirmDeleteSelected" action="delete"
                 :disabled="!param.selectedData.length"/>
        <RButton @click="exportCSV" action="export"
                 severity="help" :disabled="!param.data.length"/>
      </BlockUI>
    </template>
    <template #empty>
      <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
      <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <RIcon class="pi-spin" name="autorenew" size="10rem"/>
    </template>

    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <RButton @click="loadEditor($const.ENTITY.FILE, data)" action="update" size="small"/>
      </template>
    </Column>

    <Column style="width: 3rem">
      <template #body="{data}">
        <div v-html="getIcon(data.name).svg"/>
      </template>
    </Column>

    <Column :header="t('Name')" field="name" filterField="keyword" :showFilterMenu="false" :showClearButton="true"
            exportHeader="name" :sortable="true">
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" size="large" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('Size')" field="size" :sortable="true" style="width: 9rem"/>
    <Column :header="t('AddedTime')" field="addedTime" :sortable="true" style="width: 14rem"/>
    <Column :header="t('EditedTime')" field="editedTime" :sortable="true" style="width: 14rem"/>
    <Column :header="t('Remark')" field="remark" style="width: 14rem"/>

    <Column v-for="(col, index) of param.selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style scoped lang="scss">
@use "@/styles/entity-manager";
</style>