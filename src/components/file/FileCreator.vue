<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, getCurrentInstance, inject, onMounted, ref} from "vue";
import {PublicHelper} from "@/utils/publicHelper";
import {API, Axios} from "@/api";
import {getIcon} from 'material-file-icons';
import {EditParam, FileInfoCreateDTO} from "@/service/entityService";
import {bs} from '@/service/baseService';

const {t} = useI18n();
const fu = ref();
const fileInfos = ref<FileInfoCreateDTO[]>([]);
const dialogRef = inject<any>("dialogRef");
const FileSelector = defineAsyncComponent(() => import('@/components/file/FileSelector.vue'));
const displaySelector = ref(false);
const createType = ref();
const currentCreateType = ref(0);
const {proxy} = getCurrentInstance()!;
const param = ref(new EditParam());

onMounted(() => {
  createType.value = proxy!.$const.FILE_CREATE_TYPE_SET[0];
})

const selectFile = (ev: any) => {
  if (!ev.files) return;
  for (let file of ev.files) {
    let info = new FileInfoCreateDTO();
    info.name = file.name;
    info.size = PublicHelper.formatSize(file.size);
    info.file = file;
    fileInfos.value.push(info)
  }
  fu.value.files = [];
};
const clearFile = () => {
  fileInfos.value = [];
};
const removeFile = (index: number) => {
  fileInfos.value!.splice(index, 1);
};

const onReorder = (ev: any) => {
  fileInfos.value = ev.value;
};

const onCellEdit = (ev: any) => {
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
  if (parseInt(createType.value.value) === 0)
    submitByUpload()
  if (parseInt(createType.value.value) === 1)
    submitByCould()
}

const submitByUpload = async () => {
  const fd = new FormData();
  fd.append('entityType', dialogRef.value.data.type.toString());
  fd.append('entityId', dialogRef.value.data.id.toString());
  fileInfos.value!.forEach(f => {
    fd.append('files', f.file!);
    fd.append('names', f.name);
  });
  param.value.block = true;
  const res = await Axios.form(API.FILE.UPLOAD, fd);
  if (res.success())
    bs!.toast.success(res.message);
  else
    bs!.toast.error(res.message);
  param.value.isUpdate = true;
  close();
  fileInfos.value = [];
  param.value.block = false;
}

const submitByCould = async () => {
  param.value.data = {
    entityType: dialogRef.value.data.type,
    entityId: dialogRef.value.data.id,
    fileIds: fileInfos.value!.map(f => f.id)
  }
  param.value.block = true;
  const res = await Axios.post(API.FILE.RELATED_CREATE, param.value.data);
  if (res.success())
    bs!.toast.success(res.message);
  param.value.isUpdate = true;
  close();
  fileInfos.value = [];
  param.value.block = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: param.value.isUpdate
      }
  )
}

const switchCreateType = (ev: any) => {
  if (ev.value === null)
    createType.value = parseInt(proxy!.$const.FILE_CREATE_TYPE_SET[0].value);
  currentCreateType.value = parseInt(createType.value.value);
  fileInfos.value = [];
}


</script>
<template>
  <BlockUI :blocked="param.block">
    <SelectButton size="small" v-model="createType" :options="$const.FILE_CREATE_TYPE_SET"
                  @change="switchCreateType($event)"
                  optionLabel="value" dataKey="value" ariaLabelledby="custom">
      <template #option="{option}">
        <RIcon :name="option!.icon" />
        <span style="font-size: 1.5rem">{{ t(option!.label) }}</span>
      </template>
    </SelectButton>
    <DataTable ref="dt" :value="fileInfos"
               :alwaysShowPaginator="fileInfos.length !== 0"
               paginator :rows="10" editMode="cell" @cellEditComplete="onCellEdit"
               scrollable scrollHeight="flex" size="small" @rowReorder="onReorder"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;">
      <template #header>
        <FileUpload v-if="currentCreateType === 0" ref="fu" auto multiple
                    :showUploadButton="false"
                    :showCancelButton="false"
                    chooseIcon="pi pi-image" @select="selectFile"
                    :maxFileSize="1000000000" :previewWidth="100"
                    :invalidFileSizeMessage="t('InvalidFileSizeMessage')">
          <template #header="{ chooseCallback }">
            <RButton @click="chooseCallback()" icon="upload_file" tip="Upload" />
            <RButton @click="clearFile" icon="scan_delete" tip="Clear" severity="danger" v-if="fileInfos.length"/>
          </template>
          <template #content>
            <span class="empty-search-result">{{ t('DragFile') }}</span>
          </template>
        </FileUpload>
        <template v-if="currentCreateType === 1">
          <RButton @click="displaySelector = true" icon="document_search" tip="Search" />
          <RButton @click="clearFile" icon="scan_delete" tip="Clear" severity="danger" v-if="fileInfos.length" />
        </template>
      </template>
      <template #empty>
        <span>
            {{ t('NoFile') }}
        </span>
      </template>
      <Column rowReorder headerStyle="width: 3rem" />
      <Column style="width: 3rem">
        <template #body="{data}">
          <div v-html="getIcon(data!.name).svg"/>
        </template>
      </Column>
      <Column :header="t('Name')" field="name">
        <template #body="{data}">
          <div class="text-ellipsis">{{ data!.name }}</div>
        </template>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid/>
        </template>
      </Column>
      <Column :header="t('Size')" field="size" style="width: 8rem"/>
      <Column style="width: 1rem">
        <template #body="{ index }">
          <Button icon="pi pi-trash" severity="danger" variant="text"
                  @click="removeFile(index)"/>
        </template>
      </Column>
    </DataTable>
    <div class="mt-3">
      <Button icon="pi pi-times" :label="t('Cancel')" @click="close" variant="text"/>
      <Button icon="pi pi-save" :label="t('Save')" @click="submit" :disabled="!fileInfos.length"/>
    </div>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="displaySelector" style="width: 60rem" :header="t('Add')">
    <FileSelector :entries="fileInfos"/>
  </Dialog>
</template>

<style scoped lang="scss">
</style>