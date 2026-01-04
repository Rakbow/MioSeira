<template>
  <DataTable ref="dt" :value="param.result.data" class="entity-manager-datatable"
             lazy :loading="param.loading" size="small" paginator columnResizeMode="fit"
             @sort="onSort($event)" @filter="onFilter" filterDisplay="row" alwaysShowPaginator
             v-model:filters="param.query.filters" :rows="param.query.size"
             v-model:selection="param.selectedData" dataKey="id" removableSort
             scrollable scrollHeight="flex" showGridlines responsiveLayout="scroll">
    <template #paginatorcontainer>
      <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                  :total="param.result.total" @page="onPage($event)" :time="param.result.time"/>
    </template>
    <template #empty>
      <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
      <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <RIcon class="pi-spin" name="autorenew" size="10rem"/>
    </template>
    <template #header>
      <BlockUI :blocked="param.blocking">
        <RButton @click="openUpload" action="create"/>
        <RButton @click="openDelete" action="delete" :disabled="!param.selectedData.length"/>
      </BlockUI>
    </template>
    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <RButton @click="openUpdate(data)" action="update" size="small"/>
      </template>
    </Column>

    <Column class="text-center" style="width: 2.5rem">
      <template #body="{data}">
        <Image preview>
          <template #image>
            <img :src="data.thumb" draggable="false" oncontextmenu="return false" :alt="data.name"
                 style="max-width: 2.5rem;max-height: 2.5rem;width: auto;height: auto"/>
          </template>
          <template #original="{style, previewCallback}">
            <img :src="data.display" :alt="data.name" :style="style" @click="previewCallback" />
          </template>
        </Image>
      </template>
    </Column>
    <Column :header="t('Name')" filterField="keyword" field="name"
            :sortable="true" :showFilterMenu="false" :showClearButton="true">
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" size="large" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('Size')" field="size" :sortable="true" style="width: 7rem"/>
    <Column :header="t('Type')" filterField="type" :showFilterMenu="false" :sortable="true" class="text-center"
            style="width: 7rem">
      <template #body="{data}">
        <Tag v-if="data.type.value !== $const.IMAGE_TYPE.DEFAULT" :value="data.type.label"/>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <Select size="large" v-model="filterModel.value" :options="store.options.imageTypeSet"
                @change="filterCallback()"
                :showClear="true" optionLabel="label" optionValue="value" Style="width: 9rem"/>
      </template>
    </Column>
    <Column :header="t('UploadTime')" field="addedTime" :sortable="true" style="width: 14rem"/>
  </DataTable>
  <Dialog :modal="true" v-model:visible="uploadDisplay" :header="t('Add')" style="width: 60rem" class="entity-editor">
    <BlockUI :blocked="param.blocking">
      <ImageUploader v-model:images="uploadImages" v-model:generateThumb="generateThumb"/>
    </BlockUI>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" variant="text"
              @click="uploadDisplay = false" :disabled="param.blocking"/>
      <Button :label="t('Save')" icon="pi pi-check"
              @click="upload" :disabled="param.blocking || uploadImages.length === 0"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="updateDisplay" :header="t('Edit')" class="entity-editor">
    <div class="flex flex-wrap mb-3" style="display: flex;justify-content: center;">
      <div class="entry-thumb">
        <img role="presentation" :alt="updateDTO!.name" :src="updateDTO!.thumb"/>
      </div>
    </div>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Path') }}</label>
      <InputText size="large" id="url" v-model="updateDTO!.url" disabled/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Name') }}</label>
      <InputText size="large" v-model="updateDTO!.name"/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Type') }}</label>
      <Select size="large" v-model="updateDTO!.type" :options="store.options.imageTypeSet"
              optionLabel="label" optionValue="value"/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Description') }}</label>
      <InputText size="large" v-model="updateDTO!.detail"/>
    </FloatLabel>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" variant="text" @click="updateDisplay = false"/>
      <Button :label="t('Save')" icon="pi pi-check" @click="update"/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, onMounted, ref} from "vue";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/store/modules/option";
import {EntitySearchParam} from "@/service/entityService";
import {bs} from '@/service/baseService';
import 'tingle.js/src/tingle.css';

const ImageUploader = defineAsyncComponent(() => import('@/components/image/ImageUploader.vue'));

const {t} = useI18n();

const dt = ref();
const generateThumb = ref(false);
const store = useOptionStore();
const dialogRef = inject<any>('dialogRef');
const param = ref(new EntitySearchParam());

onBeforeMount(() => {
  store.fetchOptions();
  param.value.initFilters({
    entityType: {value: dialogRef.value.data.type},
    entityId: {value: dialogRef.value.data.id},
    keyword: {value: ''},
    type: {value: null}
  });
});

onMounted(() => {
  load();
});

//region query
const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage();
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};
const onFilter = () => {
  param.value.initPage();
  load();
};
const load = async () => {
  param.value.load();
  const res = await Axios.post(API.IMAGE.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
};
//endregion

//region create
const uploadDisplay = ref(false);
const uploadImages = ref<ImageDTO[]>([]);
const openUpload = () => {
  uploadImages.value = [];
  uploadDisplay.value = true;
}
const upload = async () => {
  const fd = new FormData();
  fd.append('entityType', dialogRef.value.data.type.toString());
  fd.append('entityId', dialogRef.value.data.id.toString());
  let infos: any[] = [];
  uploadImages.value.forEach(i => {
    infos.push({
      name: i.name,
      type: i.type,
      detail: i.detail
    });
    fd.append('files', i.file!)
  })
  fd.append('infos', JSON.stringify(infos));
  fd.append('generateThumb', generateThumb!.value.toString());
  param.value.block();
  const res = await Axios.form(API.IMAGE.UPLOAD, fd);
  if (res.success()) {
    bs!.toast.success(res.message);
    uploadDisplay.value = false;
    await load();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endBlock();
}
//endregion

//region update
const updateDisplay = ref(false);
const updateDTO = ref<ImageUpdateDTO>();
const openUpdate = (data: any) => {
  updateDTO.value = {
    id: data.id,
    url: data.url,
    type: data.type.value,
    name: data.name,
    nameZh: data.nameZh,
    detail: data.detail,
    thumb: data.thumb,
  };
  updateDisplay.value = true;
}
const update = async () => {
  param.value.block();
  const res = await Axios.post(API.IMAGE.UPDATE, updateDTO.value);
  if (res.success()) {
    bs!.toast.success(res.message);
    updateDisplay.value = false;
    await load();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endBlock();
};
//endregion

//region delete
const openDelete = () => {
  bs!.confirm.require({
    group: 'templating',
    header: t('Delete'),
    message: t('ConfirmDeleteSelected'),
    icon: 'pi pi-trash',
    rejectProps: {
      label: t('Cancel'),
      icon: 'pi pi-times',
      severity: 'secondary',
      outlined: true,
      size: 'large'
    },
    acceptProps: {
      label: t('Delete'),
      severity: 'danger',
      icon: 'pi pi-check',
      size: 'large'
    },
    accept: () => {
      remove();
    }
  });
};

const remove = async () => {
  param.value.block();
  let dto: ImageDeleteDTO = {
    entityType: dialogRef.value.data.type,
    entityId: dialogRef.value.data.id,
    images: []
  }
  for (let i of param.value.selectedData as any[]) {
    dto.images.push({
      id: i.id,
      url: i.url
    })
  }

  const res = await Axios.delete(API.IMAGE.DELETE, dto);
  if (res.success()) {
    param.value.selectedData = [];
    await load();
    bs!.toast.success(res.message);
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endBlock();
}
//endregion
</script>

<style scoped lang="scss">
</style>