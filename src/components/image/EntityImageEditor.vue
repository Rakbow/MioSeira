<script setup lang="ts">
import {defineProps, getCurrentInstance, onMounted, ref} from "vue";
import {API, Axios} from "@/api";
import {useI18n} from "vue-i18n";
import ImageCropper from "@/components/image/ImageCropper.vue";

const {t} = useI18n();
const {proxy} = getCurrentInstance()!;
const cover = ref();
const uploadDialogDisplay = ref(false);
const loading = ref(false);
const showCropper = ref(false);
const imageFile = ref<File | null>(null);
const croppedImage = ref<File | null>(null);
const croppedImageUrl = ref<string>('');

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  cover: {
    type: String,
    required: true
  }
});

onMounted(async () => {
  cover.value = props.cover;
});

//region image upload

const clear = () => {
  croppedImage.value = null;
  croppedImageUrl.value = '';
};

const upload = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('id', props.id?.toString());
  formData.append('file', croppedImage.value!);
  const res = await Axios.form(API.INDEX.UPLOAD_IMAGE, formData);
  if (res.success()) {
    cover.value = `${proxy!.$api.STATIC_DOMAIN}${res.data}`;
    uploadDialogDisplay.value = false;
  }
  loading.value = false;
};

//endregion

//region image crop
const onFileSelect = (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  imageFile.value = file;
  showCropper.value = true;
};

const onCropComplete = (file: File) => {
  croppedImage.value = file;
  croppedImageUrl.value = URL.createObjectURL(file);
  showCropper.value = false;
};

const onCropCancel = () => {
  showCropper.value = false;
  imageFile.value = null;
};
//endregion

const getImageInfo = async (url: string): Promise<{
  width: number;
  height: number;
  size: string; // bytes
  type: string;
}> => {
  // 1. 请求图片
  const res = await fetch(url);
  const blob = await res.blob();

  // 2. 获取尺寸
  const img = new Image();
  const objectUrl = URL.createObjectURL(blob);

  const sizeInfo = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = reject;
    img.src = objectUrl;
  });

  // 3. 返回结果
  return {
    ...sizeInfo,
    size: `${(blob.size / 1024).toFixed(2)} KB`,   // 文件大小（字节）
    type: blob.type,   // MIME 类型
  };
}

</script>

<template>

  <div class="image-container">
    <div>
      <img :src="cover" alt="Cropped Image"/>
      <RButton
          class="upload-button"
          @click="uploadDialogDisplay = true"
          icon="upload_file"
          severity="info"
          v-tooltip.bottom="{value: t('Upload')}"
      />
    </div>
  </div>

  <Dialog :modal="true" v-model:visible="uploadDialogDisplay" :style="{width: '40rem'}"
          :header="t('UploadImage')" class="p-fluid">
    <BlockUI :blocked="loading">
      <div style="margin: 2rem 0;">
        <input
            type="file"
            accept="image/*"
            @change="onFileSelect"
            style="padding: 1rem; border: 2px dashed #ccc; border-radius: 0.5rem;"
        />
        <p style="margin-top: 0.5rem; color: #666; font-size: 0.875rem;">
          请选择一张最小分辨率为100x100的图片
        </p>
      </div>
      <RButton action="save" @click="upload" :disabled="!croppedImage" class="p-button-text"/>
      <RButton action="delete" @click="clear" :disabled="!croppedImage" class="p-button-text"/>
      <div v-if="croppedImageUrl" style="margin-top: 2rem;">
        <img :src="croppedImageUrl" alt="Cropped Image"/>
        <p style="margin-top: 0.5rem; color: #666;">
          尺寸: 200x200 | 大小: {{ croppedImage ? (croppedImage.size / 1024).toFixed(2) : 0 }} KB
        </p>
      </div>
    </BlockUI>
  </Dialog>
  <Dialog
      v-model:visible="showCropper"
      modal
      header="裁剪图片"
      :style="{ width: '60rem', maxWidth: '60rem' }"
      :closable="false"
  >
    <ImageCropper
        style="padding: 0"
        :file="imageFile"
        @crop="onCropComplete"
        @cancel="onCropCancel"
    />
  </Dialog>
</template>

<style scoped lang="scss">
.image-container {

  width: 16rem;

  > div {
    text-align: center !important;
    position: relative;
    display: inline-block;
  }

  p {
    margin: 0;
    color: #666;
  }

  img {
    width: 13rem;
    border: .2rem solid #ddd;
    border-radius: 0.5rem;
  }

  .upload-button {
    position: absolute;
    bottom: 0.2rem;
    right: 2.4rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    .upload-button {
      opacity: 1;
    }
  }
}
</style>