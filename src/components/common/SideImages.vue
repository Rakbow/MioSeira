<script setup>
import {ref, defineAsyncComponent, getCurrentInstance, onMounted} from 'vue';
import {useDialog} from 'primevue/usedialog';

const imageManager = defineAsyncComponent(() => import('@/components/common/ImageManager.vue'));
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
import {useUserStore} from "@/store/user";
import {AxiosHelper as axios} from "@/utils/axiosHelper.js";
import {API} from "@/config/Web_Helper_Strs.js";
import {PublicHelper} from "@/utils/publicHelper.js";
import {useRoute} from "vue-router";
import {useToast} from "primevue/usetoast";
import {META} from "@/config/Web_Const.js";

const userStore = useUserStore();
const route = useRoute();
const dialog = useDialog();
const toast = useToast();
const editBlock = ref(false);
const entityType = ref(0);
const entityId = ref(0);
const imageInfo = ref({
  images: [],
  displayImages: [],
  otherImages: []
});

onMounted(() => {
  getEntityInfo();
  getImages();
});

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}

const activeIndex = ref(0)
const displayCustom = ref(false)
const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
const initGalleriaImageClass = (url) => {
  const image = new Image();
  image.src = url;
  return (image.naturalWidth > image.naturalHeight) ? "galleria-div-width" : "galleria-div-height";
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

const getImages = async () => {
  editBlock.value = true;
  let param = {
    entityType: entityType.value,
    entityId: entityId.value
  }
  const res = await axios.post(API.GET_IMAGES, param);
  if (res.state === axios.SUCCESS) {
    imageInfo.value.images = res.data.data;
    imageInfo.value.otherImages = res.data.data.filter(i => i.type === META.IMAGE_TYPE.OTHER);
    imageInfo.value.displayImages = res.data.data.filter(i => i.type !== META.IMAGE_TYPE.OTHER);
  }
  editBlock.value = false;
}

const openEditDialog = () => {
  dialog.open(imageManager, {
    props: {
      header: $const.Images,
      style: {
        width: '80vw',
      },
      breakpoints: {
        '960px': '80vw',
        '640px': '70vw'
      },
      modal: true,
      closable: false
    },
    data: {
      itemImageInfo: imageInfo
    }
    // onClose: (options) => {
    //   if(options.data !== undefined) {
    //     if(options.data.isUpdate) {
    //       text.value = options.data.text;
    //       text2Markdown();
    //     }
    //   }
    // }
  });
}

</script>

<template>
  <Panel class="mt-2">
    <template #header>
      <span class="text-start side-panel-header">
          <i class="pi pi-images"/><span><strong>{{ $const.Images }}</strong></span>
      </span>
    </template>
    <template #icons>
      <div v-if="userStore.user">
        <Button v-if="userStore.user.type > 1" class="p-panel-header-icon p-link mr-2" text rounded
                @click="openEditDialog" v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}">
          <span class="pi pi-cog"/>
        </Button>
      </div>
    </template>

    <i v-if="imageInfo.displayImages.length === 0" class="rkw-side-empty-info">{{ $const.NoImage }}</i>
    <div class="card flex justify-content-center">
      <Galleria :value="imageInfo.displayImages"
                v-model:activeIndex="activeIndex" :responsiveOptions="responsiveOptions"
                :numVisible="7" containerStyle="max-width: 800px"
                :circular="true" :fullScreen="true" :showItemNavigators="true"
                :showThumbnails="false" v-model:visible="displayCustom">
        <template #item="{item}">
          <img :class="initGalleriaImageClass(item.url)" :src="item.url" :alt="item.name"
               oncontextmenu="return false"/>
        </template>
        <template #caption="{item}">
          <div class="custom-galleria-footer">
            <div class="col-6">
              <span v-if="imageInfo.displayImages" class="title-container">
                <span>{{ `${activeIndex + 1}/${imageInfo.displayImages.length}` }}</span>
                <span class="title">{{ item.nameZh }}</span>
                <span style="font-size: 10px">{{ item.description }}</span>
            </span>
            </div>
            <div class="col-6 text-end">
            <span v-if="imageInfo.displayImages">
                <span>{{ $const.UploadIn + item.addedTime }}</span>
            </span>
            </div>
          </div>
        </template>
      </Galleria>
    </div>

    <ScrollPanel style="min-height: 100px;max-height: 300px;max-width: 265px">
      <div class="grid justify-content-evenly justify-content-start" style="width: 260px">
        <div class="col-4 mt-2 mb-2" id="panel-image-div"
             v-for="(image, index) of imageInfo.displayImages" :key="index">
          <img class="sidebar-panel-image-middle" :src="image.thumbUrl70"
               draggable="false"
               oncontextmenu="return false"
               v-tooltip.bottom="{value: $const.UploadIn + image.addedTime, class: 'image-tooltip'}"
               @click="imageClick(index)" alt=""/>
        </div>
      </div>
      <ScrollTop target="parent" :threshold="100" class="search-scrolltop"
                 icon="pi pi-arrow-up"/>
    </ScrollPanel>
    <br>
    <b class="rbot"><b></b></b>
  </Panel>
</template>

<style scoped>

@import '@/assets/bootstrap/myBootstrap.min.css';

.galleria-div-width {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  min-width: 100%;
  max-width: 100%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.galleria-div-height {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  min-height: 100%;
  max-height: 100%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* galleria */
.p-galleria .p-galleria-item-wrapper {
  width: 600px;
  height: 600px;
}

.galleria-panel .p-galleria-item-container {
  width: 1000px;
  height: 1000px;
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

.p-galleria-item-wrapper {
  height: 500px;
  width: 500px;
}

.p-galleria-thumbnail-content {
  height: 100px;
  width: 100px;
}
</style>