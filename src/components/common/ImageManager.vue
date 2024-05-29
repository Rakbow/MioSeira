<template>
  <Toast/>
  <BlockUI :blocked="editBlock">
    <DataTable ref="dt" :value="images" class="p-datatable-sm" :alwaysShowPaginator="images.length !== 0"
               lazy :totalRecords="totalRecords" :loading="loading"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" v-model:filters="filters"
               paginator :rows="10" :first="first" columnResizeMode="fit"
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
          <Button class="p-button-link" icon="pi pi-pencil" @click="openEditDialog(slotProps.data)"/>
        </template>
      </Column>
      <Column :header="$const.Image" style="flex: 0 0 5rem">
        <template #body="slotProps">
          <img :src="slotProps.data.thumbUrl50" :alt="slotProps.data.name"
               class="edit-image"/>
        </template>
      </Column>
      <Column :header="$const.Name" field="name" sortable style="flex: 0 0 5rem"/>
      <Column :header="$const.NameZh" field="nameZh" sortable/>
      <Column :header="$const.Type" field="type" style="flex: 0 0 8rem" sortable />
<!--      <Column :header="$const.Type" filterField="type" :showFilterMenu="false" style="flex: 0 0 8rem">-->
<!--        <template #body="slotProps">-->
<!--          {{ slotProps.data.type.value }}-->
<!--        </template>-->
<!--        <template #filter="{filterModel,filterCallback}">-->
<!--          <Dropdown v-model="filterModel.value" :options="$const.ImageTypes" :filter="true" @change="filterCallback()"-->
<!--                    :showClear="true" optionLabel="label" optionValue="value"/>-->
<!--        </template>-->
<!--      </Column>-->
      <Column :header="$const.UploadTime" field="addedTime" sortable/>
      <Column :header="$const.EditedTime" field="editedTime" sortable/>
    </DataTable>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="displayDeleteDialog" :header="$const.Delete"
          :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
      <span>{{ $const.ConfirmDeleteImage }}</span>
    </div>
    <template #footer>
      <Button :label="$const.Cancel" icon="pi pi-times" class="p-button-text"
              @click="displayDeleteDialog = false"/>
      <Button :label="$const.Delete" icon="pi pi-check" class="p-button-text"
              @click="deleteImages"/>
    </template>
  </Dialog>
</template>

<script setup>
import {useToast} from 'primevue/usetoast';
import {ref, getCurrentInstance, inject, onMounted} from "vue";
import {API} from '@/config/Web_Helper_Strs';
import {META} from '@/config/Web_Const';
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {PublicHelper} from "@/utils/publicHelper";
import {useRoute} from "vue-router";
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import InfoEditor from "@/components/entityEditor/BookInfoEditor.vue";

const dialogRef = inject("dialogRef");
const route = useRoute();
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const toast = useToast();
const entityType = ref();
const entityId = ref();
const editBlock = ref(false);
const imageAdd = ref({});
const imageEdit = ref({});
const images = ref([]);
const totalRecords = ref(0);
const selectedItems = ref(null);
const loading = ref(false);
const queryParams = ref({});
const first = ref(0);
const displayAddDialog = ref(false);
const displayEditDialog = ref(false);
const displayDeleteDialog = ref(false);
const dt = ref();
const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

onMounted(async () => {
  getEntityInfo();
  filters.value.entityType.value = entityType.value;
  filters.value.entityId.value = entityId.value;
  queryParams.value = {
    first: 0,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  };
  await getImages();
});

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = parseInt(route.params.id.toString());
}

const filters = ref({
  'entityType': {value: entityType.value},
  'entityId': {value: entityId.value},
  'type': {value: -1}
});

const onPage = (ev) => {
  queryParams.value = ev;
  getImages();
};
const onSort = (ev) => {
  queryParams.value = ev;
  getImages();
};
const onFilter = () => {
  queryParams.value.filters = filters.value;
  getImages();
};

const openAddDialog = () => {
  imageAdd.value = {
    image: null,
    type: META.IMAGE_TYPE.DEFAULT,
    entityType: entityType.value,
    entityId: entityId.value,
    name: '',
    nameZh: '',
    detail: '',
  };
  displayAddDialog.value = true;
}

const closeAddDialog = () => {
  displayAddDialog.value = false;
}

const openEditDialog = (data) => {
  imageEdit.value = {
    id: data.id,
    type: data.type,
    name: data.name,
    nameZh: data.nameZh,
    detail: data.detail,
  };
  displayEditDialog.value = true;
}

const closeEditDialog = () => {
  displayEditDialog.value = false;
}

const getImages = async () => {
  loading.value = true;
  const res = await axios.post(API.GET_IMAGES, queryParams.value);
  if (res.state === axios.SUCCESS) {
    images.value = res.data.data;
    totalRecords.value = res.data.total
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  loading.value = false;
  first.value = queryParams.value.first;
}

const addImage = async () => {
  editBlock.value = treu;
  const formData = new FormData();
  formData.append("files", imageAdd.value.image)
  delete imageAdd.value.image
  formData.append("info", JSON.stringify([imageAdd.value]))
  const res = await axios.form(API.ADD_IMAGE, formData);
  if (res.state === axios.SUCCESS) {
    closeAddDialog();
    await getImages();
    toast.add({severity: 'success', detail: res.message, life: 3000});
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
}

const updateImage = async () => {
  editBlock.value = true;
  let json = {
    id: imageEdit.value.id,
    type: imageEdit.value.type,
    name: imageEdit.value.name,
    nameZh: imageEdit.value.nameZh,
    detail: imageEdit.value.detail,
  };
  const res = await axios.post(API.UPDATE_IMAGE, json);
  if (res.state === axios.SUCCESS) {
    closeEditDialog();
    await getImages();
    toast.add({severity: 'success', detail: res.message, life: 3000});
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
};

const deleteImages = async () => {
  editBlock.value = true;
  const res = await axios.post(API.DELETE_IMAGE, selectedItems);
  if (res.state === axios.SUCCESS) {
    deleteDialog.value = false;
    selectedItems.value = [];
    displayDeleteDialog.value = false;
    await getImages();
    toast.add({severity: 'success', detail: res.message, life: 3000});
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
}

</script>

<style scoped>

</style>