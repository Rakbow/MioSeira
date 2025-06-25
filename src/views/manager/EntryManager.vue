<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/entryService";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import {EntityManageQueryParams, useEntityStore} from '@/logic/entityService';
import {PublicHelper} from "@/toolkit/publicHelper";
import {PColumn} from "@/logic/frame";

const store = useEntityStore();
const route = useRoute();
const router = useRouter();
const first = ref();
const dialog = useDialog();
const toast = useToast();
const {t} = useI18n();
const entries = ref([]);
const dt = ref();
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedEntries = ref([]);
const selectedColumns = ref(new Array<PColumn>());
const columns = ref([
    new PColumn('remark', t('Remark')),
    new PColumn('addedTime', t('AddedTime')),
    new PColumn('editedTime', t('EditedTime'))
]);
const queryParams = ref(new EntityManageQueryParams());
const filters = ref({
  type: {value: store.entryCurrent},
  name: {value: ''}
});
const entryType = ref();

onBeforeMount(async () => {
  entryType.value = META.ENTRY_TYPE_SET[store.entryCurrent - 1];
})

onMounted(() => {
  initQueryParam();
  getEntries();
})

const switchEntryType = (ev: any) => {
  if (ev.value === null)
    entryType.value = META.ENTRY_TYPE_SET[0];
  store.entryCurrent = parseInt(entryType.value.value);
  queryParams.value.filters.type.value = store.entryCurrent;
  getEntries();
}

const initQueryParam = async () => {
  let page: number = PublicHelper.isNotUndefined(route.query.page) ? parseInt(route.query.page!.toString()) : 1;

  queryParams.value.first = (page - 1) * dt.value.rows;
  queryParams.value.rows = dt.value.rows;
  queryParams.value.filters = filters.value;
  queryParams.value.filters.name.value = PublicHelper.isNotUndefined(route.query.name) ? route.query.name!.toString() : '';
}

const updateQueryParam = () => {
  // 获取当前查询参数对象
  const currentQueryParams = {...route.query};

  // 修改查询参数的值
  currentQueryParams.page = (queryParams.value.first / dt.value.rows + 1).toString();
  currentQueryParams.size = dt.value.rows;

  if (PublicHelper.isNotEmpty(queryParams.value.filters.type.value)) {
    currentQueryParams.type = queryParams.value.filters.type.value;
  }else {
    delete currentQueryParams.type;
  }

  if (PublicHelper.isNotEmpty(queryParams.value.filters.name.value)) {
    currentQueryParams.name = queryParams.value.filters.name.value;
  }else {
    delete currentQueryParams.name;
  }

  if (PublicHelper.isNotEmpty(queryParams.value.sortField)) {
    currentQueryParams.sortField = queryParams.value.sortField;
    currentQueryParams.sortOrder = queryParams.value.sortOrder.toString();
  }else {
    delete currentQueryParams.sortField;
    delete currentQueryParams.sortOrder;
  }

  // 使用 router.push 更新 URL
  router.push({path: route.path, query: currentQueryParams});
};
//endregion

const onPage = (ev: any) => {
  queryParams.value.first = ev.first;
  queryParams.value.rows = ev.rows;
  getEntries();
};
const onSort = (ev: any) => {
  queryParams.value.initPage(dt.value.rows);
  queryParams.value.sortField = ev.sortField;
  queryParams.value.sortOrder = ev.sortOrder;
  getEntries();
};
const onFilter = () => {
  queryParams.value.initPage(dt.value.rows);
  queryParams.value.filters = filters.value;
  getEntries();
};

const onToggle = (val: PColumn[]) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const getEntries = async () => {

  if(PublicHelper.isEmpty(queryParams.value.sortField)) {
    queryParams.value.sortField = 'items';
    queryParams.value.sortOrder = -1;
  }
  first.value = queryParams.value.first;
  updateQueryParam();

  loading.value = true;
  const res = await axios.post(API.ENTRY_GET_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    entries.value = res.data.data;
    totalRecords.value = res.data.total
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  loading.value = false;
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
      <BlockUI :blocked="editBlock" class="relative">
        <SelectButton size="small" v-model="entryType" :options="META.ENTRY_TYPE_SET"
                      @change="switchEntryType($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="slotProps">
            <span class="material-symbols-outlined" style="font-size: 20px" :title="t(slotProps.option.label)">
            {{ slotProps.option.icon }}
          </span>
          </template>
        </SelectButton>
        <Button variant="text" severity="danger" :disabled="!selectedEntries.length"
                outlined @click="confirmDeleteSelected">
          <template #icon>
            <span class="material-symbols-outlined">delete_forever</span>
          </template>
        </Button>
        <Button variant="text" severity="help" :disabled="selectedEntries.length"
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

    <Column selectionMode="multiple" style="width: 45px" exportable/>
    <Column style="width: 45px">
      <template #body="slotProps">
        <Button class="p-button-link" size="small" icon="pi pi-pencil"
                @click="loadEditor(slotProps.data, dialog)"/>
      </template>
    </Column>
    <Column style="width: 35px">
      <template #body="prop">
        <img v-if="prop.data.thumb" :alt="prop.data.name" :src="`${API.STATIC_DOMAIN}${prop.data.thumb}`" style="width: 25px" />
        <img v-else :alt="prop.data.name" :src="API.COMMON_EMPTY_THUMB_IMAGE" style="width: 25px" />
      </template>
    </Column>

    <Column :header="t('Name')" field="name" :showFilterMenu="false"
            exportHeader="name" :sortable="true" style="flex: 0 0 5rem">
      <template #body="slotProps">
        <a :href="`${API.ENTRY_DETAIL_PATH}/${slotProps.data.id}`">
          <div class="text-container" :title="slotProps.data.name">
            {{ slotProps.data.name }}
          </div>
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" size="small" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('NameZh')" field="nameZh" :showFilterMenu="false" :sortable="true"/>
    <Column :header="t('NameEn')" field="nameEn" :showFilterMenu="false" :sortable="true"/>

    <Column :header="t('Date')" :sortable="true" field="date" :showFilterMenu="false"
            v-if="store.entryCurrent !== META.ENTRY_TYPE.CLASSIFICATION
             &&　store.entryCurrent !== META.ENTRY_TYPE.MATERIAL" style="width: 150px"/>

    <Column :header="t('Type')" :sortable="true" field="subType"
            v-if="store.entryCurrent === META.ENTRY_TYPE.PRODUCT" style="width: 80px">
      <template #body="slotProps">
        <Tag :value="slotProps.data.subType.label"/>
      </template>
    </Column>
    <Column :header="t('Gender')" :sortable="true" field="gender" :showFilterMenu="false"
            v-if="store.entryCurrent === META.ENTRY_TYPE.PERSON
             || store.entryCurrent === META.ENTRY_TYPE.CHARACTER" style="width: 60px">
      <template #body="slotProps">
        <Tag :value="slotProps.data.gender.label"/>
      </template>
    </Column>
    <Column :header="t('Item')" field="items" :sortable="true" :showFilterMenu="false" style="width: 60px" />

    <Column v-for="(col, index) of selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style lang="scss" scoped>
@use "@/assets/entity-manager";
</style>