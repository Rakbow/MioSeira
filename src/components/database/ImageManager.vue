<template>
  <BlockUI :blocked="editBlock">
    <Panel>
      <template #header>
        <i class="pi pi-plus-circle mr-2" style="font-size: 2rem"></i>
        <b>{{$constant.Add}}</b>
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
                  chooseLabel="上传图片"
                  :maxFileSize="2000000" :previewWidth="100"
                  invalidFileDizeMessage="{0}大小已超过{1}"
                  @uploader="onUpload"
                  @select="selectFile" />
            </div>
            <div class="col-6 text-end">
              <Button class="ml-2 p-button-text" icon="pi pi-trash"
                        label="清空所选" @click="clearUploadedImage" />
            </div>
          </div>
          <div class="formgrid grid mt-2">
            <div class="field col-6">
              <div class="p-inputgroup">
                                                <span class="p-inputgroup-addon">
                                                    <i class="pi pi-image"></i>
                                                </span>
                <InputText v-model="imageInfo.nameZh" placeholder="图片名(中)" />
              </div>
            </div>
            <div class="field col-6">
              <div class="p-inputgroup">
                                                <span class="p-inputgroup-addon">
                                                    <i class="pi pi-image"></i>
                                                </span>
                <InputText v-model="imageInfo.nameEn" placeholder="图片名(英)" />
              </div>
            </div>
            <div class="field col-6">
              <Dropdown v-model="imageInfo.type" :options="imageTypes" option-label="label"
                          option-value="value" placeholder="选择图片类型"
                          style="width: 224px" />
            </div>
            <div class="field col-6">
              <Textarea v-model="imageInfo.description" rows="1" cols="20"
                          :auto-resize="true" placeholder="图片描述"
                          style="width: 224px" />
            </div>
          </div>
          <div class="formgrid grid mt-2">
            <div class="field col" align="left">
              <Button label="新增图片" icon="pi pi-save"
                        @click="save2imageInfos" />
            </div>
            <div class="field col" align="right">
              <Button label="提交新增" icon="pi pi-save"
                        @click="submitImages" class="p-button-success" />
            </div>
          </div>
        </div>
        <div class="col-2">
          <Divider layout="vertical" />
        </div>
        <div class="col-5">
          <div class="field">
            <span v-if=" imageHtml == '' " class="emptyInfo">还未选择图片</span>
            <section>
              <div id="imgBox" v-html="imageHtml"></div>
            </section>
          </div>
        </div>
      </div>
    </Panel>
    <Panel>
      <template #header>
        <i class="pi pi-pencil mr-2" style="font-size: 2rem"></i>
        <b>编辑</b>
      </template>
      <div v-if="itemImageInfo.images.length != 0">
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
          <Column header="图片" header-style="width: 8%">
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
          <Column field="nameZh" header="名(中)" header-style="width: 25%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus style="width: 240px" />
            </template>
          </Column>
          <Column field="nameEn" header="名(英)" header-style="width: 25%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus style="width: 240px" />
            </template>
          </Column>
          <Column field="type" header="类型" header-style="width: 8%">
            <template #editor="{ data, field }">
              <Dropdown v-model="data[field]" :options="imageTypes" option-label="label"
                          option-value="value" placeholder="图片类型" />
            </template>
            <template #body="slotProps">
              {{getImageTypeLabel(slotProps.data.type)}}
            </template>
          </Column>
          <Column field="description" header="描述" header-style="width: 17%">
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
                  <td width="120px"><strong>上传时间</strong></td>
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
        <span class="emptyInfo"><em>暂无图片</em></span>
      </div>
    </Panel>
  </BlockUI>
  <div class="text-end mt-3">
    <Button icon="pi pi-times" label="取消" @click="closeImageEditDialog"
              class="p-button-text" :disabled="editBlock" />
    <Button v-if="itemImageInfo.images.length != 0"
              icon="pi pi-save" label="提交更新" @click="updateImage" :disabled="editBlock" />
  </div>
  <Dialog :modal="true" v-model:visible="deleteImageDialog" header="删除图片"
            :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
      <span>确定删除所选的图片？</span>
    </div>
    <template #footer>
      <Button label="取消" icon="pi pi-times" class="p-button-text"
                @click="cancelDeleteSelectedImage" />
      <Button label="确认删除" icon="pi pi-check" class="p-button-text"
                @click="deleteImage" />
    </template>
  </Dialog>
