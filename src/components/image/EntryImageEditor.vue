<script setup lang="ts">
import {defineAsyncComponent, defineProps, inject, onMounted, ref} from "vue";
import {API} from "@/config/Web_Helper_Strs";
import {useDialog} from "primevue/usedialog";
import {useI18n} from "vue-i18n";
import {META} from "@/config/Web_Const";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useToast} from "primevue/usetoast";
import {useRoute} from "vue-router";

const cropper = defineAsyncComponent(() => import('@/components/image/ImageCropper.vue'));

const route = useRoute();
const {t} = useI18n();
const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const cover = ref();
const thumb = ref();
const uploadDialogDisplay = ref(false);
const loading = ref(false);
const image = ref();

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  cover: {
    type: String,
    required: true
  },
  thumb: {
    type: String,
    required: true
  }
});

onMounted(() => {
  cover.value = props.cover;
  thumb.value = props.thumb;
});

const openUploadDialog = (type) => {
  image.value = {
    type: type
  }
  uploadDialogDisplay.value = true;
}

const select = async (ev) => {
  if (!ev.files) return;
  for (let file of ev.files) {
    image.value.file = file;
  }
};

const clear = () => {
  delete image.value.file;
  delete image.value.base64Code;
};

const upload = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('id', props.id);
  formData.append('file', image.value.file);
  formData.append('imageType', image.value.type);
  const res = await axios.form(API.ENTRY_UPLOAD_IMAGE, formData);
  if (res.state === axios.SUCCESS) {
    toast.add(new PToast().success(res.message));
    if (image.value.type === META.IMAGE_TYPE.MAIN) cover.value = res.data;
    else if (image.value.type === META.IMAGE_TYPE.THUMB) thumb.value = res.data;
    uploadDialogDisplay.value = false;
  } else {
    toast.add(new PToast().error(res.message));
  }
  loading.value = false;
};

const openCropper = () => {
  dialog.open(cropper, {
    props: {
      header: t('Edit'),
      style: {
        width: '400px',
      },
      modal: true,
      closable: true
    },
    data: {
    },
    onClose: async (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {

        }
      }
    }
  });
}

</script>

<template>
  <div class="flex flex-wrap justify-content-center gap-3">
    <div class="flex align-items-center justify-content-center image-container">
      <Button class="absolute bottom-0 right-0" size="small"
              @click="openUploadDialog(META.IMAGE_TYPE.MAIN)" icon="pi pi-cloud-upload" severity="info"
              v-tooltip.bottom="{value: t('Upload'), class: 'short-tooltip'}"/>
      <img v-if="cover" :src="`${API.STATIC_DOMAIN}${cover}`" alt="cover"/>
      <img v-else :src="API.COMMON_EMPTY_COVER_IMAGE" alt="cover"/>
    </div>
    <div class="flex align-items-center justify-content-center image-container">
      <Button class="absolute bottom-0 right-0" size="small"
              @click="openUploadDialog(META.IMAGE_TYPE.THUMB)" icon="pi pi-cloud-upload" severity="info"
              v-tooltip.bottom="{value: t('Upload'), class: 'short-tooltip'}"/>
      <img v-if="thumb" :src="`${API.STATIC_DOMAIN}${thumb}`" alt="thumb"/>
      <img v-else :src="API.COMMON_EMPTY_THUMB_IMAGE" alt="cover"/>
    </div>
  </div>

  <Dialog :modal="true" v-model:visible="uploadDialogDisplay" :style="{width: '400px'}" :header="t('UploadImage')"
          class="p-fluid">
    <BlockUI :blocked="loading">
      <FileUpload accept="image/*" auto :customUpload="true"
                  :showUploadButton="false"
                  :showCancelButton="false"
                  chooseIcon="pi pi-image" @select="select"
                  :maxFileSize="2000000" :previewWidth="100"
                  :invalidFileSizeMessage="t('InvalidFileSizeMessage')">
        <template #header="{ chooseCallback }">
          <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined/>
          <Button @click="clear" icon="pi pi-times" rounded outlined severity="danger" :disabled="!image.file"/>
          <Button @click="upload" icon="pi pi-cloud-upload" rounded outlined severity="info" :disabled="!image.file"/>
        </template>
        <template #empty>
          <span class="empty-search-result">{{ t('DragFile') }}</span>
        </template>
        <template #content>
          <div class="flex flex-wrap justify-content-center gap-3">
            <div class="flex align-items-center justify-content-center image-container">
              <img v-if="image.file" :src="image.file.objectURL" alt="image"/>
            </div>
          </div>
        </template>
      </FileUpload>
    </BlockUI>
  </Dialog>

<!--  <Button @click="openCropper" icon="pi pi-image"/>-->
</template>

<style scoped lang="scss">
.image-container {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 如果需要裁剪，可以加上 */
  position: relative;

  border: gold solid 2px;
  border-radius: 10px;
  img {
    max-width: 100%; /* 宽度不超过容器 */
    max-height: 100%; /* 高度不超过容器 */
    object-fit: contain; /* 保持比例缩放，显示完整图片 */
  }
}
</style>