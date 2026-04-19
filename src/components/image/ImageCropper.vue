<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {Cropper, RectangleStencil} from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import {useI18n} from "vue-i18n";
import {bs} from '@/service/baseService';

const {t} = useI18n();

const props = defineProps<{
  file: File | null;
}>();

const emit = defineEmits<{
  (e: 'crop', file: File): void;
  (e: 'cancel'): void;
}>();

const cropperRef = ref();
const imageUrl = ref<string>('');
const loading = ref(false);

// 验证图片分辨率
const validateImageResolution = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        bs!.toast.error(t('ImageCropper.ImageResolutionTooLow', {
          minWidth: 100,
          minHeight: 100,
          width: img.width,
          height: img.height
        }));
        URL.revokeObjectURL(imageUrl.value);
        imageUrl.value = '';
        reject(new Error('Image resolution too low'));
      } else {
        resolve();
      }
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};

// 监听文件变化，加载图片并验证分辨率
watch(() => props.file, async (newFile) => {
  if (!newFile) return;

  try {
    // 验证是否为图片文件
    if (!newFile.type.startsWith('image/')) {
      bs!.toast.error(t('ImageCropper.InvalidImageFile'));
      return;
    }

    // 创建临时URL
    imageUrl.value = URL.createObjectURL(newFile);

    // 验证图片分辨率
    await validateImageResolution(newFile);
  } catch (error) {
    console.error('Load image error:', error);
    bs!.toast.error(t('ImageCropper.LoadImageFailed'));
  }
}, {immediate: true});

// 获取裁剪后的Canvas
const getCroppedCanvas = (): HTMLCanvasElement | null => {
  if (!cropperRef.value) return null;

  const {canvas} = cropperRef.value.getResult();
  return canvas;
};

// 将Canvas转换为File
const canvasToFile = (canvas: HTMLCanvasElement, fileName: string): Promise<File> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Canvas to Blob failed');
      }
      const file = new File([blob], fileName, {type: 'image/png'});
      resolve(file);
    }, 'image/png');
  });
};

// 执行裁剪
const onCrop = async () => {
  if (!cropperRef.value) {
    bs!.toast.error(t('ImageCropper.PleaseSelectCropArea'));
    return;
  }

  loading.value = true;

  try {
    const canvas = getCroppedCanvas();
    if (!canvas) {
      throw new Error('Failed to get cropped canvas');
    }

    // 创建一个新的200x200的canvas
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 200;
    finalCanvas.height = 200;
    const ctx = finalCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // 将裁剪结果绘制到200x200的canvas上
    ctx.drawImage(canvas, 0, 0, 200, 200);

    // 转换为File
    const originalName = props.file?.name.replace(/\.[^/.]+$/, '') || 'cropped-image';
    const croppedFile = await canvasToFile(finalCanvas, `${originalName}-cropped.png`);

    emit('crop', croppedFile);

    bs!.toast.success(t('ImageCropper.ImageCroppedSuccessfully'));
  } catch (error) {
    console.error('Crop error:', error);
    bs!.toast.error(t('ImageCropper.CropFailed'));
  } finally {
    loading.value = false;
  }
};

// 取消裁剪
const onCancel = () => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
  emit('cancel');
};

// 组件卸载时清理
const cleanup = () => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
};

// 裁剪区域配置 - 强制1:1比例
const stencilProps = computed(() => ({
  aspectRatio: 1,
  minWidth: 100,
  minHeight: 100,
  handlers: {
    show: true,
  },
  movable: true,
  resizable: true,
}));

// 使用RectangleStencil作为矩形裁剪框
const StencilComponent = RectangleStencil;
</script>

<template>
  <div class="image-cropper-container">
    <div v-if="!imageUrl" class="empty-state">
      <i class="pi pi-image" style="font-size: 3rem; color: #ccc;"></i>
      <p>{{ t('ImageCropper.NoImageSelected') }}</p>
    </div>

    <div v-else class="cropper-wrapper">
      <Cropper
          ref="cropperRef"
          :src="imageUrl"
          :stencil-props="stencilProps"
          :stencil-component="StencilComponent"
          class="cropper"
      />

      <div class="cropper-actions">
        <RButton icon="check" @click="onCrop" severity="success"/>
        <RButton icon="close" @click="onCancel" severity="info"/>
      </div>

      <div class="cropper-info">
        <small class="info-text">
          {{ t('ImageCropper.CropInfo') }}
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-cropper-container {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #999;

  p {
    margin-top: 1rem;
    font-size: 1rem;
  }
}

.cropper-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cropper {
  width: 100%;
  height: 50rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  overflow: hidden;
}

.cropper-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
}

.cropper-info {
  text-align: center;

  .info-text {
    color: #666;
    font-size: 0.875rem;
  }
}

// vue-advanced-cropper 样式覆盖
:deep(.vue-advanced-cropper) {
  background: #1a1a1a;
}

:deep(.vue-advanced-cropper__image) {
  max-width: none;
}

:deep(.vue-advanced-cropper-stencil) {
  border: .2rem solid #fff;
}
</style>
