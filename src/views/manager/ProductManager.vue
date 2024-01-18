<script setup>
import {onMounted, ref} from "vue";
import {getCurrentInstance} from "vue";
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {useToast} from "primevue/usetoast";
import {PublicHelper} from "@/utils/publicHelper";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";

//region query
const route = useRoute();
const router = useRouter();
const first = ref();
const initQueryParam = async () => {
  let page = !_isUndefined(route.query.page) ? route.query.page : 1;
  filters.value.name.value = !_isUndefined(route.query.name) ? route.query.name : '';
  filters.value.nameZh.value = !_isUndefined(route.query.nameZh) ? route.query.nameZh : '';
  filters.value.nameEn.value = !_isUndefined(route.query.nameEn) ? route.query.nameEn : '';
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
  currentQueryParams.page = queryParams.value.first/dt.value.rows + 1;
  currentQueryParams.size = dt.value.rows;
  if(!_isEmpty(queryParams.value.filters.name.value))
    currentQueryParams.name = queryParams.value.filters.name.value;
  if(!_isEmpty(queryParams.value.filters.nameZh.value))
    currentQueryParams.nameZh = queryParams.value.filters.nameZh.value;
  if(!_isEmpty(queryParams.value.filters.nameEn.value))
    currentQueryParams.nameEn = queryParams.value.filters.nameEn.value;

  // 使用 router.push 更新 URL
  router.push({ path: route.path, query: currentQueryParams });
};
//endregion


onMounted(() => {
  initOption();
  initQueryParam();
})


const toast = useToast();
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;
const items = ref([]);
const itemAdd = ref({});
const itemEdit = ref({});
const dt = ref();
const filters = ref({
  'name': {value: ''},
  'nameZh': {value: ''},
  'nameEn': {value: ''},
  'categories': {value: null},
});
const loading = ref(false);
const editBlock = ref(false);
const totalRecords = ref(0);
const selectedItems = ref(null);
const selectedColumns = ref(null);
const columns = ref([
  {field: 'remark', header: $const.Remark},
  {field: 'addedTime', header: $const.AddedTime},
  {field: 'editedTime', header: $const.EditedTime},
]);
const queryParams = ref({});
const option = ref({});

const initOption= async () => {
  const res = await axios.post($api.GET_META_DATA);
  option.value.productCategorySet = res.data.productCategorySet;
}

const onPage = (ev) => {
  queryParams.value = ev;
  getItems();
};
const onSort = (ev) => {
  queryParams.value = ev;
  getItems();
};
const onFilter = $event => {
  queryParams.value.filters = filters.value;
  getItems();
};

