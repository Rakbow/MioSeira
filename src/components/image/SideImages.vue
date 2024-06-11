<script setup lang="ts">
import {ref, defineAsyncComponent, onMounted, defineProps} from 'vue';
import {useDialog} from 'primevue/usedialog';

const manager = defineAsyncComponent(() => import('@/components/image/ImageManager.vue'));
const loader = defineAsyncComponent(() => import('@/components/image/ImageLoader.vue'));
import {useUserStore} from "@/store/user.ts";
import {PublicHelper} from "@/toolkit/publicHelper.ts";
import {useRoute} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const userStore = useUserStore();
const route = useRoute();
const dialog = useDialog();
const toast = useToast();
const editBlock = ref(false);
const entityInfo = ref();

const props = defineProps({
  count: {
    type: Number,
    required: false,
    default: () => (0)
  },
  images: {
    type: Array,
    required: true,
    default: () => ([])
  },
});

onMounted(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
  console.log(props.count)
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

const openLoader = () => {
  dialog.open(loader, {
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
        width: '80vw',
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

<template class="entity-panel">
  <Panel class="mt-2">
    <template #header>
      <span class="text-start side-panel-header">
        <i class="pi pi-images"/><span><strong>{{ $t('Images') }}</strong></span>
        <Button :label="props.count.toString()" severity="success" size="small" outlined class="ml-2"
                @click="openLoader" :disabled="props.count === 0"
                v-tooltip.bottom="{value: $t('ViewAll'), class: 'common-tooltip'}" />
      </span>
    </template>
    <template #icons>
      <div v-if="userStore.user">
        <Button v-if="userStore.user.type > 1" class="p-panel-header-icon p-link mr-2" text rounded
                @click="openEditDialog" v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}">
          <span class="pi pi-cog"/>
        </Button>
      </div>
    </template>

    <div class="flex" v-if="props.images.length === 0">
      <i class="mt-3 ml-4 rkw-side-empty-info">{{ $t('NoImage') }}</i>
    </div>
    <ScrollPanel v-else style="max-height: 300px;max-width: 265px">
      <div v-if="props.images" class="grid justify-content-evenly justify-content-start" style="width: 260px">
        <div class="col-4 mt-2 mb-2" id="panel-image-div"
             v-for="(image, index) of props.images" :key="index">
          <img class="sidebar-panel-image-middle" :src="image.thumbUrl70"
               draggable="false"
               oncontextmenu="return false"
               v-tooltip.bottom="{value: $t('UploadIn') + image.addedTime, class: 'image-tooltip'}"
               @click="imageClick(index)" alt="" />
        </div>
      </div>
      <ScrollTop target="parent" :threshold="100" class="search-scrolltop"
                 icon="pi pi-arrow-up" />
    </ScrollPanel>
  </Panel>
  <Galleria :value="props.images"
            v-model:activeIndex="activeIndex" :responsiveOptions="responsiveOptions"
            :numVisible="7" containerStyle="max-width: 800px"
            :circular="true" :fullScreen="true" :showItemNavigators="true"
            :showThumbnails="false" v-model:visible="displayCustom">
    <template #item="{item}">
      <img class="responsive-image" :src="item!.url" :alt="item!.name"
           oncontextmenu="return false"/>
    </template>
    <template #caption="{item}">
      <div class="custom-galleria-footer">
        <div class="col-6">
              <span v-if="props.images" class="title-container">
                <span>{{ `${activeIndex + 1}/${props.images.length}` }}</span>
                <span class="title">{{ item!.nameZh }}</span>
                <span style="font-size: 10px">{{ item!.description }}</span>
            </span>
        </div>
        <div class="col-6 text-end">
            <span v-if="props.images">
                <span>{{ $t('UploadIn') + item!.addedTime }}</span>
            </span>
        </div>
      </div>
    </template>
  </Galleria>
</template>

<style lang="scss" scoped>

@import '@/assets/bootstrap/myBootstrap.min.css';
@import '@/assets/entity-detail';

.responsive-image {
  max-width: 70vw; /* 60% of viewport width */
  max-height: 70vh; /* 60% of viewport height */
  width: auto; /* Maintain aspect ratio */
  height: auto; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the image fits within the container */
}

.custom-galleria-footer {
  display: flex;
  align-items: center;
  /*background-color: rgba(0, 0, 0, 0.9);*/
  color: #ffffff;
}

.custom-galleria-footer > button {
  background-color: transparent;
  color: #ffffff;
  border: 0 none;
  border-radius: 0;
  margin: .2rem 0;
}

.custom-galleria-footer > button.fullscreen-button {
  margin-left: auto;
}

.custom-galleria-footer > button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.title-container > span {
  font-size: .9rem;
  padding-left: .829rem;
}

.title-container > span.title {
  font-weight: bold;
}

.p-galleria-content {
  position: relative;
}

.p-galleria-thumbnail-content {
  height: 100px;
  width: 100px;
}
</style>