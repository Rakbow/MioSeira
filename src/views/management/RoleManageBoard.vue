<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {EntityManageParam} from "@/service/entityService";
import {useOptionStore} from "@/store/modules/option";
import {bs} from '@/service/baseService';

const {t} = useI18n();
const dt = ref();
const route = useRoute();
const router = useRouter();
const store = useOptionStore();
const param = ref(new EntityManageParam());
const createDTO = ref<any>();
const updateDTO = ref<any>();

onBeforeMount(async () => {
  param.value.initFilters({
    keyword: {value: ''}
  });
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
  const res = await Axios.post(API.ROLE_LIST, param.value.query);
  if (res.success()) {
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
  createDTO.value = {};
  displayAddDialog.value = true;
}

const closeAddDialog = () => {
  createDTO.value = {};
  displayAddDialog.value = false;
}

const openEditDialog = (data: any) => {
  updateDTO.value = PublicHelper.deepCopy(data);
  displayEditDialog.value = true;
}

const closeEditDialog = () => {
  updateDTO.value = {};
  displayEditDialog.value = false;
}

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const create = async () => {
  param.value.load();
  const res = await Axios.post(API.ROLE_CREATE, createDTO.value);
  if (res.success()) {
    bs!.toast.success(res.message);
    closeAddDialog();
    await load();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endLoad();
}

const update = async () => {
  param.value.load();
  const res = await Axios.post(API.ROLE_UPDATE, updateDTO.value);
  if (res.success()) {
    bs!.toast.success(res.message);
    closeEditDialog();
    await load();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endLoad();
}

const refresh = async () => {
  param.value.load();
  const res = await Axios.post(API.ROLE_REFRESH);
  if (res.success()) {
    store.clear();
    bs!.toast.success(res.message);
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endLoad();
}
//endregion

</script>

<template>
  <DataTable ref="dt" :value="param.data" class="entity-manager-datatable" size="small"
             lazy v-model:filters="param.query.filters" :totalRecords="param.total" :loading="param.loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
             filterDisplay="row" paginator :rows="param.query.rows" :first="param.query.first" stripedRows showGridlines
             v-model:selection="param.selectedData" dataKey="id" removableSort
             scrollable scrollHeight="flex" :rowsPerPageOptions="[15,30,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;"
             responsiveLayout="scroll">
    <template #paginatorfirstpagelinkicon>
      <RIcon name="first_page" />
    </template>
    <template #paginatorprevpagelinkicon>
      <RIcon name="chevron_left" />
    </template>
    <template #paginatornextpagelinkicon>
      <RIcon name="chevron_right" />
    </template>
    <template #paginatorlastpagelinkicon>
      <RIcon name="last_page" />
    </template>
    <template #header>
      <BlockUI :blocked="param.blocking">
        <RButton @click="openAddDialog" icon="add_box" tooltip="Add" />
        <RButton @click="confirmDeleteSelected" icon="disabled_by_default" tooltip="Delete"
                 severity="danger" :disabled="!param.selectedData.length" />
        <RButton @click="exportCSV" icon="file_export" tooltip="Export"
                 severity="help" :disabled="!param.data.length" />
        <RButton @click="refresh" icon="cloud_sync" tooltip="Refresh"
                 severity="info" :disabled="!param.data.length" />
      </BlockUI>
    </template>
    <template #empty>
      <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
      <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <RIcon class="pi-spin" name="autorenew" size="10rem"/>
    </template>
    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <Button variant="text" outlined size="small" @click="openEditDialog(data)">
          <template #icon>
            <RIcon name="edit_square" />
          </template>
        </Button>
      </template>
    </Column>
    <Column :header="t('Name')" field="name" filterField="keyword" :showFilterMenu="false"
            exportHeader="name" :sortable="true">
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" size="large" type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('NameZh')" field="nameZh" :sortable="true" />
    <Column :header="t('NameEn')" field="nameEn" :sortable="true" />
    <Column :header="t('Citations')" field="count" :sortable="true" style="width: 6rem" class="text-center" />
    <Column v-for="(col, index) of param.selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
  <Dialog :modal="true" v-model:visible="displayAddDialog" style="width: 30rem" :header="t('Add')"
          class="entity-editor">
    <BlockUI :blocked="param.blocking">
      <div class="field mt-2">
        <FloatLabel variant="on">
          <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
          <InputText size="large" v-model="createDTO.name" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <label>{{ t('NameEn') }}</label>
          <InputText size="large" v-model="createDTO.nameEn" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <label>{{ t('NameZh') }}</label>
          <InputText size="large" v-model="createDTO.nameZh" class="static w-full"/>
        </FloatLabel>
      </div>
    </BlockUI>
    <template #footer>
      <div class="relative">
        <div class="bottom-0 right-0">
          <Button icon="pi pi-times" :label="t('Cancel')" @click="closeAddDialog" :disabled="param.blocking"
                  class="p-button-text"/>
          <Button icon="pi pi-save" :label="t('Save')" @click="create" :disabled="param.blocking"/>
        </div>
      </div>
    </template>
  </Dialog>

  <Dialog :modal="true" v-model:visible="displayEditDialog" style="width: 30rem" :header="t('Edit')"
          class="p-fluid">
    <BlockUI :blocked="param.blocking">
      <div class="field mt-2">
        <FloatLabel variant="on">
          <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
          <InputText size="large" v-model="updateDTO.name" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <label>{{ t('NameEn') }}</label>
          <InputText size="large" v-model="updateDTO.nameEn" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <label>{{ t('NameZh') }}</label>
          <InputText size="large" v-model="updateDTO.nameZh" class="static w-full"/>
        </FloatLabel>
      </div>
    </BlockUI>
    <template #footer>
      <div class="relative">
        <div class="bottom-0 right-0">
          <Button icon="pi pi-times" :label="t('Cancel')" @click="closeEditDialog" :disabled="param.blocking"
                  class="p-button-text"/>
          <Button icon="pi pi-save" :label="t('Save')" @click="update" :disabled="param.blocking"/>
        </div>
      </div>
    </template>
  </Dialog>

</template>

<style scoped>

</style>