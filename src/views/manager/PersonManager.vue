<script setup lang="ts">
import {onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import InfoEditor from "@/components/entityEditor/PersonInfoEditor.vue";
import {useDialog} from "primevue/usedialog";
import {API} from "@/config/Web_Helper_Strs.ts";
import {useI18n} from "vue-i18n";
import {META} from "@/config/Web_Const";

//region query
const dialog = useDialog();
const route = useRoute();
const router = useRouter();
const first = ref();
const initQueryParam = async () => {
  let page = !_isUndefined(route.query.page) ? route.query.page : 1;
  filters.value.name.value = !_isUndefined(route.query.name) ? route.query.name : '';
  filters.value.nameZh.value = !_isUndefined(route.query.nameZh) ? route.query.nameZh : '';
  filters.value.nameEn.value = !_isUndefined(route.query.nameEn) ? route.query.nameEn : '';
  filters.value.aliases.value = !_isUndefined(route.query.aliases) ? route.query.aliases : '';
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
  const currentQueryParams = { ...route.query };

  // 修改查询参数的值
  currentQueryParams.page = (queryParams.value.first/dt.value.rows + 1).toString();
  currentQueryParams.size = dt.value.rows;
  if(!_isEmpty(queryParams.value.filters.name.value))
    currentQueryParams.name = queryParams.value.filters.name.value;
  if(!_isEmpty(queryParams.value.filters.nameZh.value))
    currentQueryParams.nameZh = queryParams.value.filters.nameZh.value;
  if(!_isEmpty(queryParams.value.filters.nameEn.value))
    currentQueryParams.nameEn = queryParams.value.filters.nameEn.value;
  if(!_isEmpty(queryParams.value.filters.aliases.value))
    currentQueryParams.aliases = queryParams.value.filters.aliases.value;

  // 使用 router.push 更新 URL
  router.push({ path: route.path, query: currentQueryParams });
};
//endregion


onMounted(() => {
  initOption();
  initQueryParam();
})

const {t} = useI18n();
const toast = useToast();
const items = ref([]);
const itemAdd = ref<any>({});
const dt = ref();
const filters = ref({
  'name': {value: ''},
  'nameZh': {value: ''},
  'nameEn': {value: ''},
  'aliases': {value: null},
  'gender': {value: null},
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

const initOption= async () => {
  const res = await axios.post(API.GET_ENTITY_OPTION, {type: META.ENTITY.PERSON});
  option.value.genderSet = res.data.genderSet;
  option.value.linkTypeSet = res.data.linkTypeSet;
}

const onPage = (event) => {
  queryParams.value = event;
  getItems();
};
const onSort = (event) => {
  queryParams.value = event;
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
  const res = await axios.post(API.GET_PERSON_LIST, queryParams.value);
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
    gender: 0
  };
  displayAddDialog.value = true;
}

const closeAddDialog = () => {
  itemAdd.value = {};
  displayAddDialog.value = false;
}

const openEditDialog = (data) => {
  dialog.open(InfoEditor, {
    props: {
      header: t('Edit'),
      style: {
        width: '600px',
      },
      breakpoints:{
        '960px': '70vw',
        '640px': '60vw'
      },
      modal: true,
      closable: false
    },
    data: {
      item: data,
      option: option.value,
    },
    onClose: async (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          await getItems();
        }
      }
    }
  });
}

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const submitAddItem = async () => {
  loading.value = true;
  const res = await axios.post(API.ADD_PERSON, itemAdd.value);
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
               filterDisplay="row" :globalFilterFields="['name', 'nameZh', 'nameEn']"
               paginator :rows="10" :first="first" stripedRows columnResizeMode="fit"
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
          <Button class="p-button-link" icon="pi pi-pencil" @click="openEditDialog(slotProps.data)" />
        </template>
      </Column>
      <Column :header="$t('Name')" field="name" :showFilterMenu="false"
              exportHeader="name" sortable style="flex: 0 0 5rem">
        <template #body="slotProps">
          <a :href="API.PERSON_DETAIL + '/' + slotProps.data.id">
            {{ slotProps.data.name }}
          </a>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$t('NameZh')" field="nameZh" sortable :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$t('NameEn')" field="nameEn" sortable :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$t('BirthDate')" field="birthDate" sortable />
      <Column :header="$t('Gender')" field="gender" sortable :showFilterMenu="false">
        <template #body="slotProps">
          {{ slotProps.data.gender.label }}
        </template>
        <template #filter="{filterModel,filterCallback}">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()"
                       :options="option.genderSet" :placeholder="$t('Whole')"
                       optionLabel="label" optionValue="value" display="chip" filter
                       style="width: 9rem"/>
        </template>
      </Column>
      <Column :header="$t('Aliases')" filter-field="aliases" :showFilterMenu="false" style="flex: 0 0 9rem">
        <template #body="slotProps">
          <ul class="px-4 ellipsis-list">
            <li v-for="data in slotProps.data.aliases">
              {{data}}
            </li>
          </ul>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column v-for="(col, index) of selectedColumns" :field="col.field"
              :header="col.header" :key="col.field + '_' + index" sortable/>
    </DataTable>
  </div>

  <Dialog modal v-model:visible="displayAddDialog"
          style="width: 600px" :header="$t('Add')" class="p-fluid">
    <BlockUI :blocked="editBlock">
      <div class="formgrid grid">
        <div class="field col">
          <label class="font-bold block mb-2">{{ $t('Name') }}<span style="color: red">*</span></label>
          <InputText v-model="itemAdd.name"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $t('NameZh') }}</label>
          <InputText v-model="itemAdd.nameZh"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $t('NameEn') }}</label>
          <InputText v-model="itemAdd.nameEn"/>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label class="font-bold block mb-2">{{ $t('Gender') }}</label>
          <Select v-model="itemAdd.gender"
                    :options="option.genderSet" optionLabel="label" optionValue="value"
                    :placeholder="$t('Unknown')" class="w-full md:w-14rem"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $t('BirthDate') }}</label>
          <InputMask v-model="itemAdd!.birthDate" mask="****/**/**" />
        </div>
      </div>

      <div class="p-fluid">
        <label class="font-bold block mb-2">{{ $t('Aliases') }}</label>
        <InputChips v-model="itemAdd.aliases" separator=","  />
      </div>

      <div class="field">
        <label>{{ $t('Remark') }}</label>
        <Textarea v-model="itemAdd!.remark" rows="3" cols="20" autoResize/>
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