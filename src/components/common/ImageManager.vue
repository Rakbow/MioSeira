<template>
  <Toast/>
  <BlockUI :blocked="editBlock">
    <Panel>
      <template #header>
        <i class="pi pi-plus-circle mr-2" style="font-size: 2rem"/>
        <b>{{ $const.Add }}</b>
      </template>
      <div class="grid">
        <div class="col-5">
          <div class="grid">
            <div class="col-6 text-start">
              <FileUpload
                  mode="basic"
                  :customUpload="true"
                  accept="image/*"
                  :auto="true"
                  :chooseLabel="$const.UploadImage"
                  :maxFileSize="2000000" :previewWidth="100"
                  :invalidFileSizeMessage="$const.ImageInvalidFileSizeMessage"
                  @uploader="onUpload"
                  @select="selectFile"/>
            </div>
            <div class="col-6 text-end">
              <Button class="ml-2 p-button-text" icon="pi pi-trash"
                      :label="$const.Clear" @click="clearUploadedImage"/>
            </div>
          </div>
          <div class="formgrid grid mt-2">
            <div class="field col-6">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-image"/>
                </span>
                <InputText v-model="imageInfo.nameZh" :placeholder="$const.ImageNameZh" />
              </div>
            </div>
            <div class="field col-6">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-image"/>
                </span>
                <InputText v-model="imageInfo.name" :placeholder="$const.ImageNameEn" />
              </div>
            </div>
            <div class="field col-6">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-tag"/>
                </span>
                <Dropdown v-model="imageInfo.type" :options="$const.ImageTypes" optionLabel="label"
                          optionValue="value" :placeholder="$const.PleaseSelectImageType" />
              </div>
            </div>
            <div class="field col-6">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-bars"/>
                </span>
                <InputText v-model="imageInfo.detail" :placeholder="$const.Description" />
              </div>
            </div>
          </div>
          <div class="formgrid grid mt-2">
            <div class="field col" style="text-align: left">
              <Button :label="$const.Add" icon="pi pi-save" @click="save2imageInfos" />
            </div>
            <div class="field col" style="text-align: right">
              <Button :label="$const.Commit" icon="pi pi-save" @click="submitImages" class="p-button-success" />
            </div>
          </div>
        </div>
        <div class="col-2">
          <Divider layout="vertical" />
        </div>
        <div class="col-5">
          <div class="field">
            <span v-if=" imageHtml === '' " class="emptyInfo">{{ $const.NotImageSelected }}</span>
            <section>
              <div id="imgBox" v-html="imageHtml"/>
            </section>
          </div>
        </div>
      </div>
    </Panel>
    <Panel>
      <template #header>
        <i class="pi pi-pencil mr-2" style="font-size: 2rem"/>
        <b>{{ $const.Edit }}</b>
      </template>
      <div v-if="itemImageInfo.images.length !== 0">
        <DataTable :value="itemImageInfo.images" class="p-datatable-sm"
                   @row-reorder="imgRowReorder" edit-mode="row" striped-rows
                   v-model:editing-rows="editingImages" @row-edit-save="imgRowEditSave"
                   v-model:expanded-rows="expandedRows"
                   v-model:selection="selectedImage">
          <template #header>
            <Button icon="pi pi-trash" class="p-button-danger"
                    @click="confirmDeleteSelectedImage"/>
          </template>
          <Column selection-mode="multiple" header-style="width: 4%"></Column>
          <Column :row-reorder="true" header-style="width: 3%"></Column>
          <Column :expander="true" headerStyle="width: 3%"></Column>
          <Column :header="$const.Image" header-style="width: 8%">
            <template #body="slotProps">
              <img :src="slotProps.data.thumbUrl50" :alt="slotProps.data.name"
                   class="edit-image"/>
            </template>
          </Column>
          <!--                        <p-column field="url" header="URL" header-style="width: 10%">-->
          <!--                            <template #body="slotProps">-->
          <!--                                {{slotProps.data.url.substr(22)}}-->
          <!--                            </template>-->
          <!--                        </p-column>-->
          <Column field="nameZh" :header="$const.ImageNameZh" header-style="width: 25%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus style="width: 240px"/>
            </template>
          </Column>
          <Column field="name" :header="$const.ImageNameEn" header-style="width: 25%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus style="width: 240px"/>
            </template>
          </Column>
          <Column field="type" :header="$const.Type" header-style="width: 8%">
            <template #editor="{ data, field }">
              <Dropdown v-model="data[field]" :options="$const.ImageTypes" option-label="label"
                        option-value="value" :placeholder="$const.Type"/>
            </template>
            <template #body="slotProps">
              {{ getImageTypeLabel(slotProps.data.type) }}
            </template>
          </Column>
          <Column field="detail" :header="$const.Description" header-style="width: 17%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus style="width: 180px"/>
            </template>
          </Column>
          <Column :row-editor="true" header-style="width: 7%"></Column>
          <template #expansion="slotProps">
            <div class="orders-subtable">
              <table class="table-borderless table-sm">
                <tbody class="detail-item-artists-table">
                <tr>
                  <td style="width: 120px"><strong>{{ $const.UploadTime }}</strong></td>
                  <td>
                    {{ slotProps.data.uploadTime }}
                  </td>
                </tr>
                <tr>
                  <td style="width: 120px"><strong>URL</strong></td>
                  <td>
                    {{ slotProps.data.url.substr(22) }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
        </DataTable>
      </div>
      <div v-else>
        <span class="emptyInfo"><em>{{ $const.NoImage }}</em></span>
      </div>
    </Panel>
  </BlockUI>
  <div class="text-end mt-3">
    <Button icon="pi pi-times" :label="$const.Cancel" @click="closeImageEditDialog"
            class="p-button-text" :disabled="editBlock"/>
    <Button v-if="itemImageInfo.images.length !== 0"
            icon="pi pi-save" :label="$const.Commit" @click="updateImage" :disabled="editBlock"/>
  </div>
  <Dialog :modal="true" v-model:visible="deleteImageDialog" :header="$const.Delete"
          :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
      <span>{{ $const.ConfirmDeleteImage }}</span>
    </div>
    <template #footer>
      <Button :label="$const.Cancel" icon="pi pi-times" class="p-button-text"
              @click="cancelDeleteSelectedImage"/>
      <Button :label="$const.Delete" icon="pi pi-check" class="p-button-text"
              @click="deleteImage"/>
    </template>
  </Dialog>
</template>

<script setup>
import {useToast} from 'primevue/usetoast';
import {ref, getCurrentInstance, inject, onMounted, onBeforeMount} from "vue";
import {API} from '@/config/Web_Helper_Strs';
import {META} from '@/config/Web_Const';
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {PublicHelper} from "@/utils/publicHelper";
import {useRoute} from "vue-router";
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

const dialogRef = inject("dialogRef");
const route = useRoute();
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const toast = useToast();
const entityType = ref();
const entityId = ref();

onBeforeMount(() => {
  itemImageInfo.value = dialogRef.value.data.itemImageInfo;
});

onMounted(() => {
  getEntityInfo();
});

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}

