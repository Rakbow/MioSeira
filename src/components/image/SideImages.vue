<script setup lang="ts">
import {ref, defineAsyncComponent, onMounted, onBeforeMount} from 'vue';
import {useDialog} from 'primevue/usedialog';

const manager = defineAsyncComponent(() => import('@/components/image/ImageManager.vue'));
const browser = defineAsyncComponent(() => import('@/components/image/ImageBrowser.vue'));
const ImageGalleria = defineAsyncComponent(() => import('@/components/image/ImageGalleria.vue'));
import {useUserStore} from "@/store/user";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useI18n} from "vue-i18n";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {EntityInfo} from "@/config/Web_Const";

const {t} = useI18n();
const userStore = useUserStore();
const route = useRoute();
const dialog = useDialog();
const toast = useToast();
const editBlock = ref(false);
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
const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 5
  },
  {
    breakpoint: '768px',
    numVisible: 3
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
];

const getDisplayImages = async () => {
  loading.value = true;
  let param = {
  entityType: entityInfo.value?.type,
  entityId: entityInfo.value?.id
  }
  const res = await axios.post(API.IMAGES_DEFAULT_DISPLAYED, param);
  if (res.state === axios.SUCCESS) {
    images.value = res.data.images;
    count.value = res.data.count;
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
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
        width: '750px',
      },
      breakpoints: {
        '960px': '80vw',
        '640px': '70vw'
      },
      modal: true
    }
  });
}

</script>

<template>
  <div class="mt-2 entity-detail-side-panel">
    <Panel>
      <template #header>
      <span class="text-start side-panel-header">
        <i class="pi pi-images"/><span><strong>{{ t('Images') }}</strong></span>
      </span>
      </template>
      <template #icons>
        <div v-if="userStore.user">
          <Button v-if="userStore.user.type > 1" class="p-panel-header-icon p-link ml-2" text rounded
                  @click="openEditDialog" v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}">
            <span class="pi pi-cog"/>
          </Button>
          <Button :label="count.toString()" severity="success" size="small" outlined class="mr-2"
                  @click="openLoader" :disabled="!count"
                  v-tooltip.bottom="{value: t('ViewAll'), class: 'common-tooltip', disabled: !count}" />
        </div>
      </template>

      <div v-if="!images.length">
        <span class="empty-search-result">{{ t('NoImage') }}</span>
      </div>
      <ScrollPanel v-else style="max-height: 300px;max-width: 265px">
        <div v-if="images" class="grid justify-content-evenly justify-content-start" style="width: 260px">
          <div class="col-4 mt-2 mb-2" id="panel-image-div"
               v-for="(image, index) of images" :key="index">
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
  </div>
  <ImageGalleria :images="images" v-model:activeIndex="activeIndex" v-model:visible="displayCustom" />
</template>

<style lang="scss" scoped>
@use '@/assets/bootstrap/myBootstrap.min.css';
@use '@/assets/entity-detail';
</style>