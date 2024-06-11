<script setup lang="ts">
import {onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useDialog} from "primevue/usedialog";
import {API} from "@/config/Web_Helper_Strs.ts";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {META} from "@/config/Web_Const.ts";

//region query
const route = useRoute();
const router = useRouter();
const first = ref();
const initQueryParam = async () => {
  let page = !_isUndefined(route.query.page) ? route.query.page : 1;
  filters.value.name.value = !_isUndefined(route.query.name) ? route.query.name : '';
  filters.value.isbn10.value = !_isUndefined(route.query.isbn10) ? route.query.isbn10 : '';
  filters.value.ean13.value = !_isUndefined(route.query.ean13) ? route.query.ean13 : '';
  filters.value.region.value = !_isUndefined(route.query.region) ? route.query.region : '';
  filters.value.lang.value = !_isUndefined(route.query.lang) ? route.query.lang : '';
  filters.value.bookType.value = !_isUndefined(route.query.bookType) ? route.query.bookType : null;
  filters.value.hasBonus.value = !_isUndefined(route.query.hasBonus) ? route.query.hasBonus : null;
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
  if (!_isEmpty(queryParams.value.filters.isbn10.value))
    currentQueryParams.isbn10 = queryParams.value.filters.isbn10.value;
  if (!_isEmpty(queryParams.value.filters.ean13.value))
    currentQueryParams.ean13 = queryParams.value.filters.ean13.value;
  if (!_isEmpty(queryParams.value.filters.region.value))
    currentQueryParams.region = queryParams.value.filters.region.value;
  if (!_isEmpty(queryParams.value.filters.lang.value))
    currentQueryParams.lang = queryParams.value.filters.lang.value;
  if (!_isEmpty(queryParams.value.filters.bookType.value))
    currentQueryParams.bookType = queryParams.value.filters.bookType.value;
  if (!_isEmpty(queryParams.value.filters.hasBonus.value))
    currentQueryParams.hasBonus = queryParams.value.filters.hasBonus.value;

  // 使用 router.push 更新 URL
  router.push({path: route.path, query: currentQueryParams});
};
//endregion


