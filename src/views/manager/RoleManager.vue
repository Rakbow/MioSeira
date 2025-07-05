<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useToast} from "primevue/usetoast";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {EntityManageParam, useEntityStore} from "@/logic/entityService";
import {PToast} from "@/logic/frame";

const {t} = useI18n();
const dt = ref();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const store = useEntityStore();
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
  const res = await axios.post(API.ROLE_CREATE, createDTO.value);
  if (res.state === axios.SUCCESS) {
    toast.add(new PToast().success(res.message));
    closeAddDialog();
    await load();
  } else {
    toast.add(new PToast().error(res.message));
  }
  param.value.endLoad();
}

const update = async () => {
  param.value.load();
  const res = await axios.post(API.ROLE_UPDATE, updateDTO.value);
  if (res.state === axios.SUCCESS) {
    toast.add(new PToast().success(res.message));
    closeEditDialog();
    await load();
  } else {
    toast.add(new PToast().error(res.message));
  }
  param.value.endLoad();
}

const refresh = async () => {
  param.value.load();
  const res = await axios.post(API.ROLE_REFRESH);
  if (res.state === axios.SUCCESS) {
    store.clear();
    toast.add(new PToast().success(res.message));
  } else {
    toast.add(new PToast().error(res.message));
  }
  param.value.endLoad();
}
//endregion

</script>

<template>
  <DataTable ref="dt" :value="param.data" class="entity-manager-datatable" size="small"
             :alwaysShowPaginator="param.data.length !== 0"
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
      <span class="material-symbols-outlined">first_page</span>
    </template>
    <template #paginatorprevpagelinkicon>
      <span class="material-symbols-outlined">chevron_left</span>
    </template>
    <template #paginatornextpagelinkicon>
      <span class="material-symbols-outlined">chevron_right</span>
    </template>
    <template #paginatorlastpagelinkicon>
      <span class="material-symbols-outlined">last_page</span>
    </template>
    <template #header>
      <BlockUI :blocked="param.blocking">
        <Button variant="text" outlined @click="openAddDialog">
          <template #icon>
            <span class="material-symbols-outlined">add_box</span>
          </template>
        </Button>
        <Button variant="text" severity="danger" :disabled="!param.selectedData.length"
                outlined @click="confirmDeleteSelected">
          <template #icon>
            <span class="material-symbols-outlined">delete_forever</span>
          </template>
        </Button>
        <Button variant="text" severity="help" :disabled="!param.data.length"
                outlined @click="exportCSV">
          <template #icon>
            <span class="material-symbols-outlined">file_export</span>
          </template>
        </Button>
        <Button variant="text" severity="info" outlined @click="refresh">
          <template #icon>
            <span class="material-symbols-outlined">cloud_sync</span>
          </template>
        </Button>
      </BlockUI>
    </template>
    <template #empty>
        <span>{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"/>
      <span>{{ t('CommonDataTableLoadingInfo') }}</span>
    </template>
    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <Button variant="text" outlined size="small" @click="openEditDialog(data)">
          <template #icon>
            <span class="material-symbols-outlined">edit_square</span>
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