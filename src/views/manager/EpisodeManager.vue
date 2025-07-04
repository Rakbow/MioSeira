<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useRoute, useRouter} from "vue-router";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import {EntityManageParam} from "@/logic/entityService";
import {PColumn} from "@/logic/frame";

const {t} = useI18n();
const dt = ref();
const route = useRoute();
const router = useRouter();
const param = ref(new EntityManageParam());

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
  const page = parseInt(query.page?.toString() ?? '1');

  if (query.sort) {
    param.value.query.sortField = query.sort.toString();
    if (query.order) {
      param.value.query.sortOrder = query.order.toString() === 'desc' ? -1 : 1;
    }
  }

  param.value.countPage(page, dt.value.rows);
  param.value.query.filters.keyword.value = query.keyword?.toString() ?? '';
}

const updateQueryParam = () => {
  const { query: { filters, sortField, sortOrder, first }} = param.value;
  const curQuery = {...route.query};

  curQuery.page = ((first / dt.value.rows) + 1).toString();

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
  param.value.initPage(ev.first, ev.rows);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage(0, dt.value.rows);
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};
const onFilter = () => {
  param.value.initPage(0, dt.value.rows);
  load();
};

const load = async () => {
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
  <DataTable ref="dt" :value="param.data" class="entity-manager-datatable" :alwaysShowPaginator="param.data.length != 0"
             lazy v-model:filters="param.query.filters" :totalRecords="param.total" :loading="param.loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator :rows="param.query.rows" :first="param.query.first" stripedRows size="small"
             v-model:selection="param.selectedData" dataKey="id" removableSort showGridlines
             scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;" responsiveLayout="scroll"
             rowGroupMode="rowspan" groupRowsBy="parent.name">
    <template #paginatorfirstpagelinkicon>
      <span class="material-symbols-outlined">first_page</span>
    </template>
    <template #paginatorprevpagelinkicon>
      <span class="material-symbols-outlined">chevron_left</span>
    </template>
    <template #paginatornextpagelinkicon>
      <span class="material-symbols-outlined">chevron_right</span>
    </template>
    <template #paginatorlastpagelinkicon>
      <span class="material-symbols-outlined">last_page</span>
    </template>
    <template #header>
      <BlockUI :blocked="param.blocking">
        <Button variant="text" severity="help" :disabled="param.selectedData.length"
                outlined @click="exportCSV">
          <template #icon>
            <span class="material-symbols-outlined">file_export</span>
          </template>
        </Button>
      </BlockUI>
    </template>
    <template #empty>
        <span>{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"/>
      <span>{{ t('CommonDataTableLoadingInfo') }}</span>
    </template>

    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body>
        <Button variant="text" outlined size="small">
          <template #icon>
            <span class="material-symbols-outlined">edit_square</span>
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
@use "@/assets/entity-manager";
</style>