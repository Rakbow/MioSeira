<template>
  <BlockUI :blocked="editBlock">
    <Panel>
      <template #header>
        <i class="pi pi-plus-circle mr-2" style="font-size: 2rem"></i>
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
                  @select="selectFile" />
            </div>
            <div class="col-6 text-end">
              <Button class="ml-2 p-button-text" icon="pi pi-trash"
                        :label="$const.Clear" @click="clearUploadedImage" />
            </div>
          </div>
          <div class="formgrid grid mt-2">
            <div class="field col-6">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-image" />
                </span>
                <InputText v-model="imageInfo.nameZh" :placeholder="$const.ImageNameZh" />
              </div>
            </div>
            <div class="field col-6">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-image" />
                </span>
                <InputText v-model="imageInfo.nameEn" :placeholder="$const.ImageNameEn" />
              </div>
            </div>
            <div class="field col-6">
              <Dropdown v-model="imageInfo.type" :options="$const.ImageTypes" option-label="label"
                          option-value="value" :placeholder="$const.PleaseSelectImageType"
                          style="width: 224px" />
            </div>
            <div class="field col-6">
              <Textarea v-model="imageInfo.description" rows="1" cols="20"
                          :auto-resize="true" :placeholder="$const.Description"
                          style="width: 224px" />
            </div>
          </div>
          <div class="formgrid grid mt-2">
            <div class="field col" align="left">
              <Button :label="$const.Add" icon="pi pi-save"
                        @click="save2imageInfos" />
            </div>
            <div class="field col" align="right">
              <Button :label="$const.Commit" icon="pi pi-save"
                        @click="submitImages" class="p-button-success" />
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
              <div id="imgBox" v-html="imageHtml" />
            </section>
          </div>
        </div>
      </div>
    </Panel>
    <Panel>
      <template #header>
        <i class="pi pi-pencil mr-2" style="font-size: 2rem"></i>
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
                      @click="confirmDeleteSelectedImage" />
          </template>
          <Column selection-mode="multiple" header-style="width: 4%"></Column>
          <Column :row-reorder="true" header-style="width: 3%"></Column>
          <Column :expander="true" headerStyle="width: 3%"></Column>
          <Column :header="$const.Image" header-style="width: 8%">
            <template #body="slotProps">
              <img :src="slotProps.data.thumbUrl50" :alt="slotProps.data.nameEn"
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
              <InputText v-model="data[field]" autofocus style="width: 240px" />
            </template>
          </Column>
          <Column field="nameEn" :header="$const.ImageNameEn" header-style="width: 25%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus style="width: 240px" />
            </template>
          </Column>
          <Column field="type" :header="$const.Type" header-style="width: 8%">
            <template #editor="{ data, field }">
              <Dropdown v-model="data[field]" :options="$const.ImageTypes" option-label="label"
                          option-value="value" :placeholder="$const.Type" />
            </template>
            <template #body="slotProps">
              {{ getImageTypeLabel(slotProps.data.type) }}
            </template>
          </Column>
          <Column field="description" :header="$const.Description" header-style="width: 17%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus style="width: 180px" />
            </template>
          </Column>
          <Column :row-editor="true" header-style="width: 7%"></Column>
          <template #expansion="slotProps">
            <div class="orders-subtable">
              <table class="table-borderless table-sm">
                <tbody class="detail-item-artists-table">
                <tr>
                  <td width="120px"><strong>{{ $const.UploadTime }}</strong></td>
                  <td>
                    {{slotProps.data.uploadTime}}
                  </td>
                </tr>
                <tr>
                  <td width="120px"><strong>URL</strong></td>
                  <td>
                    {{slotProps.data.url.substr(22)}}
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
              class="p-button-text" :disabled="editBlock" />
    <Button v-if="itemImageInfo.images.length !== 0"
              icon="pi pi-save" :label="$const.Commit" @click="updateImage" :disabled="editBlock" />
  </div>
  <Dialog :modal="true" v-model:visible="deleteImageDialog" :header="$const.Delete"
            :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
      <span>{{ $const.ConfirmDeleteImage }}</span>
    </div>
    <template #footer>
      <Button :label="$const.Cancel" icon="pi pi-times" class="p-button-text"
                @click="cancelDeleteSelectedImage" />
      <Button :label="$const.Delete" icon="pi pi-check" class="p-button-text"
                @click="deleteImage" />
    </template>
  </Dialog>
