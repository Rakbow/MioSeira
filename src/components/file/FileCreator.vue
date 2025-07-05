<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import {defineAsyncComponent, getCurrentInstance, inject, onBeforeMount, onMounted, ref} from "vue";
import {PublicHelper} from "@/toolkit/publicHelper";
import {API, Axios} from "@/api";
import {EntityInfo} from "@/config/Web_Const";
import {useRoute} from "vue-router";
import {getIcon} from 'material-file-icons';
import {PToast} from "@/logic/frame";
import {FileInfoCreateDTO} from "@/logic/entityService";

const {t} = useI18n();
const toast = useToast();
const fu = ref();
const block = ref(false);
const isUpdate = ref(false);
const fileInfos = ref<FileInfoCreateDTO[]>([]);
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialogRef = inject<any>("dialogRef");
const FileSelector = defineAsyncComponent(() => import('@/components/selector/FileSelector.vue'));
const displaySelector = ref(false);
const createType = ref();
const currentCreateType = ref(0);
const {proxy} = getCurrentInstance()!;

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted(() => {
  createType.value = $const.FILE_CREATE_TYPE_SET[0]
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

const onReorder = (ev) => {
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
  fd.append('entityType', entityInfo.value!.type.toString());
  fd.append('entityId', entityInfo.value!.id.toString());
  fileInfos.value!.forEach(f => {
    fd.append('files', f.file);
    fd.append('names', f.name);
  });
  block.value = true;
  const res = await axios.form(API.FILE_UPLOAD, fd);
  if (res.success())
    toast.add(new PToast().success(res.message));
  else
    toast.add(new PToast().error(res.message));
  isUpdate.value = true;
  close();
  fileInfos.value = [];
  block.value = false;
}

const submitByCould = async () => {
  let param = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    fileIds: fileInfos.value!.map(f => f.id)
  }
  block.value = true;
  const res = await Axios.post(API.FILE_RELATED_CREATE, param);
  if (res.success())
    toast.add(new PToast().success(res.message));
  isUpdate.value = true;
  close();
  fileInfos.value = [];
  block.value = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: isUpdate.value
      }
  )
}

const switchCreateType = (ev: any) => {
  if (ev.value === null)
    createType.value = parseInt(proxy.$const.FILE_CREATE_TYPE_SET[0].value);
  currentCreateType.value = parseInt(createType.value.value);
  fileInfos.value = [];
}


</script>
<template>
  <BlockUI :blocked="block">
    <SelectButton size="small" v-model="createType" :options="$const.FILE_CREATE_TYPE_SET"
                  @change="switchCreateType($event)"
                  optionLabel="value" dataKey="value" ariaLabelledby="custom">
      <template #option="{option}">
        <MaterialIcon :name="option!.icon" />
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
        <FileUpload v-show="currentCreateType === 0" ref="fu" auto multiple
                    :showUploadButton="false"
                    :showCancelButton="false"
                    chooseIcon="pi pi-image" @select="selectFile"
                    :maxFileSize="1000000000" :previewWidth="100"
                    :invalidFileSizeMessage="t('InvalidFileSizeMessage')">
          <template #header="{ chooseCallback }">

            <Button variant="text" outlined @click="chooseCallback()">
              <template #icon>
                <MaterialIcon name="upload_file"/>
              </template>
            </Button>
            <Button variant="text" outlined @click="clearFile" severity="danger" :disabled="!fileInfos.length">
              <template #icon>
                <MaterialIcon name="scan_delete"/>
              </template>
            </Button>
          </template>
          <template #content>
            <span class="empty-search-result">{{ t('DragFile') }}</span>
          </template>
        </FileUpload>
        <div v-show="currentCreateType === 1">
          <Button variant="text" outlined @click="displaySelector = true">
            <template #icon>
              <MaterialIcon name="backup"/>
            </template>
          </Button>
          <Button variant="text" outlined @click="clearFile" severity="danger" :disabled="!fileInfos.length">
            <template #icon>
              <MaterialIcon name="scan_delete"/>
            </template>
          </Button>
        </div>
      </template>
      <template #empty>
        <span class="emptyInfo">
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
          <InputText v-model="data[field]" autofocus fluid/>
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