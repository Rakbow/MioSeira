<script setup lang="ts">
import {onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useDialog} from "primevue/usedialog";
import {API} from "@/config/Web_Helper_Strs.ts";
import "flag-icons/css/flag-icons.min.css";
import {META} from "@/config/Web_Const.ts";

//region query
const route = useRoute();
const router = useRouter();
const first = ref();
const initQueryParam = async () => {
  let page = !_isUndefined(route.query.page) ? route.query.page : 1;
  filters.value.name.value = !_isUndefined(route.query.name) ? route.query.name : '';
  filters.value.barcode.value = !_isUndefined(route.query.barcode) ? route.query.barcode : '';
  filters.value.region.value = !_isUndefined(route.query.region) ? route.query.region : '';
  filters.value.lang.value = !_isUndefined(route.query.lang) ? route.query.lang : '';
  filters.value.bookType.value = !_isUndefined(route.query.bookType) ? route.query.bookType : null;
  filters.value.releaseType.value = !_isUndefined(route.query.releaseType) ? route.query.releaseType : null;
  loading.value = true;
  queryParams.value = {
    first: (page - 1) * dt.value.rows,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  };
  await getItems();
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
  if (!_isEmpty(queryParams.value.filters.barcode.value))
    currentQueryParams.barcode = queryParams.value.filters.barcode.value;
  if (!_isEmpty(queryParams.value.filters.region.value))
    currentQueryParams.region = queryParams.value.filters.region.value;
  if (!_isEmpty(queryParams.value.filters.lang.value))
    currentQueryParams.lang = queryParams.value.filters.lang.value;
  if (!_isEmpty(queryParams.value.filters.bookType.value))
    currentQueryParams.bookType = queryParams.value.filters.bookType.value;
  if (!_isEmpty(queryParams.value.filters.bonus.value))
    currentQueryParams.bonus = queryParams.value.filters.bonus.value;
  if (!_isEmpty(queryParams.value.filters.releaseType.value))
    currentQueryParams.releaseType = queryParams.value.filters.releaseType.value;

  // 使用 router.push 更新 URL
  router.push({path: route.path, query: currentQueryParams});
};
//endregion


onMounted(() => {
  console.log(t('ImageTypes'))
  initOption();
  initQueryParam();
})

const dialog = useDialog();
const toast = useToast();
const {t} = useI18n();
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/itemService";
const items = ref([]);
const itemAdd = ref<any>({});
const dt = ref();
const filters = ref({
  'itemType': {value: META.ITEM_TYPE.BOOK},
  'name': {value: ''},
  'barcode': {value: ''},
  'releaseType': {value: null},
  'region': {value: ''},
  'lang': {value: ''},
  'bookType': {value: null},
  'bonus': {value: null}
});
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedItems = ref([]);
const selectedColumns = ref([]);
const columns = ref([
  {field: 'remark', header: t('Remark')},
  {field: 'addedTime', header: t('AddedTime')},
  {field: 'editedTime', header: t('EditedTime')},
]);
const queryParams = ref({});
const option = ref({});

const initOption = async () => {
  const res = await axios.post(API.GET_ITEM_OPTION, {type: META.ITEM_TYPE.BOOK});
  option.value.bookTypeSet = res.data.bookTypeSet;
  option.value.regionSet = res.data.regionSet;
  option.value.languageSet = res.data.languageSet;
  option.value.releaseTypeSet = res.data.releaseTypeSet;
}

const onPage = (ev) => {
  queryParams.value = ev;
  getItems();
};
const onSort = (ev) => {
  queryParams.value = ev;
  getItems();
};
const onFilter = () => {
  queryParams.value.filters = filters.value;
  getItems();
};