const itemImageInfo = ref();
const editBlock = ref(false);
const editingImages = ref([]);
const selectedImage = ref([]);
const deleteImageDialog = ref(false);
const imageInfo = ref({
  image: null,
  name: '',
  nameZh: '',
  detail: '',
  type: META.IMAGE_TYPE.DEFAULT
});
const imageInfos = ref([]);
const imageHtml = ref('');
const expandedRows = ref([]);

const getImageTypeLabel = (type) => {
  return PublicHelper.value2Label(type, $const.ImageTypes);
};

const onUpload = () => {
  toast.add({severity: 'info', summary: 'Success', detail: $const.ImageUploadSuccess, life: 3000});
}
const imgRowReorder = (ev) => {
  itemImageInfo.value.images = ev.value;
};
const imgRowEditSave = (ev) => {
  let {newData, index} = ev;
  itemImageInfo.value.images[index] = newData;
};
const confirmDeleteSelectedImage = () => {
  deleteImageDialog.value = true;
};
const cancelDeleteSelectedImage = () => {
  selectedImage.value = [];
  deleteImageDialog.value = false;
};
const closeImageEditDialog = () => {
  imageInfo.value = {
    image: null,
    name: '',
    nameZh: '',
    detail: '',
    type: META.IMAGE_TYPE.DEFAULT
  };
  imageInfos.value = [];
  document.getElementById("imgBox").innerHTML = "";
  dialogRef.value.close();
};
const showImage = () => {
  imageHtml.value = "";
  //<![CDATA[
  imageHtml.value += "<div class='grid' style='max-height: 200px;overflow-y: auto' >";
  for (const img of imageInfos.value) {
    imageHtml.value += '<div class="col-6" style="max-height: 100px">';
    imageHtml.value += `<img src="${img.image.objectURL}" style="max-height: 90px" />`;
    imageHtml.value += '</div>';
    imageHtml.value += '<div class="col-6" style="max-height: 100px">';
    imageHtml.value += `<span>${$const.Type}: ${_find($const.ImageTypes, {value: img.type}).label}</span><br>`;
    imageHtml.value += `<span>${$const.ImageNameZh}: ${img.nameZh}</span><br>`;
    imageHtml.value += `<span>${$const.ImageNameEn}: ${img.name}</span><br>`;
    imageHtml.value += `<span>${$const.Description}: ${img.detail}</span><br>`;
    imageHtml.value += '</div>';
  }
  imageHtml.value += "</div>";
  //]]>
  document.getElementById("imgBox").innerHTML = imageHtml.value;
};
const selectFile = (ev) => {
  imageInfo.value.image = ev.files[0];
};
const checkImageInfo = () => {
  if (_isEmpty(imageInfo.value.detail)) {
    imageInfo.value.detail = "";
  }
  if (_isEmpty(imageInfo.value.image)) {
    toast.add({severity: 'error', summary: 'Error', detail: $const.NotImageSelected, life: 3000});
  }
  if (_isEmpty(imageInfo.value.nameZh)) {
    toast.add({severity: 'error', summary: 'Error', detail: $const.NotImageNameZh, life: 3000});
    return false;
  }
  if (_isEmpty(imageInfo.value.name)) {
    toast.add({severity: 'error', summary: 'Error', detail: $const.NotImageNameEn, life: 3000});
    return false;
  }
  if (_isNil(imageInfo.value.type)) {
    toast.add({severity: 'error', summary: 'Error', detail: $const.NotImageType, life: 3000});
    return false;
  }
  return true;
};
const save2imageInfos = () => {
  if (checkImageInfo()) {
    imageInfos.value.push(imageInfo.value);
    showImage();
    imageInfo.value = {};
  }
};
const clearUploadedImage = () => {
  imageInfos.value = [];
  document.getElementById("imgBox").innerHTML = "";
};
//region crud

