<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useRoute, useRouter} from "vue-router";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import {PublicHelper} from "@/toolkit/publicHelper";
import {EntityManageParam} from "@/logic/entityService";
import {PColumn} from "@/logic/frame";

const {t} = useI18n();
const dt = ref();
const route = useRoute();
const router = useRouter();
const param = ref(new EntityManageParam());

onBeforeMount(async () => {
  param.value.query.initFilters({
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
  let page: number = PublicHelper.isNotUndefined(route.query.page) ? parseInt(route.query.page!.toString()) : 1;

  param.value.query.first = (page - 1) * dt.value.rows;
  param.value.query.rows = dt.value.rows;
  param.value.query.filters.keyword.value = PublicHelper.isNotUndefined(route.query.keyword) ? route.query.keyword!.toString() : '';
}

const updateQueryParam = () => {
  const currentQueryParams = {...route.query};
  currentQueryParams.page = (param.value.query.first / dt.value.rows + 1).toString();
  currentQueryParams.size = dt.value.rows;

  if (PublicHelper.isNotEmpty(param.value.query.filters.keyword.value)) {
    currentQueryParams.keyword = param.value.query.filters.keyword.value;
  }else {
    delete currentQueryParams.keyword;
  }

  if (PublicHelper.isNotEmpty(param.value.query.sortField)) {
    currentQueryParams.sortField = param.value.query.sortField;
    currentQueryParams.sortOrder = param.value.query.sortOrder.toString();
  }else {
    delete currentQueryParams.sortField;
    delete currentQueryParams.sortOrder;
  }

  // 使用 router.push 更新 URL
  router.push({path: route.path, query: currentQueryParams});
};
//endregion

const onPage = (ev: any) => {
  param.value.query.first = ev.first;
  param.value.query.rows = ev.rows;
  load();
};
const onSort = (ev: any) => {
  param.value.query.initPage(dt.value.rows);
  param.value.query.sortField = ev.sortField;
  param.value.query.sortOrder = ev.sortOrder;
  load();
};
const onFilter = () => {
  param.value.query.initPage(dt.value.rows);
  load();
};

const load = async () => {
  param.value.first = param.value.query.first;
  updateQueryParam();
  param.value.load();
  const res = await axios.post(API.EPISODE_GET_LIST, param.value.query);
  if (res.state === axios.SUCCESS) {
    param.value.data = res.data.data;
    param.value.total = res.data.total
  }
  param.value.endLoad();
}

const exportCSV = () => {
  dt.value.exportCSV();
};

</script>

<template>
  <DataTable ref="dt" :value="param.data" class="p-datatable-sm small-font" :alwaysShowPaginator="param.data.length !== 0"
             lazy v-model:filters="param.query.filters" :totalRecords="param.total" :loading="param.loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator :rows="10" :first="param.first" stripedRows size="small"
             v-model:selection="param.selectedData" dataKey="id" removableSort
             scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="{first} to {last} of {totalRecords}" responsiveLayout="scroll"
             rowGroupMode="rowspan" groupRowsBy="parent.name">
    <template #header>
      <BlockUI :blocked="param.blocking" class="relative">
        <Button variant="text" severity="help" :disabled="param.selectedData.length"
                outlined @click="exportCSV">
          <template #icon>
            <span class="material-symbols-outlined">file_export</span>
          </template>
        </Button>
      </BlockUI>
    </template>
    <template #empty>
        <span class="emptyInfo">
            {{ t('CommonDataTableEmptyInfo') }}
        </span>
    </template>
    <template #loading>
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <span>{{ t('CommonDataTableLoadingInfo') }}</span>
    </template>

    <Column style="width: 45px">
      <template #body>
        <Button variant="text" outlined size="small">
          <template #icon>
            <span style="font-size: 15px" class="material-symbols-outlined">edit_square</span>
          </template>
        </Button>
      </template>
    </Column>
    <Column :header="t('Name')" field="name" filterField="keyword" :showFilterMenu="false" :showClearButton="true"
            exportHeader="name" :sortable="true">
      <template #body="{data}">
        <a :href="`${API.EPISODE_DETAIL}/${data.id}`">
          <div class="text-container" :title="data.name">
            {{ data!.name }}
          </div>
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" size="small" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('Duration')" field="duration" :showFilterMenu="false" :sortable="true" style="width: 60px" />
    <Column :header="t('Index')" :showFilterMenu="false" style="width: 50px">
      <template #body="{data}">
        {{ `${data!.discNo}-${data!.serial}` }}
      </template>
    </Column>

    <Column field="parent.name" header="Parent" style="width: 300px" :bodyStyle="{position: 'relative'}">
      <template #body="{data}">
        <a :title="data.parent.name"
           :href="`/db/${data.parent.tableName}/${data.parent.id}`"
           style="width: 280px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;
           position: absolute;margin-top: 10px;top: 0">
          {{ data!.parent.name }}
        </a>
      </template>
    </Column>
    <Column :header="t('AddedTime')" field="addedTime" :showFilterMenu="false" :sortable="true" style="width: 140px" />
    <Column :header="t('EditedTime')" field="editedTime" :showFilterMenu="false" :sortable="true" style="width: 140px" />
    <Column :header="t('File')" field="fileCount" style="width: 40px" />
  </DataTable>
</template>

<style lang="scss" scoped>
@use "@/assets/entity-manager";
</style>