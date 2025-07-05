<template>
  <BlockUI :blocked="editBlock">
    <DataTable ref="dt" :value="images" :alwaysShowPaginator="images.length !== 0"
               lazy :totalRecords="totalRecords" :loading="loading" size="small"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" v-model:filters="filters"
               paginator :rows="10" :first="first" columnResizeMode="fit"
               v-model:selection="selectedItems" dataKey="id" removableSort
               scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]" showGridlines
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;"
               responsiveLayout="scroll" tableStyle="font-size: 11px">
      <template #header>
        <BlockUI :blocked="editBlock" class="grid">
          <Button variant="text" outlined @click="openAddDialog">
            <template #icon>
              <MaterialIcon name="add_box"/>
            </template>
          </Button>
          <Button variant="text" severity="danger" :disabled="!selectedItems.length"
                  outlined @click="confirmDeleteSelected">
            <template #icon>
              <MaterialIcon name="delete_forever"/>
            </template>
          </Button>
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
      <Column selectionMode="multiple" style="width: 30px" exportable/>
      <Column style="width: 30px">
        <template #body="{data}">
          <Button variant="text" outlined size="small" @click="openEditDialog(data)">
            <template #icon>
              <MaterialIcon name="edit_square" size="1.5"/>
            </template>
          </Button>
        </template>
      </Column>
      <Column :header="t('Image')" style="width: 50px" bodyClass="text-center">
        <template #body="slotProps">
          <img :src="slotProps.data.thumb" :alt="slotProps.data.name" style="height: 25px"
               class="image-click" @click="imageClick(slotProps.index)" />
        </template>
      </Column>
      <Column :header="t('Name')" field="name" :sortable="true"/>
      <Column :header="t('Size')" field="size" :sortable="true" style="width: 60px"/>
      <Column :header="t('Type')" filterField="type" :showFilterMenu="false" :sortable="true" style="width: 80px">
        <template #body="slotProps">
          <div style="display: flex;justify-content: center;">
            <Tag :value="slotProps.data.type.label" style="padding: 0 .5rem;font-size: 11px;font-weight: normal"/>
          </div>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Select size="small" v-model="filterModel.value" :options="store.options.imageTypeSet" :filter="true" @change="filterCallback()"
                    :showClear="true" optionLabel="label" optionValue="value" Style="min-width: 100px" />
        </template>
      </Column>
      <Column :header="t('UploadTime')" field="addedTime" :sortable="true" style="width: 120px" />
      <Column :header="t('EditedTime')" field="editedTime" :sortable="true" style="width: 120px" />
    </DataTable>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="displayDeleteDialog" :header="t('Delete')" :style="{width: '400px'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
      <span>{{ t('ConfirmDeleteImage') }}</span>
    </div>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayDeleteDialog = false"/>
      <Button :label="t('Delete')" icon="pi pi-check" class="p-button-text"
              @click="remove"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayAddDialog" :header="t('Add')"
          :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <BlockUI :blocked="editBlock">
      <ImageUploader v-model:images="addImages" v-model:generateThumb="generateThumb" />
    </BlockUI>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayAddDialog = false" :disabled="editBlock"/>
      <Button :label="t('Save')" icon="pi pi-check" class="p-button-text"
              @click="upload" :disabled="editBlock || addImages.length === 0"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayEditDialog" :header="t('Edit')" class="p-fluid">
    <div class="flex flex-wrap mb-3" style="display: flex;justify-content: center;">
      <div class="entry-thumb center">
        <img role="presentation" :alt="imageEdit.name" :src="imageEdit.thumb"/>
      </div>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Path') }}</label>
        <InputText id="url" v-model="imageEdit.url" disabled />
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Name') }}</label>
        <InputText id="name" v-model="imageEdit.name"/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Type') }}</label>
        <Select v-model="imageEdit.type" :options="store.options.imageTypeSet"
                size="small" optionLabel="label" filter class="static w-full">
          <template #option="slotProps">
            <div class="flex align-options-center">
              <div>{{ slotProps.option.label }}</div>
            </div>
          </template>
        </Select>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Description') }}</label>
        <InputText size="small" v-model="imageEdit.detail" class="static w-full"/>
      </FloatLabel>
    </div>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayEditDialog = false"/>
      <Button :label="t('Save')" icon="pi pi-check" class="p-button-text"
              @click="update"/>
    </template>
  </Dialog>
  <ImageGalleria :images="images" v-model:activeIndex="activeIndex" v-model:visible="displayCustom" />
