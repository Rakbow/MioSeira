<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/entryService";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import {useOptionsStore} from '@/store/entityOptions';

const optionsStore = useOptionsStore();
const route = useRoute();
const router = useRouter();
const first = ref();
const dialog = useDialog();
const toast = useToast();
const {t} = useI18n();
const entries = ref([]);
const dt = ref();
const filters = ref({
  'searchType': {value: optionsStore.entryCurrent},
  'name': {value: ''},
});
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedEntries = ref([]);
const selectedColumns = ref([]);
const columns = ref([
  {field: 'remark', header: t('Remark')},
  {field: 'addedTime', header: t('AddedTime')},
  {field: 'editedTime', header: t('EditedTime')},
]);
const queryParams = ref({});
const option = ref<any>({});
const entrySearchType = ref();
const switchEntrySearchType = (ev) => {
  if (ev.value === null)
    entrySearchType.value = META.ENTRY_SEARCH_TYPE_SET[optionsStore.entryCurrent - 1];
  optionsStore.entryCurrent = parseInt(entrySearchType.value.value);
  switchEntityInfo();
  queryParams.value.filters.searchType.value = optionsStore.entryCurrent;
  getEntries();
}

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
  await getEntries();
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

onBeforeMount(() => {
  initOption();
})

const initOption = async () => {
  await optionsStore.fetchOptions();
  option.value = optionsStore.options;
  entrySearchType.value = META.ENTRY_SEARCH_TYPE_SET[optionsStore.entryCurrent - 1];
}

const onPage = (ev) => {
  queryParams.value = ev;
  getEntries();
};
const onSort = (ev) => {
  initPageSize();
  queryParams.value = ev;
  getEntries();
};
const onFilter = () => {
  initPageSize();
  queryParams.value.filters = filters.value;
  getEntries();
};

const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const getEntries = async () => {
  loading.value = true;
  const res = await axios.post(API.GET_ENTRY_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    entries.value = res.data.data;
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

const tableName = ref();
const entityType = ref();
const switchEntityInfo = () => {
  if (optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.PRODUCT) {
    tableName.value = 'product';
    entityType.value = META.ENTITY.PRODUCT;
  } else if (optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.PERSON) {
    tableName.value = 'person';
    entityType.value = META.ENTITY.PERSON;
  } else if (optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.CHARACTER) {
    tableName.value = 'character';
    entityType.value = META.ENTITY.CHARACTER;
  } else {
    tableName.value = 'subject';
    entityType.value = META.ENTITY.SUBJECT;
  }
}

</script>

<template>
  <DataTable ref="dt" :value="entries" class="p-datatable-sm small-font" :alwaysShowPaginator="entries.length !== 0"
             lazy v-model:filters="filters" :totalRecords="totalRecords" :loading="loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator :rows="10" :first="first" stripedRows size="small"
             v-model:selection="selectedEntries" dataKey="id" removableSort
             scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="{first} to {last} of {totalRecords}" responsiveLayout="scroll">
    <template #header>
      <BlockUI :blocked="editBlock" class="grid">
        <div class="col-8">
          <SelectButton size="small" v-model="entrySearchType" :options="META.ENTRY_SEARCH_TYPE_SET"
                        @change="switchEntrySearchType($event)"
                        optionLabel="value" dataKey="value" ariaLabelledby="custom">
            <template #option="slotProps">
              <span class="material-symbols-outlined">{{ slotProps.option.icon }}</span>
            </template>
          </SelectButton>
          <Button :label="$t('Delete')" icon="pi pi-trash" class="p-button-danger p-button-sm ml-2"
                  @click="confirmDeleteSelected"
                  :disabled="!selectedEntries || !selectedEntries.length" style="width: 6em"/>
          <Button :label="$t('Export')" icon="pi pi-external-link" class="ml-2 p-button-help p-button-sm"
                  @click="exportCSV()" style="width: 6em"/>
        </div>
        <div class="col-4">
          <MultiSelect :model-value="selectedColumns" :options="columns" optionLabel="header"
                       @update:modelValue="onToggle" class="text-end" size="small"
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
        <Button class="p-button-link" size="small" icon="pi pi-pencil"
                @click="loadEditor(entityType, slotProps.data, dialog)"/>
      </template>
    </Column>

    <Column :header="$t('Name')" field="name" :showFilterMenu="false"
            exportHeader="name" :sortable="true" style="flex: 0 0 5rem">
      <template #body="slotProps">
        <a :href="`${tableName}/${slotProps.data.id}`">
          <div class="text-container" :title="slotProps.data.name">
            {{ slotProps.data.name }}
          </div>
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText class="w-full" size="small" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="$t('NameZh')" field="nameZh" :showFilterMenu="false" :sortable="true"/>
    <Column :header="$t('NameEn')" field="nameEn" :showFilterMenu="false" :sortable="true"/>

    <Column :header="$t('Date')" :sortable="true" field="date"
            v-if="optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.PRODUCT"/>
    <Column :header="$t('Type')" :sortable="true" field="type"
            v-if="optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.PRODUCT">
      <template #body="slotProps">
        <div style="display: flex;justify-content: center;">
          <Tag :value="slotProps.data.type.label"/>
        </div>
      </template>
    </Column>

    <Column :header="$t('Date')" :sortable="true" field="birthDate"
            v-if="optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.PERSON || optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.CHARACTER"/>
    <Column :header="$t('Gender')" :sortable="true" field="gender"
            v-if="optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.PERSON || optionsStore.entryCurrent === META.ENTRY_SEARCH_TYPE.CHARACTER">
      <template #body="slotProps">
        <div style="display: flex;justify-content: center;">
          <Tag :value="slotProps.data.gender.label"/>
        </div>
      </template>
    </Column>

    <Column v-for="(col, index) of selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style lang="scss" scoped>
@use "@/assets/entity-manager";
</style>