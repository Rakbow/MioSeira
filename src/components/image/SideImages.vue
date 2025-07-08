<script setup lang="ts">
import {defineAsyncComponent, inject, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/modules/user";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const manager = defineAsyncComponent(() => import('@/components/image/ImageManager.vue'));
const browser = defineAsyncComponent(() => import('@/components/image/ImageBrowser.vue'));
const ImageGalleria = defineAsyncComponent(() => import('@/components/image/ImageGalleria.vue'));

const {t} = useI18n();
const userStore = useUserStore();
const entity = inject<Entity>('entity')!;
const images = ref([]);
const count = ref(0);
const param = ref(new EditParam());

onMounted(() => {
  getDisplayImages();
});

const activeIndex = ref(0)
const displayCustom = ref(false)
const imageClick = (index: number) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
const getDisplayImages = async () => {
  param.value.block = true;
  param.value.data = {
  entityType: entity!.type,
  entityId: entity!.id
  }
  const res = await Axios.post(API.IMAGES_DEFAULT_DISPLAYED, param.value.data);
  if (res.success()) {
    images.value = res.data.images;
    count.value = res.data.count;
  } else {
    bs!.toast.error(res.message);
  }
  param.value.block = false;
}

const openLoader = () => {
  bs!.dialog.open(browser, {
    props: {
      header: t('Images'),
      style: {
        width: '40vw',
      },
      modal: true
    },
    data: {
      type: entity!.type,
      id: entity!.id,
    }
  });
}

const openEditDialog = () => {
  bs!.dialog.open(manager, {
    props: {
      header: `${t('Images')}${t('Edit')}`,
      style: {
        width: '75rem',
      },
      modal: true,
      closable: true
    },
    data: {
      type: entity!.type,
      id: entity!.id,
    }
  });
}

</script>

<template>
  <Panel>
    <template #header>
      <span><i class="pi pi-image"/><strong>{{ t('Images') }}</strong></span>
    </template>
    <template #icons>
      <RButton v-if="userStore.user && userStore.user.type > 1"
               @click="openEditDialog" icon="edit_square" variant="text" tooltip="Edit" />
      <Button :label="count.toString()" outlined @click="openLoader" :disabled="!count"
              v-tooltip="{value: t('ViewAll'), disabled: !count}"/>
    </template>

    <div v-if="!images.length">
      <span class="empty-search-result">{{ t('NoImage') }}</span>
    </div>
    <div v-else class="image-showcase">
      <div class="side-image" v-for="(image, index) of images as any" :key="index">
        <img :src="image.thumb" draggable="false" oncontextmenu="return false"
             v-tooltip.bottom="{value: `${t('UploadIn')} ${image.addedTime}`, class: 'image-tooltip'}"
             @click="imageClick(index)" alt="image" />
      </div>
    </div>
  </Panel>
  <ImageGalleria :images="images" v-model:activeIndex="activeIndex" v-model:visible="displayCustom" />
</template>

<style lang="scss" scoped>

.image-tooltip .p-tooltip-text {
  font-size: 1rem;
  width: 12rem;
}

.image-showcase {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: center !important;
}

.side-image {
  margin: .5rem;
  display: flex;
  position: relative;
  width: 7.2rem;
  height: 7.2rem;
  background-position: center center;
  background-color: var(--r-bg-blue-950);
  border: solid .1rem #40557E;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    transform: translate(-50%, -50%);
    cursor: url("https://static.rakbow.com/common/zoomin.cur"), pointer;
  }

}
</style>