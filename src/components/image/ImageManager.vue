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
          <Button class="p-button-link" icon="pi pi-pencil" @click="openEditDialog(slotProps.data)"/>
        </template>
      </Column>
      <Column :header="$t('Image')" style="flex: 0 0 5rem">
        <template #body="slotProps">
          <img :src="slotProps.data.thumb50" :alt="slotProps.data.name"
               class="entry-thumb image-click" @click="imageClick(slotProps.index)" />
        </template>
      </Column>
      <Column :header="$t('Name')" field="name" sortable style="flex: 0 0 5rem"/>
      <Column :header="$t('NameZh')" field="nameZh" sortable/>
      <Column :header="$t('Type')" field="type" filterField="type"
              :showFilterMenu="false" sortable style="flex: 0 0 10rem">
        <template #body="slotProps">
          {{ PublicHelper.value2Label(slotProps.data.type, imageTypeSet) }}
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Select v-model="filterModel.value" :options="imageTypeSet" :filter="true" @change="filterCallback()"
                    :showClear="true" optionLabel="label" optionValue="value" Style="min-width: 100px" />
        </template>
      </Column>
      <Column :header="$t('UploadTime')" field="addedTime" sortable/>
      <Column :header="$t('EditedTime')" field="editedTime" sortable/>
    </DataTable>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="displayDeleteDialog" :header="$t('Delete')"
          :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
      <span>{{ $t('ConfirmDeleteImage') }}</span>
    </div>
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayDeleteDialog = false"/>
      <Button :label="$t('Delete')" icon="pi pi-check" class="p-button-text"
              @click="deleteImages"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayAddDialog" :header="$t('Add')"
          :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <BlockUI :blocked="editBlock">
      <ImageUploader v-model:images="addImages" v-model:generateThumb="generateThumb" />
    </BlockUI>
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayAddDialog = false" :disabled="editBlock"/>
      <Button :label="$t('Save')" icon="pi pi-check" class="p-button-text"
              @click="addImage" :disabled="editBlock || addImages.length === 0"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayEditDialog" :header="$t('Edit')"
          :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <BlockUI :blocked="editBlock">
      <div class="p-fluid">
        <div class="field">
          <InputText id="url" v-model="imageEdit.url" disabled />
        </div>
        <div class="formgrid grid">
          <div class="field col">
            <label>{{ $t('Name') }}<span style="color: red">*</span></label>
            <InputText id="name" v-model="imageEdit.name"/>
          </div>
          <div class="field col">
            <label>{{ $t('NameZh') }}</label>
            <InputText id="nameZh" v-model="imageEdit.nameZh"/>
          </div>
          <div class="field col">
            <label>{{ $t('Type') }}<span style="color: red">*</span></label>
            <Select v-model="imageEdit.type" :options="imageTypeSet"
                    optionLabel="label" optionValue="value"/>
          </div>
        </div>
        <div class="field">
          <label>{{ $t('Description') }}</label>
          <Textarea v-model="imageEdit.detail" rows="3" cols="20" :autoResize="true"/>
        </div>
      </div>
    </BlockUI>
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayEditDialog = false" :disabled="editBlock"/>
      <Button :label="$t('Save')" icon="pi pi-check" class="p-button-text"
              @click="updateImage" :disabled="editBlock"/>
    </template>
  </Dialog>
  <ImageGalleria :images="images" v-model:activeIndex="activeIndex" v-model:visible="displayCustom" />
</template>

<script setup lang="ts">
import {useToast} from 'primevue/usetoast';
import {ref, inject, onMounted, defineAsyncComponent, onBeforeMount} from "vue";
import {API} from '@/config/Web_Helper_Strs.ts';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo} from "@/config/Web_Const";
const ImageUploader = defineAsyncComponent(() => import('@/components/image/ImageUploader.vue'));
const ImageGalleria = defineAsyncComponent(() => import('@/components/image/ImageGalleria.vue'));

const addImages = ref([]);
const dialogRef = inject("dialogRef");
const route = useRoute();
const {t} = useI18n();
const toast = useToast();
const editBlock = ref(false);
const imageEdit = ref<any>({});
const images = ref<any>([]);
const totalRecords = ref(0);
const selectedItems = ref([]);
const loading = ref(false);
const queryParams = ref({});
const first = ref(0);
const displayAddDialog = ref(false);
const displayEditDialog = ref(false);
const displayDeleteDialog = ref(false);
const dt = ref();
const generateThumb = ref(false);

const entityInfo = ref<EntityInfo>();
onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});

onMounted(async () => {
  filters.value.entityType.value = entityInfo.value?.type;
  filters.value.entityId.value = entityInfo.value?.id;
  queryParams.value = {
    first: 0,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  };
  await getImages();
});

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const imageTypeSet = ref(
    [
      {label: '默认', value: 0},
      {label: '缩略图', value: 1},
      {label: '封面', value: 2},
      {label: '其他', value: 99}
    ]
);

const filters = ref({
  'entityType': {value: entityInfo.value?.type},
  'entityId': {value: entityInfo.value?.id},
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
  addImages.value = [];
  displayAddDialog.value = true;
}

const openEditDialog = (data) => {
  imageEdit.value = {
    id: data.id,
    url: data.url,
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
  const fd = new FormData();
  fd.append('entityType', entityInfo.value?.type);
  fd.append('entityId', entityInfo.value?.id);
  let infos: any[] = [];
  addImages.value.forEach(i => {
    infos.push({
      name: i.name,
      type: i.type,
      detail: i.detail
    });
    fd.append('files', i.file)
  })
  fd.append('infos', JSON.stringify(infos));
  fd.append('generateThumb', generateThumb.value);
  editBlock.value = true;
  const res = await axios.form(API.UPLOAD_IMAGE, fd);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    displayAddDialog.value = false;
    await getImages();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  editBlock.value = false;
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
  }
  editBlock.value = false;
};

const deleteImages = async () => {
  editBlock.value = true;
  const res = await axios.delete(API.DELETE_IMAGE, selectedItems.value);
  if (res.state === axios.SUCCESS) {
    selectedItems.value = [];
    displayDeleteDialog.value = false;
    await getImages();
    toast.add({severity: 'success', detail: res.message, life: 3000});
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  editBlock.value = false;
}
const activeIndex = ref(0)
const displayCustom = ref(false)
const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
</script>

<style scoped>

</style>