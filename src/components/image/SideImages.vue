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
  <Panel class="entity-detail-side-panel side-image">
    <template #header>
      <span><i class="pi pi-image"/><strong>{{ t('Images') }}</strong></span>
    </template>
    <template #icons>
      <Button v-if="userStore.user && userStore.user.type > 1" text @click="openEditDialog"
              v-tooltip="{value: t('Edit')}">
        <MaterialIcon name="edit_square" />
      </Button>
      <Button :label="count.toString()" outlined @click="openLoader" :disabled="!count"
              v-tooltip="{value: t('ViewAll'), disabled: !count}"/>
    </template>

    <div v-if="!images.length">
      <span class="empty-search-result">{{ t('NoImage') }}</span>
    </div>
    <ScrollPanel v-else style="max-height: 300px;max-width: 265px">
      <div v-if="images" class="grid justify-content-evenly justify-content-start" style="width: 260px">
        <div class="col-4 mt-2 mb-2" id="panel-image-div"
             v-for="(image, index) of images as any" :key="index">
          <img class="sidebar-panel-image-middle" :src="image.thumb"
               draggable="false"
               oncontextmenu="return false"
               v-tooltip.bottom="{value: t('UploadIn') + image.addedTime, class: 'image-tooltip'}"
               @click="imageClick(index)" alt="" />
        </div>
      </div>
      <ScrollTop target="parent" :threshold="100" class="search-scrolltop"
                 icon="pi pi-arrow-up" />
    </ScrollPanel>
  </Panel>
  <ImageGalleria :images="images" v-model:activeIndex="activeIndex" v-model:visible="displayCustom" />
</template>

<style lang="scss" scoped>
</style>