const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const getItems = async () => {
  loading.value = true;
  const res = await axios.post($api.GET_PRODUCTS, queryParams.value);
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
const displayEditDialog = ref(false);
const displayDeleteDialog = ref(false);

const openAddDialog = () => {
  itemAdd.value = {
    category: 99
  };
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
  loading.value = true;
  const res = await axios.post($api.ADD_PRODUCT, itemAdd.value);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    closeAddDialog();
    await getItems();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  loading.value = false;
}

const submitEditItem = async () => {
  loading.value = true;
  const res = await axios.post($api.UPDATE_PRODUCT, itemEdit.value);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    closeEditDialog();
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
    <DataTable ref="dt" :value="items" class="p-datatable-sm" :alwaysShowPaginator="items !== 0"
               lazy v-model:filters="filters" :totalRecords="totalRecords" :loading="loading"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" :globalFilterFields="['name', 'nameZh', 'nameEn']"
               paginator :rows="10" :first="first" stripedRows columnResizeMode="fit"
               v-model:selection="selectedItems" dataKey="id" removableSort
               scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]" showGridlines
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               :currentPageReportTemplate="$const.DataTablePageTemplate"
               responsiveLayout="scroll">
      <template #header>
        <BlockUI :blocked="editBlock" class="grid">
          <div class="col-8">
            <Button :label="$const.Add" icon="pi pi-plus" class="p-button-success p-button-sm mr-2"
                    @click="openAddDialog" style="width: 6em"/>
            <Button :label="$const.Delete" icon="pi pi-trash" class="p-button-danger p-button-sm mr-2"
                    @click="confirmDeleteSelected"
                    :disabled="!selectedItems || !selectedItems.length" style="width: 6em"/>
            <Button label="导出(CSV)" icon="pi pi-external-link" class="ml-2 p-button-help p-button-sm"
                    @click="exportCSV()" style="width: 8em"/>
          </div>
          <div class="col-4">
            <MultiSelect :model-value="selectedColumns" :options="columns" optionLabel="header"
                         @update:modelValue="onToggle" class="text-end"
                         :placeholder="$const.SelectedDisplayColumns" style="width: 20em"/>
          </div>
        </BlockUI>
      </template>
      <template #empty>
        <span class="emptyInfo">
            {{ $const.CommonDataTableEmptyInfo }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ $const.CommonDataTableLoadingInfo }}</span>
      </template>
      <Column selectionMode="multiple" style="flex: 0 0 3rem" exportable/>
      <Column style="flex: 0 0 3rem">
        <template #body="slotProps">
          <Button class="p-button-link" icon="pi pi-pencil" @click="openEditDialog(slotProps.data)" />
        </template>
      </Column>
      <Column :header="$const.Name" field="name" :showFilterMenu="false"
              exportHeader="name" sortable style="flex: 0 0 5rem">
        <template #body="slotProps">
          <a :href=`${$api.PRODUCT_DETAIL}'/'${slotProps.data.id}`>
            {{ slotProps.data.name }}
          </a>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$const.NameZh" field="nameZh" sortable :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$const.NameEn" field="nameEn" sortable :showFilterMenu="false">
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"/>
        </template>
      </Column>
      <Column :header="$const.ReleaseDate" field="releaseDate" sortable />
      <Column :header="$const.Franchise" field="franchise" sortable >
        <template #body="slotProps">
          {{ slotProps.data.franchise.label }}
        </template>
      </Column>
      <Column :header="$const.Category" field="category" sortable :showFilterMenu="false">
        <template #body="slotProps">
          {{ slotProps.data.category.label }}
        </template>
        <template #filter="{filterModel,filterCallback}">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()"
                       :options="option.productCategorySet" :placeholder="$const.Whole"
                       optionLabel="label" optionValue="value" display="chip" filter
                       style="width: 9rem"/>
        </template>
      </Column>
      <Column v-for="(col, index) of selectedColumns" :field="col.field"
              :header="col.header" :key="col.field + '_' + index" sortable/>
    </DataTable>
  </div>

  <Dialog modal :pt="{mask: {style: 'backdrop-filter: blur(2px)'}}" v-model:visible="displayAddDialog"
          style="width: 600px" :header="$const.Add" class="p-fluid">
    <BlockUI :blocked="editBlock">
      <div class="formgrid grid">
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.Name }}<span style="color: red">*</span></label>
          <InputText v-model="itemAdd.name"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.NameZh }}</label>
          <InputText v-model="itemAdd.nameZh"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.NameEn }}</label>
          <InputText v-model="itemAdd.nameEn"/>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.Gender }}</label>
          <Dropdown v-model="itemAdd.gender"
                    :options="option.genderSet" optionLabel="label" optionValue="value"
                    :placeholder="$const.Unknown" class="w-full md:w-14rem"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.BirthDate }}</label>
          <InputMask v-model.trim="itemAdd.birthDate" mask="****/**/**" />
        </div>
      </div>

      <div class="p-fluid">
        <label class="font-bold block mb-2">{{ $const.Aliases }}</label>
        <Chips v-model="itemAdd.aliases" separator=","  />
      </div>

      <div class="field">
        <label>{{ $const.Remark }}</label>
        <Textarea v-model="itemAdd.remark" rows="3" cols="20" autoResize/>
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="$const.Cancel" icon="pi pi-times" class="p-button-text" @click="closeAddDialog"
              :disabled="editBlock"/>
      <Button :label="$const.Save" icon="pi pi-check" class="p-button-text" @click="submitAddItem"
              :disabled="editBlock"/>
    </template>
  </Dialog>

  <Dialog modal :pt="{mask: {style: 'backdrop-filter: blur(2px)'}}" v-model:visible="displayEditDialog"
          :style="{width: '600px'}" :header="$const.Edit" class="p-fluid">
    <BlockUI :blocked="editBlock">
      <div class="formgrid grid">
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.Name }}<span style="color: red">*</span></label>
          <InputText v-model.trim="itemEdit.name"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.NameZh }}</label>
          <InputText v-model.trim="itemEdit.nameZh"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.NameEn }}</label>
          <InputText v-model.trim="itemEdit.nameEn"/>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.Gender }}</label>
          <Dropdown v-model="itemEdit.gender.value"
                    :options="option.genderSet" optionLabel="label" optionValue="value"
                    :placeholder="$const.Unknown" class="w-full md:w-14rem"/>
        </div>
        <div class="field col">
          <label class="font-bold block mb-2">{{ $const.BirthDate }}</label>
          <InputText v-model.trim="itemEdit.birthDate" />
        </div>
      </div>

      <div class="p-fluid">
        <label class="font-bold block mb-2">{{ $const.Aliases }}</label>
        <Chips v-model="itemEdit.aliases" separator=","  />
      </div>

      <div class="field">
        <label>{{ $const.Remark }}</label>
        <Textarea v-model="itemEdit.remark" rows="3" cols="20" autoResize/>
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="$const.Cancel" icon="pi pi-times" class="p-button-text" @click="closeEditDialog"
              :disabled="editBlock"/>
      <Button :label="$const.Save" icon="pi pi-check" class="p-button-text" @click="submitEditItem"
              :disabled="editBlock"/>
    </template>
  </Dialog>

</template>

<style scoped>

</style>