</template>

<script setup>
  import { useToast } from 'primevue/usetoast';
  import {ref, getCurrentInstance} from "vue";
  import {API} from '@/config/Web_Helper_Strs';
  import {AxiosHelper} from "@/utils/axiosHelper";

  const $constant = getCurrentInstance().appContext.config.globalProperties.$constant;

  const toast = useToast();
  const itemImageInfo = ref({
    images: [],
    cover: {},
    displayImages: [],
    otherImages: []
  });
  const detailInfo = ref({});
  const editBlock = ref(false);
  const editingImages = ref([]);
  const activeIndex = ref(0);
  const displayCustom = ref(false);
  const galleriaItemClass = ref('');
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
  const displayImageEditDialog = ref(false);
  const imageHtml = ref('');
  const expandedRows = ref([]);

  const onUpload = (ev) => {
    toast.add({severity: 'info', summary: 'Success', detail: $constant.ImageUploadSuccess, life: 3000});
  }
  const imgRowReorder = (ev) => {
    itemImageInfo.value.images = ev.value;
  };
  const imgRowEditSave = (ev) => {
    let {newData, index} = ev;
    itemImageInfo.value.images[index] = newData;
  };
  const imageClick = (index) => {
    activeIndex.value = index;
    displayCustom.value = true;
  };

  const updateImage = () => {
    editBlock.value = true;
    let json = {
      entityType: detailInfo.value.entityType,
      entityId: detailInfo.value.id,
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
      entityType: detailInfo.value.entityType,
      entityId: detailInfo.value.id,
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
    this.dialogRef.close();
    document.getElementById("imgBox").innerHTML = "";
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
  const checkImageInfo = (ev) => {
    if (typeof this.imageInfo.description == "undefined") {
      imageInfo.description = "";
    }
    if (this.imageInfo.image === null) {
      this.toast.add({severity: 'error', summary: 'Error', detail: IMAGE_EMPTY_EXCEPTION, life: 3000});
    }
    if (typeof this.imageInfo.nameZh == "undefined") {
      this.toast.add({severity: 'error', summary: 'Error', detail: IMAGE_NAME_ZH_EMPTY_EXCEPTION, life: 3000});
      return false;
    }
    if (typeof this.imageInfo.nameEn == "undefined") {
      this.toast.add({severity: 'error', summary: 'Error', detail: IMAGE_NAME_EN_EMPTY_EXCEPTION, life: 3000});
      return false;
    }
    if (typeof this.imageInfo.type == "undefined") {
      this.toast.add({severity: 'error', summary: 'Error', detail: IMAGE_TYPE_EMPTY_EXCEPTION, life: 3000});
      return false;
    }
    return true;
  },
  save2imageInfos() {
    if (this.checkImageInfo()) {
      this.imageInfos.push(this.imageInfo);
      this.showImage();
      this.imageInfo = {};
    }
  },
  clearUploadedImage() {
    this.imageInfos = [];
    document.getElementById("imgBox").innerHTML = "";
  },
  submitImages() {
    this.editBlock = true;
    const formData = new FormData();
    for (const img of this.imageInfos) {
      formData.append("images", img.image);
    }
    formData.append("entityType", this.detailInfo.entityType);
    formData.append("entityId", this.detailInfo.id);
    formData.append("imageInfos", JSON.stringify(this.imageInfos));

    HttpUtil.formPost(this.toast, this.editBlock, INSERT_IMAGES_URL, formData)
        .then(res => {
          if (res.state === 1) {
            this.closeImageEditDialog();
            location.reload(true);
          }else {
            this.editBlock = false;
          }
        }).catch(err => {
      console.error(err);
    });
  },

</script>

<style scoped>

</style>