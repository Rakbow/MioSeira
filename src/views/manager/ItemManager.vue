<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const.ts";
import {API} from '@/config/Web_Helper_Strs.ts';
import {useI18n} from "vue-i18n";
import {loadCreator, loadEditor} from "@/logic/itemService";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import { useOptionsStore } from '@/store/entityOptions';

const optionsStore = useOptionsStore();
const route = useRoute();
const router = useRouter();
const first = ref();
const dialog = useDialog();
const toast = useToast();
const {t} = useI18n();
const items = ref([]);
const dt = ref();
const filters = ref({
  'itemType': {value: optionsStore.current},
  'name': {value: ''},
  'catalogId': {value: ''},
  'region': {value: ''},
  'releaseType': {value: null},
  'barcode': {value: ''},
  'bonus': {value: null},
});
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedItems = ref([]);
const selectedColumns = ref([]);
const columns = ref([
  {field: 'remark', header: t('Remark')},
  {field: 'releaseDate', header: t('ReleaseDate')},
  {field: 'price', header: t('Price')},
  {field: 'addedTime', header: t('AddedTime')},
  {field: 'editedTime', header: t('EditedTime')},
]);
const queryParams = ref({});
const option = ref<any>({});
const itemType = ref();
const switchItemType = (ev) => {
  if(ev.value === null)
    itemType.value = META.ITEM_TYPE_SET[optionsStore.current-1];
  optionsStore.current = parseInt(itemType.value.value);
  queryParams.value.filters.itemType.value = optionsStore.current;
  getItems();
}

const initQueryParam = async () => {
  let page = !_isUndefined(route.query.page) ? route.query.page : 1;
  filters.value.name.value = !_isUndefined(route.query.name) ? route.query.name : '';
  filters.value.catalogId.value = !_isUndefined(route.query.catalogId) ? route.query.catalogId : '';
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
  if (!_isEmpty(queryParams.value.filters.catalogId.value))
    currentQueryParams.catalogId = queryParams.value.filters.catalogId.value;
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
  initQueryParam();
})

onBeforeMount(() => {
  initOption();
})

const initOption = async () => {
  await optionsStore.fetchOptions();
  option.value = optionsStore.options;
  itemType.value = META.ITEM_TYPE_SET[optionsStore.current-1];
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
          <SelectButton size="small" v-model="itemType" :options="META.ITEM_TYPE_SET" @change="switchItemType($event)"
                        optionLabel="value" dataKey="value" ariaLabelledby="custom" optionDisabled="disabled">
            <template #option="slotProps">
              <span class="material-symbols-outlined">{{ slotProps.option.icon }}</span>
            </template>
          </SelectButton>
          <Button :label="$t('Add')" icon="pi pi-plus" class="p-button-success p-button-sm ml-2"
                  @click="loadCreator(dialog)" style="width: 6em"/>
          <Button :label="$t('Delete')" icon="pi pi-trash" class="p-button-danger p-button-sm ml-2"
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

    <ColumnGroup type="header">
      <Row>
        <Column :colspan="2" :rowspan="2" />
        <Column :header="$t('Name')" :rowspan="2" />
        <Column :header="$t('BasicInfo')" :colspan="7" />
      </Row>
      <Row>
        <Column :header="$t('CatalogId')" :sortable="true" field="catalogId" v-if="optionsStore.current !== META.ITEM_TYPE.BOOK" />
        <Column :header="$t('Barcode')" :sortable="true" field="barcode" />
        <Column :header="$t('ReleaseDate')" :sortable="true" field="releaseDate" />
        <Column :header="$t('Price')" :sortable="true" field="price" />
        <Column :header="$t('Region')" :sortable="true" field="region" />
        <Column :header="$t('ReleaseType')" :sortable="true" field="releaseType" />
        <Column :header="$t('Bonus')" :sortable="true" field="bonus" />
      </Row>
    </ColumnGroup>

    <Column selectionMode="multiple" style="flex: 0 0 3rem" exportable/>
    <Column style="flex: 0 0 3rem">
      <template #body="slotProps">
        <Button class="p-button-link" size="small" icon="pi pi-pencil" @click="loadEditor(slotProps.data, dialog)"/>
      </template>
    </Column>

    <Column :header="$t('Name')" field="name" :showFilterMenu="false"
            exportHeader="name" :sortable="true" style="flex: 0 0 5rem">
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

    <Column :header="$t('CatalogId')" field="catalogId" :showFilterMenu="false"
            v-if="optionsStore.current !== META.ITEM_TYPE.BOOK">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" style="width: 120px"/>
      </template>
    </Column>
    <Column :header="$t('Barcode')" field="barcode" :showFilterMenu="false">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" style="width: 130px"/>
      </template>
    </Column>
    <Column :header="$t('ReleaseDate')" field="releaseDate" />
    <Column :header="$t('Price')" field="price" >
      <template #body="slotProps">
        {{ `${slotProps.data.price} ${slotProps.data.currency}` }}
      </template>
    </Column>
    <Column :header="$t('Region')" filterField="region" style="flex: 0 0 9rem">
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
</template>

<style lang="scss" scoped>
@use "@/assets/entity-manager";
</style>