const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const getItems = async () => {
  loading.value = true;
  const res = await axios.post(API.GET_ITEM_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    items.value = res.data.data;
    totalRecords.value = res.data.total
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  loading.value = false;
  first.value = queryParams.value.first;
  updateQueryParam();
}

//region item CRUD

const displayAddDialog = ref(false);
const displayDeleteDialog = ref(false);

const openAddDialog = () => {
  itemAdd.value = {
    type: META.ITEM_TYPE.BOOK,
    bookType: 0,
    lang: 'ja-JP',
    region: 'jp',
    currency: 'JPY',
  };
  displayAddDialog.value = true;
}

const closeAddDialog = () => {
  itemAdd.value = {
    bookType: 0,
    lang: 'ja-JP',
    region: 'jp',
    currency: 'JPY',
  };
  displayAddDialog.value = false;
}

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const submitAddItem = async () => {
  loading.value = true;
  const res = await axios.post(API.ADD_ITEM, itemAdd.value);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    closeAddDialog();
    await getItems();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  loading.value = false;
}
//endregion

const ISBNInterConvert = (label, isbn) => {
  editBlock.value = true;
  let json = {
    label: label,
    isbn: isbn
  };
  axios.post(API.BOOK_GENERATE_ISBN, json)
      .then(res => {
        if (res.state === axios.SUCCESS) {
          if (label === 'ean13') {
            itemAdd.value.ean13 = res.data;
          }
          if (label === 'isbn10') {
            itemAdd.value.isbn10 = res.data;
          }
        }
        editBlock.value = false;
      })
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<template>
  <DataTable ref="dt" :value="items" class="p-datatable-sm small-font" :alwaysShowPaginator="items.length !== 0"
             lazy v-model:filters="filters" :totalRecords="totalRecords" :loading="loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator :rows="10" :first="first" stripedRows size="small"
             v-model:selection="selectedItems" dataKey="id" removableSort
             scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="{first} to {last} of {totalRecords}" responsiveLayout="scroll">
    <template #header>
      <BlockUI :blocked="editBlock" class="grid">
        <div class="col-8">
          <Button :label="$t('Add')" icon="pi pi-plus" class="p-button-success p-button-sm mr-2"
                  @click="openAddDialog" style="width: 6em"/>
          <Button :label="$t('Delete')" icon="pi pi-trash" class="p-button-danger p-button-sm mr-2"
                  @click="confirmDeleteSelected"
                  :disabled="!selectedItems || !selectedItems.length" style="width: 6em"/>
          <Button :label="$t('Export')" icon="pi pi-external-link" class="ml-2 p-button-help p-button-sm"
                  @click="exportCSV()" style="width: 6em"/>
        </div>
        <div class="col-4">
          <MultiSelect :model-value="selectedColumns" :options="columns" optionLabel="header"
                       @update:modelValue="onToggle" class="text-end"
                       :placeholder="$t('SelectedDisplayColumns')" style="width: 20em"/>
        </div>
      </BlockUI>
    </template>
    <template #empty>
        <span class="emptyInfo">
            {{ $t('CommonDataTableEmptyInfo') }}
        </span>
    </template>
    <template #loading>
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <span>{{ $t('CommonDataTableLoadingInfo') }}</span>
    </template>
    <Column selectionMode="multiple" style="flex: 0 0 3rem" exportable/>
    <Column style="flex: 0 0 3rem">
      <template #body="slotProps">
        <Button class="p-button-link" size="small" icon="pi pi-pencil" @click="loadEditor(dialog, slotProps.data, option)"/>
      </template>
    </Column>
    <Column :header="$t('BookTitle')" field="name" :showFilterMenu="false"
            exportHeader="name" :sortable="true">
      <template #body="slotProps">
        <a :href="`${API.ITEM_DETAIL}/${slotProps.data.id}`">
          <div class="text-container" :title="slotProps.data.name">
            {{ slotProps.data.name }}
          </div>
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="$t('BookISBN13')" field="barcode" :sortable="true" :showFilterMenu="false">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" style="width: 130px"/>
      </template>
    </Column>
    <Column :header="$t('BookType')" filterField="bookType" :showFilterMenu="false" style="flex: 0 0 8rem">
      <template #body="slotProps">
        {{ slotProps.data.bookType.label }}
      </template>
      <template #filter="{filterModel,filterCallback}">
        <Select v-model="filterModel.value" :options="option.bookTypeSet" :filter="true" @change="filterCallback()"
                :showClear="true" optionLabel="label" optionValue="value"/>
      </template>
    </Column>
    <Column :header="$t('PublishDate')" field="releaseDate" :sortable="true"/>
    <Column :header="$t('Price')" field="price" :sortable="true">
      <template #body="slotProps">
        {{ `${slotProps.data.price} ${slotProps.data.currency}` }}
      </template>
    </Column>
    <Column :header="$t('Region')" filterField="region" :showFilterMenu="false" style="flex: 0 0 9rem">
      <template #body="slotProps">
        <span :class="`fi fi-${slotProps.data.region}`" style="margin-left: 0.5rem"/>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <Select v-model="filterModel.value" :options="META.RegionSet" @change="filterCallback()"
                :showClear="true" optionLabel="label" optionValue="value">
          <template #value="slotProps">
            <span :class="`fi fi-${slotProps.value}`"/>
          </template>
          <template #option="slotProps">
            <span :class="`fi fi-${slotProps.option.value}`"/>
          </template>
        </Select>
      </template>
    </Column>
    <Column :header="$t('Language')" filterField="lang" :showFilterMenu="false" style="flex: 0 0 8rem">
      <template #body="slotProps">
        {{ slotProps.data.lang.label }}
      </template>
      <template #filter="{filterModel,filterCallback}">
        <Select v-model="filterModel.value" :options="option.languageSet" :filter="true" @change="filterCallback()"
                :showClear="true" optionLabel="label" optionValue="value"/>
      </template>
    </Column>
    <Column :header="$t('ReleaseType')" filterField="releaseType" :showFilterMenu="false" style="flex: 0 0 9rem">
      <template #body="slotProps">
        {{ slotProps.data.releaseType.label }}
      </template>
      <template #filter="{filterModel,filterCallback}">
        <Select v-model="filterModel.value" @change="filterCallback()" style="width: 8rem"
                :options="option.releaseTypeSet" optionLabel="label" optionValue="value"/>
      </template>
    </Column>
    <Column :header="$t('Bonus')" field="bonus" dataType="boolean" bodyClass="text-center" style="flex: 0 0 3rem">
      <template #body="{data}">
        <i class="pi"
           :class="{'true-icon pi-check-circle': data!.bonus, 'false-icon pi-times-circle': !data!.bonus}"></i>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <Checkbox v-model="filterModel.value" indeterminate binary :filter="true" @change="filterCallback()"/>
      </template>
    </Column>
    <Column v-for="(col, index) of selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>

  <Dialog modal v-model:visible="displayAddDialog"
          style="width: 600px" :header="$t('Add')" class="p-fluid">
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text" @click="closeAddDialog"
              :disabled="editBlock"/>
      <Button :label="$t('Save')" icon="pi pi-check" class="p-button-text" @click="submitAddItem"
              :disabled="editBlock"/>
    </template>
  </Dialog>

</template>

<style lang="scss" scoped>
.text-container {
  width: 300px; /* 固定宽度 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏溢出部分 */
  text-overflow: ellipsis; /* 溢出时显示省略号 */
}
</style>