<script setup lang="ts">
import {onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const.ts";
import {API} from '@/config/Web_Helper_Strs.ts';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/itemService";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const route = useRoute();
const router = useRouter();
const first = ref();
const dialog = useDialog();
const toast = useToast();
const {t} = useI18n();
const items = ref([]);
const itemAdd = ref();
const dt = ref();
const filters = ref({
  'itemType': {value: META.ITEM_TYPE.ALBUM},
  'name': {value: ''},
  'nameZh': {value: ''},
  'nameEn': {value: ''},
  'catalogNo': {value: ''},
  'region': {value: ''},
  'releaseType': {value: null},
  'barcode': {value: ''},
  'bonus': {value: null},
  'albumFormat': {value: null},
  'mediaFormat': {value: null},
});
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedItems = ref([]);
const selectedColumns = ref([]);
const columns = ref([
  {field: 'nameEn', header: t('NameEn')},
  {field: 'nameZh', header: t('NameZh')},
  {field: 'remark', header: t('Remark')},
  {field: 'releaseDate', header: t('ReleaseDate')},
  {field: 'price', header: t('Price')},
  {field: 'addedTime', header: t('AddedTime')},
  {field: 'editedTime', header: t('EditedTime')},
]);
const queryParams = ref({});
const option = ref<any>({});

const initQueryParam = async () => {
  let page = !_isUndefined(route.query.page) ? route.query.page : 1;
  filters.value.name.value = !_isUndefined(route.query.name) ? route.query.name : '';
  filters.value.nameZh.value = !_isUndefined(route.query.nameZh) ? route.query.nameZh : '';
  filters.value.nameEn.value = !_isUndefined(route.query.nameEn) ? route.query.nameEn : '';
  filters.value.catalogNo.value = !_isUndefined(route.query.catalogNo) ? route.query.catalogNo : '';
  filters.value.barcode.value = !_isUndefined(route.query.barcode) ? route.query.barcode : '';
  filters.value.region.value = !_isUndefined(route.query.region) ? route.query.region : '';
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
  if (!_isEmpty(queryParams.value.filters.nameZh.value))
    currentQueryParams.nameZh = queryParams.value.filters.nameZh.value;
  if (!_isEmpty(queryParams.value.filters.nameEn.value))
    currentQueryParams.nameEn = queryParams.value.filters.nameEn.value;
  if (!_isEmpty(queryParams.value.filters.catalogNo.value))
    currentQueryParams.catalogNo = queryParams.value.filters.catalogNo.value;
  if (!_isEmpty(queryParams.value.filters.barcode.value))
    currentQueryParams.barcode = queryParams.value.filters.barcode.value;
  if (!_isEmpty(queryParams.value.filters.region.value))
    currentQueryParams.region = queryParams.value.filters.region.value;
  if (!_isEmpty(queryParams.value.filters.bonus.value))
    currentQueryParams.bonus = queryParams.value.filters.bonus.value;
  if (!_isEmpty(queryParams.value.filters.releaseType.value))
    currentQueryParams.releaseType = queryParams.value.filters.releaseType.value;

  // 使用 router.push 更新 URL
  router.push({path: route.path, query: currentQueryParams});
};
//endregion


onMounted(() => {
  initOption();
  initQueryParam();
})

const initOption = async () => {
  const res = await axios.post(API.GET_ITEM_OPTION, {type: META.ITEM_TYPE.ALBUM});
  option.value.albumFormatSet = res.data.albumFormatSet;
  option.value.releaseTypeSet = res.data.releaseTypeSet;
  option.value.mediaFormatSet = res.data.mediaFormatSet;
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
    type: META.ITEM_TYPE.ALBUM
  };
  displayAddDialog.value = true;
}