const submitImages = async () => {
  editBlock.value = true;
  const formData = new FormData();
  for (const img of imageInfos.value) {
    formData.append("files", img.image);
  }
  formData.append("entityType", entityType.value);
  formData.append("entityId", entityId.value);
  for (const img of imageInfos.value) {
    delete img.image;
  }
  formData.append("infos", imageInfos.value);

  const res = await axios.form(API.ADD_IMAGES, formData);
  if (res.state === axios.SUCCESS) {
    // closeImageEditDialog();
    // location.reload();
    await refreshImages();
    toast.add({severity: 'success', detail: res.message, life: 3000});
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
};
const updateImage = async () => {
  editBlock.value = true;
  let json = {
    entityType: entityType.value,
    entityId: entityId.value,
    images: itemImageInfo.value.images,
    action: META.ACTION.UPDATE
  };
  const res = await axios.post(API.UPDATE_IMAGES, json);
  if (res.state === axios.SUCCESS) {
    closeImageEditDialog();
    location.reload();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
};
const deleteImage = async () => {
  if(selectedImage.value.length === 0) {
    deleteImageDialog.value = false;
    toast.add({severity: 'error', summary: 'Error', detail: $const.NotImageSelected, life: 3000});
    return;
  }
  editBlock.value = true;
  let json = {
    entityType: entityType.value,
    entityId: entityId.value,
    images: selectedImage.value,
    action: META.ACTION.REAL_DELETE
  };
  const res = await axios.post(API.UPDATE_IMAGES, json);
  if (res.state === axios.SUCCESS) {
    deleteImageDialog.value = false;
    selectedImage.value = [];
    await refreshImages();
    toast.add({severity: 'success', detail: res.message, life: 3000});
    // closeImageEditDialog();
    // location.reload();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
};

const refreshImages = async () => {
  editBlock.value = true;
  let param = {
    entityType: entityType.value,
    entityId: entityId.value
  }
  const res = await axios.post(API.GET_IMAGES, param);
  if(res.state === axios.SUCCESS) {
    itemImageInfo.value = res.data;
    editBlock.value = false;
  }else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
}
//endregion

</script>

<style scoped>

</style>