</template>

<script setup>
  import { useToast } from 'primevue/usetoast';
  import {ref, getCurrentInstance, defineProps, inject, onMounted, onBeforeMount} from "vue";
  import {API} from '@/config/Web_Helper_Strs';
  import {AxiosHelper} from "@/utils/axiosHelper";
  import {PublicHelper} from "@/utils/publicHelper";
  import {useRoute} from "vue-router";

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
  const  imageInfo = ref({
    image: null,
    nameZh: '',
    nameEn: '',
    description: '',
    type: 0
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

  const updateImage = () => {
    editBlock.value = true;
    let json = {
      entityType: entityType.value,
      entityId: entityId.value,
      images: itemImageInfo.value.images,
      action: "1"
    };
    AxiosHelper.post(API.UPDATE_IMAGES, json)
        .then(res => {
          if (res.state === 1) {
            closeImageEditDialog();
            location.reload();
          }else {
            editBlock.value = false;
          }
        }).catch(err => {
      console.error(err);
    });
  }
  const confirmDeleteSelectedImage = () => {
    deleteImageDialog.value = true;
  };
  const cancelDeleteSelectedImage = () => {
    selectedImage.value = [];
    deleteImageDialog.value = false;
  };
  const deleteImage = () => {
    editBlock.value = true;
    let json = {
      entityType: entityType.value,
      entityId: entityId.value,
      images: selectedImage.value,
      action: "2"
    };
    AxiosHelper.post(API.UPDATE_IMAGES, json)
        .then(res => {
          if (res.state === 1) {
            deleteImageDialog.value = false;
            closeImageEditDialog();
            selectedImage.value = [];
            location.reload();
          }else {
            editBlock.value = false;
          }
        }).catch(err => {
      console.error(err);
    });
  };
  const closeImageEditDialog = () => {
    imageInfo.value = {
      image: null,
      nameZh: '',
      nameEn: '',
      description: '',
      type: 0
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
      imageHtml.value += '<img src="' + img.image.objectURL + '" style="max-height: 90px" />';
      imageHtml.value += '</div>';
      imageHtml.value += '<div class="col-6" style="max-height: 100px">';
      imageHtml.value += '<span>图片类型: ' + (img.type === "1" ? "封面" : (img.type === "0" ? "展示" : "其他")) + '</span><br>';
      imageHtml.value += '<span>图片名(中): ' + img.nameZh + '</span><br>';
      imageHtml.value += '<span>图片名(英): ' + img.nameEn + '</span><br>';
      imageHtml.value += '<span>描述: ' + img.description + '</span><br>';
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
    if (typeof imageInfo.value.description == "undefined") {
      imageInfo.description = "";
    }
    if (imageInfo.value.image === null) {
      toast.add({severity: 'error', summary: 'Error', detail: IMAGE_EMPTY_EXCEPTION, life: 3000});
    }
    if (typeof imageInfo.value.nameZh == "undefined") {
      toast.add({severity: 'error', summary: 'Error', detail: IMAGE_NAME_ZH_EMPTY_EXCEPTION, life: 3000});
      return false;
    }
    if (typeof imageInfo.value.nameEn == "undefined") {
      toast.add({severity: 'error', summary: 'Error', detail: IMAGE_NAME_EN_EMPTY_EXCEPTION, life: 3000});
      return false;
    }
    if (typeof imageInfo.value.type == "undefined") {
      toast.add({severity: 'error', summary: 'Error', detail: IMAGE_TYPE_EMPTY_EXCEPTION, life: 3000});
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
  const submitImages = () => {
    editBlock.value = true;
    const formData = new FormData();
    for (const img of imageInfos.value) {
      formData.append("images", img.image);
    }
    formData.append("entityType", entityType.value);
    formData.append("entityId", entityId.value);
    formData.append("imageInfos", JSON.stringify(imageInfos.value));

    AxiosHelper.form(toast, editBlock.value, API.INSERT_IMAGES_URL, formData)
        .then(res => {
          if (res.state === 1) {
            closeImageEditDialog();
            location.reload();
          }else {
            editBlock.value = false;
          }
        }).catch(err => {
      console.error(err);
    });
  };

</script>

<style scoped>

</style>