onMounted(() => {
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
  'isbn10': {value: ''},
  'ean13': {value: ''},
  'region': {value: ''},
  'lang': {value: ''},
  'bookType': {value: null},
  'hasBonus': {value: null}
});
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedItems = ref([]);
const selectedColumns = ref([]);
const columns = ref([
  {field: 'nameZh', header: t('BookChineseTitle')},
  {field: 'nameEn', header: t('BookEnglishTitle')},
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
  option.value.currencySet = res.data.currencySet;
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
  <div class="flex justify-content-start">
    <DataTable ref="dt" :value="items" class="p-datatable-sm" :alwaysShowPaginator="items.length !== 0"
               lazy v-model:filters="filters" :totalRecords="totalRecords" :loading="loading"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" :globalFilterFields="['name', 'nameZh', 'nameEn', 'catalogNo', 'barcode']"
               paginator :rows="10" :first="first" columnResizeMode="fit"
               v-model:selection="selectedItems" dataKey="id" removableSort
               scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]" showGridlines
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}"
               responsiveLayout="scroll">
      <template #header>
        <BlockUI :blocked="editBlock" class="grid">
          <div class="col-8">
            <Button :label="$t('Add')" icon="pi pi-plus" class="p-button-success p-button-sm mr-2"
                    @click="openAddDialog" style="width: 6em"/>
            <Button :label="$t('Delete')" icon="pi pi-trash" class="p-button-danger p-button-sm mr-2"
                    @click="confirmDeleteSelected"
                    :disabled="!selectedItems || !selectedItems.length" style="width: 6em"/>
            <Button label="导出(CSV)" icon="pi pi-external-link" class="ml-2 p-button-help p-button-sm"
                    @click="exportCSV()" style="width: 8em"/>
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
          <Button class="p-button-link" icon="pi pi-pencil" @click="loadEditor(dialog, slotProps.data, option)"/>
        </template>
      </Column>
      <Column :header="$t('BookTitle')" field="name" :showFilterMenu="false"
              exportHeader="name" sortable style="flex: 0 0 5rem">
        <template #body="slotProps">
          <a :href="API.ITEM_DETAIL + '/' + slotProps.data.id">
            {{ slotProps.data.name }}
          </a>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$t('BookISBN10')" field="isbn10" sortable :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$t('BookISBN13')" field="ean13" sortable :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
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
      <Column :header="$t('PublishDate')" field="releaseDate" sortable/>
      <Column :header="$t('Price')" field="price" sortable>
        <template #body="slotProps">
          {{ `${slotProps.data.price} ${slotProps.data.currency}` }}
        </template>
      </Column>
      <Column :header="$t('Region')" filterField="region" :showFilterMenu="false" style="flex: 0 0 9rem">
        <template #body="slotProps">
          <span :class="'fi fi-' + slotProps.data.region.value" style="margin-left: 0.5rem"
                v-tooltip.bottom="{value: slotProps.data.region.label, class: 'region-tooltip'}"></span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Select v-model="filterModel.value" :options="option.regionSet" :filter="true" @change="filterCallback()"
                    :showClear="true" optionLabel="label" optionValue="value">
            <template #value="slotProps">
              <div class="country-item" v-if="slotProps.value">
                <span :class="'fi fi-' + slotProps.value"></span>
                <div class="ml-2">{{ slotProps.value.label }}</div>
              </div>
              <span v-else>{{ $t('PlaceholderRegion') }}</span>
            </template>
            <template #option="slotProps">
              <div class="country-item">
                <span :class="'fi fi-' + slotProps.option.value"></span>
                <div class="ml-2">{{ slotProps.option.label }}</div>
              </div>
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
      <Column :header="$t('Bonus')" field="hasBonus" dataType="boolean" bodyClass="text-center" style="flex: 0 0 3rem">
        <template #body="{data}">
          <i class="pi"
             :class="{'true-icon pi-check-circle': data!.hasBonus, 'false-icon pi-times-circle': !data!.hasBonus}"></i>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Checkbox v-model="filterModel.value" indeterminate binary :filter="true" @change="filterCallback()"/>
        </template>
      </Column>
      <Column v-for="(col, index) of selectedColumns" :field="col.field"
              :header="col.header" :key="col.field + '_' + index" sortable/>
    </DataTable>
  </div>

  <Dialog modal v-model:visible="displayAddDialog"
          style="width: 600px" :header="$t('Add')" class="p-fluid">
    <BlockUI :blocked="editBlock" class="p-fluid">
      <div class="formgrid grid">
        <div class="field col">
          <label>{{ $t('BookISBN10') }}<span style="color: red">*</span></label>
          <InputGroup>
            <InputText v-model="itemAdd.isbn10"/>
            <Button icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('isbn10', itemAdd.ean13)"
                    v-tooltip.bottom="{value:$t('TooltipGenerateBookISBN10'), class: 'common-tooltip'}"/>
          </InputGroup>
        </div>
        <div class="field col">
          <label>{{ $t('BookISBN13') }}<span style="color: red">*</span></label>
          <InputGroup class="p-inputgroup">
            <InputText v-model="itemAdd.ean13"/>
            <Button icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('ean13', itemAdd.isbn10)"
                    v-tooltip.bottom="{value:$t('TooltipGenerateBookISBN13'), class: 'common-tooltip'}"/>
          </InputGroup>
        </div>
      </div>
      <div class="field">
        <label>{{ $t('BookTitle') }}<span style="color: red">*</span></label>
        <InputText v-model="itemAdd.name"/>
      </div>
      <div class="field">
        <label>{{ $t('BookChineseTitle') }}</label>
        <InputText v-model="itemAdd.nameZh"/>
      </div>
      <div class="field">
        <label>{{ $t('BookEnglishTitle') }}</label>
        <InputText v-model="itemAdd.nameEn"/>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label class="mb-3">{{ $t('BookType') }}<span style="color: red">*</span></label>
          <Select v-model="itemAdd.bookType" :options="option.bookTypeSet"
                    optionLabel="label" optionValue="value"/>
        </div>
        <div class="field col">
          <label class="mb-3">{{ $t('Region') }}<span style="color: red">*</span></label>
          <Select v-model="itemAdd.region" :options="option.regionSet" :filter="true"
                    :showClear="true" optionLabel="label" optionValue="value">
            <template #value="slotProps">
              <div class="country-item" v-if="slotProps.value">
                <span :class="'fi fi-' + slotProps.value"></span>
                <div class="ml-2">{{ slotProps.value.label }}</div>
              </div>
              <span v-else>{{ $t('PlaceholderRegion') }}</span>
            </template>
            <template #option="slotProps">
              <div class="country-item">
                <span :class="'fi fi-' + slotProps.option.value"></span>
                <div class="ml-2">{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
        </div>
        <div class="field col">
          <label class="mb-3">{{ $t('Language') }}<span style="color: red">*</span></label>
          <Select v-model="itemAdd.lang" :options="option.languageSet"
                    optionLabel="label" optionValue="value"/>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <div class="col-12">
            <label class="mb-3">{{ $t('Bonus') }}</label>
          </div>
          <div class="col-12 mt-4">
            <ToggleSwitch v-model="itemAdd.hasBonus" />
          </div>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-6">
          <label>{{ $t('PublishDate') }}<span style="color: red">*</span></label>
          <InputMask v-model="itemAdd!.releaseDate" mask="****/**/**"/>
        </div>
        <div class="field col">
          <label>{{ $t('PublishPrice') }}</label>
          <InputNumber v-model="itemAdd!.price"/>
        </div>
        <div class="field col-3">
          <label>{{ $t('CurrencyUnit') }}</label>
          <Select v-model="itemAdd.currency" :options="option.currencySet"
                    optionLabel="label" optionValue="value" :placeholder="$t('PlaceholderCurrencyUnit')"/>
        </div>
      </div>
      <div class="field">
        <label>{{ $t('Summary') }}</label>
        <Textarea v-model="itemAdd.summary" rows="3" cols="20" :autoResize="true"/>
      </div>
      <div class="field">
        <label>{{ $t('Remark') }}</label>
        <Textarea v-model="itemAdd!.remark" rows="3" cols="20" :autoResize="true"/>
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text" @click="closeAddDialog"
              :disabled="editBlock"/>
      <Button :label="$t('Save')" icon="pi pi-check" class="p-button-text" @click="submitAddItem"
              :disabled="editBlock"/>
    </template>
  </Dialog>

</template>

<style scoped>

</style>