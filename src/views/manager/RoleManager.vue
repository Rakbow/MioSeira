<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useToast} from "primevue/usetoast";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {EntityManageParam} from "@/logic/entityService";

const {t} = useI18n();
const dt = ref();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const param = ref(new EntityManageParam());
const itemAdd = ref({});
const itemEdit = ref({});

onBeforeMount(async () => {
  param.value.query.initFilters({
    keyword: {value: ''}
  });
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
  const res = await axios.post(API.ROLE_LIST, param.value.query);
  if (res.state === axios.SUCCESS) {
    param.value.data = res.data.data;
    param.value.total = res.data.total
  }
  param.value.endLoad();
}

const exportCSV = () => {
  dt.value.exportCSV();
};

//region item CRUD

const displayAddDialog = ref(false);
const displayEditDialog = ref(false);
const displayDeleteDialog = ref(false);

const openAddDialog = () => {
  itemAdd.value = {};
  displayAddDialog.value = true;
}

const closeAddDialog = () => {
  itemAdd.value = {};
  displayAddDialog.value = false;
}

const openEditDialog = (data) => {
  itemEdit.value = PublicHelper.deepCopy(data);
  displayEditDialog.value = true;
}

const closeEditDialog = () => {
  itemEdit.value = {};
  displayEditDialog.value = false;
}

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const submitAddItem = async () => {
  param.value.load();
  const res = await axios.post(API.ROLE_CREATE, itemAdd.value);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    closeAddDialog();
    await load();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  param.value.endLoad();
}

const submitEditItem = async () => {
  param.value.load();
  const res = await axios.post(API.ROLE_UPDATE, itemEdit.value);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    closeEditDialog();
    await load();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  param.value.endLoad();
}

const refreshItem = async () => {
  param.value.load();
  const res = await axios.post(API.REFRESH_ROLE);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    await load();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  param.value.endLoad();
}
//endregion

</script>

<template>
  <div class="flex justify-content-center">
    <DataTable ref="dt" :value="param.data" class="p-datatable-sm small-font" size="small"
               :alwaysShowPaginator="param.data.length !== 0"
               lazy v-model:filters="param.query.filters" :totalRecords="param.total" :loading="param.loading"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" paginator :rows="10" :first="param.first" stripedRows
               v-model:selection="param.selectedData" dataKey="id" removableSort
               scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}"
               responsiveLayout="scroll">
      <template #header>
        <BlockUI :blocked="param.block" class="grid">
          <div class="col-8">
            <Button :label="t('Add')" icon="pi pi-plus" severity="success" size="small" class="mr-2"
                    @click="openAddDialog" style="width: 6em"/>
            <Button :label="t('Delete')" icon="pi pi-trash" severity="danger" size="small" class="mr-2"
                    @click="confirmDeleteSelected"
                    :disabled="!param.selectedData || !param.selectedData.length" style="width: 6em"/>
            <Button :label="t('Export')" icon="pi pi-external-link" severity="help" size="small" class="mr-2"
                    @click="exportCSV()" style="width: 6em"/>
            <Button :label="t('Refresh')" icon="pi pi-refresh" severity="info" size="small" class="mr-2"
                    @click="refreshItem()" style="width: 6em"/>
          </div>
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
      <Column selectionMode="multiple" style="flex: 0 0 3rem" exportable/>
      <Column style="flex: 0 0 3rem">
        <template #body="slotProps">
          <Button class="p-button-link" icon="pi pi-pencil" @click="openEditDialog(slotProps.data)" />
        </template>
      </Column>
      <Column :header="t('Name')" field="name" filterField="keyword" :showFilterMenu="false"
              exportHeader="name" :sortable="true">
        <template #filter="{filterModel,filterCallback}">
          <InputText size="small" type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="t('NameZh')" field="nameZh" :sortable="true" />
      <Column :header="t('NameEn')" field="nameEn" :sortable="true" />
      <Column v-for="(col, index) of param.selectedColumns" :field="col.field"
              :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
    </DataTable>
  </div>
  <Dialog :modal="true" v-model:visible="displayAddDialog" :style="{width: '400px'}" :header="t('Add')"
          class="p-fluid">
    <BlockUI :blocked="param.block">
      <div class="formgrid grid">
        <label class="font-bold block mb-2">{{ t('Name') }}<span style="color: red">*</span></label>
        <InputText v-model="itemAdd.name"/>
      </div>
      <div class="formgrid grid">
        <label class="font-bold block mb-2">{{ t('NameZh') }}<span style="color: red">*</span></label>
        <InputText v-model="itemAdd.nameZh"/>
      </div>
      <div class="formgrid grid">
        <label class="font-bold block mb-2">{{ t('NameEn') }}<span style="color: red">*</span></label>
        <InputText v-model="itemAdd.nameEn"/>
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text" @click="closeAddDialog"
              :disabled="param.block"/>
      <Button :label="t('Save')" icon="pi pi-check" class="p-button-text" @click="submitAddItem"
              :disabled="param.block"/>
    </template>
  </Dialog>

  <Dialog :modal="true" v-model:visible="displayEditDialog" :style="{width: '400px'}" :header="t('Edit')"
          class="p-fluid">
    <BlockUI :blocked="param.block">
      <div class="formgrid grid">
        <label class="font-bold block mb-2">{{ t('Name') }}<span style="color: red">*</span></label>
        <InputText v-model="itemEdit.name"/>
      </div>
      <div class="formgrid grid">
        <label class="font-bold block mb-2">{{ t('NameZh') }}<span style="color: red">*</span></label>
        <InputText v-model="itemEdit.nameZh"/>
      </div>
      <div class="formgrid grid">
        <label class="font-bold block mb-2">{{ t('NameEn') }}<span style="color: red">*</span></label>
        <InputText v-model="itemEdit.nameEn"/>
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text" @click="closeEditDialog"
              :disabled="param.block"/>
      <Button :label="t('Save')" icon="pi pi-check" class="p-button-text" @click="submitEditItem"
              :disabled="param.block"/>
    </template>
  </Dialog>

</template>

<style scoped>

</style>