<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import {defineAsyncComponent, inject, onBeforeMount, onMounted, ref} from "vue";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {EntityInfo, META} from "@/config/Web_Const";
import {useRoute} from "vue-router";
import { getIcon } from 'material-file-icons';

const {t} = useI18n();
const toast = useToast();
const dt = ref();
const editBlock = ref(false);
const isUpdate = ref(false);
const fileInfos = ref([]);
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialogRef = inject("dialogRef");
const FileSelector = defineAsyncComponent(() => import('@/components/selector/FileSelector.vue'));
const displaySelector = ref(false);
const createType = ref();
const currentCreateType = ref(0);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted(() => {
  createType.value = META.FILE_CREATE_TYPE_SET[0]
})

const selectFile = async (ev) => {
  if (!ev.files) return;
  fileInfos.value = [];
  for (let file of ev.files) {
    let info = {
      name: file.name,
      size: PublicHelper.formatSize(file.size),
      file: file
    }
    fileInfos.value.push(info)
  }
};
const clearFile = () => {
  dt.value.files = [];
  fileInfos.value = [];
};
const removeFile = (index: number) => {
  fileInfos.value.splice(index, 1);
};

const onCellEdite = (ev) => {
  let {data, newValue, field} = ev;
  switch (field) {
    case 'type':
      data[field] = newValue;
      break;

    default:
      if (newValue === undefined) data[field] = '';
      else if (newValue.trim().length > 0) data[field] = newValue;
      else data[field] = '';
      break;
  }
};

const submit = () => {
  if(parseInt(createType.value.value) === 0)
    submitByUpload()
  if(parseInt(createType.value.value) === 1)
    submitByCould()
}

const submitByUpload = async () => {
  const fd = new FormData();
  fd.append('entityType', entityInfo.value?.type);
  fd.append('entityId', entityInfo.value?.id);
  fileInfos.value.forEach(f => {
    fd.append('files', f.file);
    fd.append('names', f.name);
    fd.append('remarks', f.remark);
  });
  editBlock.value = true;
  const res = await axios.form(API.UPLOAD_FILES, fd);
  if (res.state === axios.SUCCESS)
    toast.add({severity: 'success', detail: res.message, life: 3000});
    isUpdate.value = true;
    close();
  fileInfos.value = [];
  editBlock.value = false;
}

const submitByCould = async () => {
  let param = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    fileIds: fileInfos.value.map(f => f.id)
  }
  editBlock.value = true;
  const res = await axios.post(API.CREATE_FILE_RELATED, param);
  if (res.state === axios.SUCCESS)
    toast.add({severity: 'success', detail: res.message, life: 3000});
  isUpdate.value = true;
  close();
  fileInfos.value = [];
  editBlock.value = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: isUpdate.value
      }
  );
}

const handleSize = (size) => {
  if(size instanceof Number)
    return PublicHelper.formatSize(size)
  return size
}

const switchCreateType = (ev) => {
  if (ev.value === null)
    createType.value = parseInt(META.FILE_CREATE_TYPE_SET[0].value);
  currentCreateType.value = parseInt(createType.value.value);
  fileInfos.value = [];
}



</script>
<template>
  <BlockUI :blocked="editBlock">
    <SelectButton size="small" v-model="createType" :options="META.FILE_CREATE_TYPE_SET"
                  @change="switchCreateType($event)"
                  optionLabel="value" dataKey="value" ariaLabelledby="custom">
      <template #option="slotProps">
        <span class="material-symbols-outlined">{{ slotProps.option.icon }}</span>
      </template>
    </SelectButton>
    <FileUpload v-show="currentCreateType === 0" ref="dt" auto multiple :customUpload="true"
                :showUploadButton="false"
                :showCancelButton="false"
                chooseIcon="pi pi-image" @select="selectFile"
                :maxFileSize="1000000000" :previewWidth="100"
                :invalidFileSizeMessage="$t('ImageInvalidFileSizeMessage')">
      <template #header="{ chooseCallback }">
        <Button @click="chooseCallback()" icon="pi pi-file" rounded outlined/>
        <Button @click="clearFile" icon="pi pi-times" rounded outlined severity="danger"
                :disabled="!fileInfos || fileInfos.length === 0"/>
      </template>
      <template #empty>
        <span class="empty-search-result">{{ $t('DragImage') }}</span>
      </template>
    </FileUpload>
    <Button v-show="currentCreateType === 1" variant="text" outlined @click="displaySelector = true">
      <template #icon>
        <span class="material-symbols-outlined">add_box</span>
      </template>
    </Button>

    <DataTable ref="dt" :value="fileInfos" class="p-datatable-sm"
               :alwaysShowPaginator="fileInfos.length !== 0"
               paginator :rows="5" editMode="cell" @cellEditComplete="onCellEdite"
               scrollable scrollHeight="flex" size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}">
      <template #empty>
        <span class="emptyInfo">
            {{ $t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <Column style="width: 40px">
        <template #body="slotProps">
          <div v-html="getIcon(slotProps.data.name).svg"/>
        </template>
      </Column>
      <Column :header="$t('Name')" field="name" style="width: 300px">
        <template #body="slotProps">
          <div class="data-table-field-text-overflow-hidden">{{ slotProps.data.name }}</div>
        </template>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid/>
        </template>
      </Column>
      <Column :header="$t('Size')" field="size" style="width: 80px">
        <template #body="slotProps">{{handleSize(slotProps.data.size)}}</template>
      </Column>
      <Column style="width: 1rem">
        <template #body="{ index }">
          <Button size="small" icon="pi pi-times" outlined rounded severity="danger"
                  @click="removeFile(index)"/>
        </template>
      </Column>
    </DataTable>
    <Button icon="pi pi-times" :label="$t('Cancel')" @click="close"
            class="p-button-text"/>
    <Button icon="pi pi-save" :label="$t('Save')" @click="submit" :disabled="!fileInfos.length" />
  </BlockUI>


  <Dialog :modal="true" v-model:visible="displaySelector" :style="{width: '600px'}" :header="$t('Add')">
    <FileSelector :entries="fileInfos"/>
  </Dialog>
</template>

<style scoped lang="scss">

</style>