</template>

<script setup lang="ts">
import {useToast} from 'primevue/usetoast';
import {ref, onMounted, defineAsyncComponent, onBeforeMount} from "vue";
import { API, Axios } from '@/api';
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo} from "@/config/Web_Const";
import {useOptionStore} from "@/store/modules/option";
import {PToast} from "@/logic/frame";
const ImageUploader = defineAsyncComponent(() => import('@/components/image/ImageUploader.vue'));
const ImageGalleria = defineAsyncComponent(() => import('@/components/image/ImageGalleria.vue'));

const addImages = ref([]);
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
const store = useOptionStore();
const entityInfo = ref<EntityInfo>();

onBeforeMount(() => {
  store.fetchOptions();
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
  await load();
});

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const filters = ref({
  'entityType': {value: entityInfo.value?.type},
  'entityId': {value: entityInfo.value?.id},
  'type': {value: -1}
});

const onPage = (ev: any) => {
  queryParams.value = ev;
  load();
};
const onSort = (ev: any) => {
  queryParams.value = ev;
  load();
};
const onFilter = () => {
  queryParams.value.filters = filters.value;
  load();
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
    thumb: data.thumb,
  };
  displayEditDialog.value = true;
}

const closeEditDialog = () => {
  displayEditDialog.value = false;
}


//region CRUD
const load = async () => {
  loading.value = true;
  const res = await Axios.post(API.IMAGE_LIST, queryParams.value);
  if (res.success()) {
    images.value = res.data.data;
    totalRecords.value = res.data.total
  }
  loading.value = false;
  first.value = queryParams.value.first;
}

const upload = async () => {
  const fd = new FormData();
  fd.append('entityType', entityInfo.value!.type.toString());
  fd.append('entityId', entityInfo.value!.id.toString());
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
  fd.append('generateThumb', generateThumb!.value);
  editBlock.value = true;
  const res = await axios.form(API.IMAGE_UPLOAD, fd);
  if (res.success()) {
    toast.add(new PToast().success(res.message));
    displayAddDialog.value = false;
    await load();
  } else {
    toast.add(new PToast().error(res.message));
  }
  editBlock.value = false;
}

const update = async () => {
  editBlock.value = true;
  let json = {
    id: imageEdit.value.id,
    type: imageEdit.value.type.value,
    name: imageEdit.value.name,
    nameZh: imageEdit.value.nameZh,
    detail: imageEdit.value.detail,
  };
  const res = await Axios.post(API.IMAGE_UPDATE, json);
  if (res.success()) {
    closeEditDialog();
    await load();
    toast.add(new PToast().success(res.message));
  } else {
    toast.add(new PToast().error(res.message));
  }
  editBlock.value = false;
};

const remove = async () => {
  editBlock.value = true;
  let param = [];
  for(let i of selectedItems.value as any[]) {
    param.push({
      id: i.id,
      url: i.url
    })
  }

  const res = await axios.delete(API.IMAGE_DELETE, param);
  if (res.success()) {
    selectedItems.value = [];
    displayDeleteDialog.value = false;
    await load();
    toast.add(new PToast().success(res.message));
  } else {
    toast.add(new PToast().error(res.message));
  }
  editBlock.value = false;
}
//endregion

const activeIndex = ref(0)
const displayCustom = ref(false)
const imageClick = (index: number) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
</script>

<style scoped>

</style>