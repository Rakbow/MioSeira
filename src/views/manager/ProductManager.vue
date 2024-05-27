<script setup>
import {onMounted, ref} from "vue";
import {getCurrentInstance} from "vue";
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {useToast} from "primevue/usetoast";
import {useRoute, useRouter} from "vue-router";
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useDialog} from "primevue/usedialog";
import InfoEditor from "@/components/entityEditor/ProductInfoEditor.vue";

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

const dialog = useDialog();
const toast = useToast();
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;
const items = ref([]);
const itemAdd = ref({});
const dt = ref();
const filters = ref({
  'name': {value: ''},
  'nameZh': {value: ''},
  'nameEn': {value: ''},
  'category': {value: null},
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
  const res = await axios.post($api.GET_ENTITY_OPTION, {type: META.ENTITY.PRODUCT});
  option.value.productCategorySet = res.data.productCategorySet;
  option.value.franchiseSet = res.data.franchiseSet;
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
  dialog.open(InfoEditor, {
    props: {
      header: $const.Edit,
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
          <a :href="$api.PRODUCT_DETAIL + '/' + slotProps.data.id">
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

  <Dialog modal v-model:visible="displayAddDialog"
          style="width: 600px" :header="$const.Add" class="p-fluid">
    <BlockUI :blocked="editBlock">
      <div class="field col">
        <label>{{$const.Name}}<span style="color: red">*</span></label>
        <InputText id="name" v-model="itemAdd.name" />
      </div>
      <div class="field col">
        <label>{{$const.NameEn}}<span style="color: red">*</span></label>
        <InputText id="nameEn" v-model="itemAdd.nameEn" />
      </div>
      <div class="field col">
        <label>{{$const.NameZh}}<span style="color: red">*</span></label>
        <InputText id="nameZh" v-model="itemAdd.nameZh" />
      </div>
      <div class="formgrid grid">
        <div class="field col-6">
          <label>{{$const.ReleaseDate}}<span style="color: red">*</span></label>
          <InputMask v-model="itemAdd.releaseDate" mask="****/**/**" />
        </div>
        <div class="field col-6">
          <label>{{$const.Category}}</label>
          <Dropdown v-model="itemAdd.category" :options="option.productCategorySet"
                    optionLabel="label" optionValue="value" />
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-6">
          <label>{{$const.Franchise}}</label>
          <Dropdown v-model="itemAdd.franchise" :options="option.franchiseSet"
                    optionLabel="label" optionValue="value" />
        </div>
      </div>
      <div class="field">
        <label>{{$const.Remark}}</label>
        <Textarea id="remark" v-model="itemAdd.remark" rows="3" cols="20" :autoResize="true" />
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="$const.Cancel" icon="pi pi-times" class="p-button-text" @click="closeAddDialog"
              :disabled="editBlock"/>
      <Button :label="$const.Save" icon="pi pi-check" class="p-button-text" @click="submitAddItem"
              :disabled="editBlock"/>
    </template>
  </Dialog>

</template>

<style scoped>

</style>