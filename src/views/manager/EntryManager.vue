<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useRoute, useRouter} from "vue-router";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/entryService";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import {EntityManageParam, useEntityStore} from '@/logic/entityService';
import {PublicHelper} from "@/toolkit/publicHelper";
import {PColumn} from "@/logic/frame";

const dt = ref();
const {t} = useI18n();
const dialog = useDialog();
const store = useEntityStore();
const route = useRoute();
const router = useRouter();
const param = ref(new EntityManageParam());
const entryType = ref();

onBeforeMount(async () => {
  entryType.value = META.ENTRY_TYPE_SET[store.entryCurrent === 0 ? 0 : store.entryCurrent - 1];
  param.value.query.initFilters({
    type: {value: store.entryCurrent},
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

const switchEntryType = (ev: any) => {
  if (ev.value === null)
    entryType.value = META.ENTRY_TYPE_SET[0];
  store.entryCurrent = parseInt(entryType.value.value);
  param.value.query.filters.type.value = store.entryCurrent;
  param.value.query.initPage(dt.value.rows);
  load();
}

const initQueryParam = async () => {
  let page: number = PublicHelper.isNotUndefined(route.query.page) ? parseInt(route.query.page!.toString()) : 1;

  param.value.query.first = (page - 1) * dt.value.rows;
  param.value.query.rows = dt.value.rows;
  param.value.query.filters.keyword.value = PublicHelper.isNotUndefined(route.query.keyword) ? route.query.keyword!.toString() : '';
}

const updateQueryParam = () => {
  // 获取当前查询参数对象
  const currentQueryParams = {...route.query};

  // 修改查询参数的值
  currentQueryParams.page = (param.value.query.first / dt.value.rows + 1).toString();
  currentQueryParams.size = dt.value.rows;

  if (PublicHelper.isNotEmpty(param.value.query.filters.type.value)) {
    currentQueryParams.type = param.value.query.filters.type.value;
  }else {
    delete currentQueryParams.type;
  }

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
  if(PublicHelper.isEmpty(param.value.query.sortField)) {
    param.value.query.sortField = 'items';
    param.value.query.sortOrder = -1;
  }
  param.value.first = param.value.query.first;
  updateQueryParam();

  param.value.load();
  const res = await axios.post(API.ENTRY_GET_LIST, param.value.query);
  if (res.state === axios.SUCCESS) {
    param.value.data = res.data.data;
    param.value.total = res.data.total
  }
  param.value.endLoad();
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

const onToggle = (val: PColumn[]) => {
  param.value.selectedColumns = param.value.columns.filter(col => val.includes(col));
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
             currentPageReportTemplate="{first} to {last} of {totalRecords}" responsiveLayout="scroll">
    <template #header>
      <BlockUI :blocked="param.block" class="relative">
        <SelectButton size="small" v-model="entryType" :options="META.ENTRY_TYPE_SET"
                      @change="switchEntryType($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="slotProps">
            <span class="material-symbols-outlined" style="font-size: 20px" :title="t(slotProps.option.label)">
            {{ slotProps.option.icon }}
          </span>
          </template>
        </SelectButton>
        <Button variant="text" severity="danger" :disabled="!param.selectedData.length"
                outlined @click="confirmDeleteSelected">
          <template #icon>
            <span class="material-symbols-outlined">delete_forever</span>
          </template>
        </Button>
        <Button variant="text" severity="help" :disabled="param.selectedData.length"
                outlined @click="exportCSV">
          <template #icon>
            <span class="material-symbols-outlined">file_export</span>
          </template>
        </Button>
        <MultiSelect :model-value="param.selectedColumns" :options="param.columns" optionLabel="header"
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

    <Column selectionMode="multiple" style="width: 35px" exportable/>
    <Column style="width: 45px">
      <template #body="slotProps">
        <Button variant="text" outlined size="small" @click="loadEditor(slotProps.data, dialog)">
          <template #icon>
            <span style="font-size: 15px" class="material-symbols-outlined">edit_square</span>
          </template>
        </Button>
      </template>
    </Column>
    <Column style="width: 35px">
      <template #body="prop">
        <img v-if="prop.data.thumb" :alt="prop.data.name" :src="`${API.STATIC_DOMAIN}${prop.data.thumb}`" style="width: 25px" />
        <img v-else :alt="prop.data.name" :src="API.COMMON_EMPTY_THUMB_IMAGE" style="width: 25px" />
      </template>
    </Column>

    <Column :header="t('Name')" field="name" filterField="keyword" :showFilterMenu="false" :showClearButton="true"
            exportHeader="name" :sortable="true">
      <template #body="{data}">
        <a :href="`${API.ENTRY_DETAIL_PATH}/${data.id}`">
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
      <template #body="{data}">
        <Tag :value="data!.gender.label"/>
      </template>
    </Column>
    <Column :header="t('Item')" field="items" :sortable="true" :showFilterMenu="false" style="width: 60px" />

    <Column v-for="(col, index) of param.selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style lang="scss" scoped>
@use "@/assets/entity-manager";
</style>