const closeAddDialog = () => {
  itemAdd.value = {};
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

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<template>
  <div class="flex justify-content-center">
    <DataTable ref="dt" :value="items" class="p-datatable-sm" :alwaysShowPaginator="items.length !== 0"
               lazy v-model:filters="filters" :totalRecords="totalRecords" :loading="loading"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" :globalFilterFields="['name', 'nameZh', 'nameEn', 'catalogNo', 'ean13']"
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
      <Column :header="$t('Name')" field="name" :showFilterMenu="false"
              exportHeader="name" :sortable="true" style="flex: 0 0 5rem">
        <template #body="slotProps">
          <a :href="API.ITEM_DETAIL + '/' + slotProps.data.id">
            {{ slotProps.data.name }}
          </a>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$t('AlbumCatalogNo')" field="catalogNo" :sortable="true" :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
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
      <Column :header="$t('Barcode')" field="barcode" :sortable="true" :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$t('ReleaseDate')" field="releaseDate" :sortable="true"/>
      <Column :header="$t('Price')" field="price" :sortable="true">
        <template #body="slotProps">
          {{ `${slotProps.data.price} ${slotProps.data.currency}` }}
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
      <Column :header="$t('AlbumFormat')" filterField="albumFormat" :showFilterMenu="false" style="flex: 0 0 8rem">
        <template #body="slotProps">
          <ul>
            <li v-for="data in slotProps.data.albumFormat">
              {{ data.label }}
            </li>
          </ul>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" style="width: 7rem"
                       :options="option.albumFormatSet" optionLabel="label" optionValue="value"
                       display="chip" :filter="true"/>
        </template>
      </Column>
      <Column :header="$t('MediaFormat')" filter-field="mediaFormat" :showGilterMenu="false" style="flex: 0 0 8rem">
        <template #body="slotProps">
          <ul>
            <li v-for="data in slotProps.data.mediaFormat">
              {{ data.label }}
            </li>
          </ul>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" style="width: 7rem"
                       :options="option.mediaFormatSet" optionLabel="label" optionValue="value"
                       display="chip" :filter="true"/>
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
  </div>

  <Dialog modal v-model:visible="displayAddDialog"
          style="width: 600px" :header="$t('Add')" class="p-fluid">
<!--    <BlockUI :blocked="editBlock">-->
<!--      <div class="formgrid grid">-->
<!--        <div class="field col">-->
<!--          <label>{{ $t('Name') }}<span style="color: red">*</span></label>-->
<!--          <InputText id="name" v-model="itemAdd.name"/>-->
<!--        </div>-->
<!--        <div class="field col">-->
<!--          <label>{{ $t('NameEn') }}</label>-->
<!--          <InputText id="nameEn" v-model="itemAdd.nameEn"/>-->
<!--        </div>-->
<!--        <div class="field col">-->
<!--          <label>{{ $t('NameZh') }}</label>-->
<!--          <InputText id="nameZh" v-model="itemAdd.nameZh"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="formgrid grid">-->
<!--        <div class="field col">-->
<!--          <label>{{ $t('AlbumCatalogNo') }}</label>-->
<!--          <InputText id="catalogNo" v-model.trim="itemAdd.catalogNo"/>-->
<!--        </div>-->
<!--        <div class="field col">-->
<!--          <label>{{ $t('Barcode') }}</label>-->
<!--          <InputText id="ean13" v-model.trim="itemAdd.ean13"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="formgrid grid">-->
<!--        <div class="field col-6">-->
<!--          <label>{{ $t('ReleaseDate') }}<span style="color: red">*</span></label>-->
<!--          <InputMask v-model="itemAdd!.releaseDate" mask="****/**/**"/>-->
<!--        </div>-->
<!--        <div class="field col-3">-->
<!--          <label>{{ $t('ReleasePrice') }}</label>-->
<!--          <InputNumber id="price" v-model="itemAdd!.price"/>-->
<!--        </div>-->
<!--        <div class="field col-3">-->
<!--          <label>{{ $t('CurrencyUnit') }}</label>-->
<!--          <Select v-model="itemAdd.currency" :options="option.currencySet"-->
<!--                    optionLabel="label" optionValue="value" :placeholder="$t('PlaceholderCurrencyUnit')"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="formgrid grid">-->
<!--        <div class="field col">-->
<!--          <div class="col-12">-->
<!--            <label class="mb-3">{{ $t('Bonus') }}</label>-->
<!--          </div>-->
<!--          <div class="col-12 mt-4">-->
<!--            <ToggleSwitch v-model="itemAdd.hasBonus" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="formgrid grid">-->
<!--        <div class="field col-4">-->
<!--          <label class="mb-3">{{ $t('PublishFormat') }}<span-->
<!--              style="color: red">*</span></label>-->
<!--          <MultiSelect id="publishFormat" v-model="itemAdd.publishFormat" :options="option.publishFormatSet"-->
<!--                       optionLabel="label" optionValue="value" display="chip"/>-->
<!--        </div>-->
<!--        <div class="field col-4">-->
<!--          <label class="mb-3">{{ $t('AlbumFormat') }}<span style="color: red">*</span></label>-->
<!--          <MultiSelect id="albumFormat" v-model="itemAdd.albumFormat" :options="option.albumFormatSet"-->
<!--                       optionLabel="label" optionValue="value" display="chip"/>-->
<!--        </div>-->
<!--        <div class="field col-4">-->
<!--          <label class="mb-3">{{ $t('MediaFormat') }}<span style="color: red">*</span></label>-->
<!--          <MultiSelect id="mediaFormat" v-model="itemAdd.mediaFormat" :options="option.mediaFormatSet"-->
<!--                       optionLabel="label" optionValue="value" display="chip"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="field">-->
<!--        <label>{{ $t('Remark') }}</label>-->
<!--        <Textarea id="remark" v-model="itemAdd!.remark" rows="3" cols="20" :autoResize="true"/>-->
<!--      </div>-->
<!--    </BlockUI>-->
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