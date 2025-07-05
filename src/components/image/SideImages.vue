<script setup lang="ts">
import {ref, defineAsyncComponent, onMounted, onBeforeMount} from 'vue';
import {useDialog} from 'primevue/usedialog';

const manager = defineAsyncComponent(() => import('@/components/image/ImageManager.vue'));
const browser = defineAsyncComponent(() => import('@/components/image/ImageBrowser.vue'));
const ImageGalleria = defineAsyncComponent(() => import('@/components/image/ImageGalleria.vue'));
import {useUserStore} from "@/store/modules/user";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {EntityInfo} from "@/config/Web_Const";
import {PToast} from "@/logic/frame";

const {t} = useI18n();
const userStore = useUserStore();
const route = useRoute();
const dialog = useDialog();
const toast = useToast();
const loading = ref(false);
const entityInfo = ref<EntityInfo>();
const images = ref([]);
const count = ref(0);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});

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
  loading.value = true;
  let param = {
  entityType: entityInfo.value?.type,
  entityId: entityInfo.value?.id
  }
  const res = await Axios.post(API.IMAGES_DEFAULT_DISPLAYED, param);
  if (res.success()) {
    images.value = res.data.images;
    count.value = res.data.count;
  } else {
    toast.add(new PToast().error(res.message));
  }
  loading.value = false;
}

const openLoader = () => {
  dialog.open(browser, {
    props: {
      header: t('Images'),
      style: {
        width: '40vw',
      },
      modal: true
    }
  });
}

const openEditDialog = () => {
  dialog.open(manager, {
    props: {
      header: `${t('Images')}${t('Edit')}`,
      style: {
        width: '75rem',
      },
      modal: true,
      closable: true
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
      <Button v-if="userStore.user && userStore.user.type > 1" text
              @click="openEditDialog" v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}">
        <MaterialIcon name="edit_square" />
      </Button>
      <Button severity="success" outlined @click="openLoader" :disabled="!count"
              v-tooltip.bottom="{value: t('ViewAll'), class: 'common-tooltip', disabled: !count}" >
        <template #icon>
          <span>{{count.toString()}}</span>
        </template>
      </Button>
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