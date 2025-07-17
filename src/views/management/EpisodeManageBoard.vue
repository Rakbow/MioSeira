<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import { API, Axios } from '@/api';
import {useI18n} from "vue-i18n";
import "flag-icons/css/flag-icons.min.css";
import {EntitySearchParam} from "@/service/entityService";
import {PColumn} from "@/service/frame";

const {t} = useI18n();
const dt = ref();
const route = useRoute();
const router = useRouter();
const param = ref(new EntitySearchParam());

onBeforeMount(async () => {
  param.value.initFilters({
    keyword: {value: ''}
  });
  param.value.initColumns([
    new PColumn('remark', t('Remark')),
    new PColumn('addedTime', t('AddedTime')),
    new PColumn('editedTime', t('EditedTime'))
  ])
})

onMounted(() => {
  initQueryParam();
  load();
})

const initQueryParam = async () => {
  const { query } = route;

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
  const { query: { filters, sortField, sortOrder, page }} = param.value;
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
  const res = await Axios.post(API.EPISODE.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
}

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
             scrollable scrollHeight="flex" responsiveLayout="scroll"
             rowGroupMode="rowspan" groupRowsBy="parent.name">
    <template #paginatorcontainer>
      <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                  :total="param.result.total" @page="onPage($event)" :time="param.result.time"
                  :sizeOptions="[15, 30 ,50]" @update:rows="param.query.size = $event"/>
    </template>
    <template #header>
      <RButton @click="exportCSV" action="export" severity="help" :disabled="!param.data.length" />
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
      <template #body>
        <RButton size="small" action="update"/>
      </template>
    </Column>
    <Column :header="t('Name')" field="name" filterField="keyword" :showFilterMenu="false" :showClearButton="true"
            exportHeader="name" :sortable="true">
      <template #body="{data}">
        <a :href="`${$api.EPISODE.DETAIL_PATH}/${data.id}`">
          <span :title="data.name">
            {{ data!.name }}
          </span>
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" size="large" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('Duration')" field="duration" :showFilterMenu="false" :sortable="true" style="width: 6rem" />
    <Column :header="t('Index')" :showFilterMenu="false" style="width: 5rem">
      <template #body="{data}">
        {{ `${data!.discNo}-${data!.serial}` }}
      </template>
    </Column>

    <Column field="parent.name" header="Parent" style="width: 30rem" :bodyStyle="{position: 'relative'}">
      <template #body="{data}">
        <a :title="data.parent.name"
           :href="`/db/${data.parent.tableName}/${data.parent.id}`"
           style="width: 28rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;
           position: absolute;margin-top: 1rem;top: 0">
          {{ data!.parent.name }}
        </a>
      </template>
    </Column>
    <Column :header="t('AddedTime')" field="addedTime" :showFilterMenu="false" :sortable="true" style="width: 14rem" />
    <Column :header="t('EditedTime')" field="editedTime" :showFilterMenu="false" :sortable="true" style="width: 14rem" />
    <Column :header="t('File')" field="fileCount" class="text-center" style="width: 4rem" />
  </DataTable>
</template>

<style lang="scss" scoped>
</style>