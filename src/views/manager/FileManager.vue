<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import {loadEditor} from "@/logic/entityService";
import {getIcon} from "material-file-icons";

const route = useRoute();
const router = useRouter();
const first = ref();
const dialog = useDialog();
const toast = useToast();
const {t} = useI18n();
const list = ref([]);
const dt = ref();
const filters = ref({
  'name': {value: ''}
});
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedItems = ref([]);
const selectedColumns = ref([]);
const columns = ref([
  {field: 'addedTime', header: t('AddedTime')},
  {field: 'editedTime', header: t('EditedTime')},
]);
const queryParams = ref();

const initPageSize = () => {
  queryParams.value.first = 0;
  queryParams.value.rows = dt.value.rows;
}

const initQueryParam = async () => {
  let page = !_isUndefined(route.query.page) ? route.query.page : 1;
  filters.value.name.value = !_isUndefined(route.query.name) ? route.query.name : '';
  loading.value = true;
  queryParams.value = {
    first: (page - 1) * dt.value.rows,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  };
  await getData();
  loading.value = false;
}

const updateQueryParam = () => {
  // 获取当前查询参数对象
  const currentQueryParams = {...route.query};

  // 修改查询参数的值
  currentQueryParams.page = (queryParams.value.first / dt.value.rows + 1).toString();
  currentQueryParams.size = dt.value.rows;
  if (!_isEmpty(queryParams.value.filters.name.value))
    currentQueryParams.name = queryParams.value.filters.name.value;

  // 使用 router.push 更新 URL
  router.push({path: route.path, query: currentQueryParams});
};
//endregion


onMounted(() => {
  initQueryParam();
})

const onPage = (ev) => {
  queryParams.value = ev;
  getData();
};
const onSort = (ev) => {
  initPageSize();
  queryParams.value = ev;
  getData();
};
const onFilter = () => {
  initPageSize();
  queryParams.value.filters = filters.value;
  getData();
};

const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const getData = async () => {
  loading.value = true;
  const res = await axios.post(API.FILE_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    list.value = res.data.data;
    totalRecords.value = res.data.total
  } else {
    toast.add(new PToast().error(res.message));
  }
  loading.value = false;
  first.value = queryParams.value.first;
  updateQueryParam();
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
  <DataTable ref="dt" :value="list" class="p-datatable-sm small-font" :alwaysShowPaginator="list.length !== 0"
             lazy v-model:filters="filters" :totalRecords="totalRecords" :loading="loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator :rows="10" :first="first" stripedRows size="small"
             v-model:selection="selectedItems" dataKey="id" removableSort
             scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="{first} to {last} of {totalRecords}" responsiveLayout="scroll">
    <template #header>
      <BlockUI :blocked="editBlock" class="relative">
        <Button variant="text" severity="danger" :disabled="!selectedItems.length"
                outlined @click="confirmDeleteSelected">
          <template #icon>
            <span class="material-symbols-outlined">delete_forever</span>
          </template>
        </Button>
        <Button variant="text" severity="help" :disabled="selectedItems.length"
                outlined @click="exportCSV">
          <template #icon>
            <span class="material-symbols-outlined">open_in_new</span>
          </template>
        </Button>
        <MultiSelect :model-value="selectedColumns" :options="columns" optionLabel="header"
                     @update:modelValue="onToggle" class="text-end" size="small"
                     :placeholder="t('SelectedDisplayColumns')"
                     style="width: 200px;right: 0;position: absolute;top: 50%;transform: translateY(-50%)"/>
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

    <Column style="width: 50px">
      <template #body="slotProps">
        <Button class="p-button-link" size="small" icon="pi pi-pencil"
                @click="loadEditor(META.ENTITY.FILE, slotProps.data, dialog)"/>
      </template>
    </Column>
    <Column style="width: 32px">
      <template #body="slotProps">
        <div v-html="getIcon(slotProps.data.name).svg"/>
      </template>
    </Column>
    <Column :header="t('Name')" field="name" :showFilterMenu="false"
            exportHeader="name" :sortable="true">
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 60%" size="small" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('Size')" field="size" :showFilterMenu="false" :sortable="true" style="width: 120px" />
    <Column :header="t('AddedTime')" field="addedTime" :showFilterMenu="false" :sortable="true" style="width: 250px" />
    <Column :header="t('EditedTime')" field="editedTime" :showFilterMenu="false" :sortable="true" style="width: 250px" />

    <Column v-for="(col, index) of selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style scoped lang="scss" >
@use "@/assets/entity-manager";
</style>