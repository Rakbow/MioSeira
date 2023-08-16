<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  images: {
    type: Object,
    default: () => ({
      displayImages: []
    })
  }
});

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
</script>

<template>
  <Panel class="mt-2">
    <template #header>
      <span class="text-start side-panel-header">
          <i class="pi pi-images"></i><span><strong>{{ $constant.Image }}</strong></span>
      </span>
    </template>
    <i v-if="images.displayImages.length === 0" class="rkw-side-empty-info">{{ $constant.NoImage }}</i>

    <div class="card flex justify-content-center">
      <Galleria v-if="images.displayImages" :value="images.displayImages"
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
            <div class="col-6">-
              <span v-if="images.displayImages" class="title-container">
                <span>共{{images.displayImages.length}}张</span>
                <span class="title">{{item.nameZh}}</span>
                <span style="font-size: 10px">{{item.description}}</span>
            </span>
            </div>
            <div class="col-6 text-end">
            <span v-if="images.displayImages">
                <span>上传于 {{item.uploadTime}}</span>
            </span>
            </div>
          </div>
        </template>
      </Galleria>
    </div>

    <ScrollPanel style="max-height: 300px;max-width: 265px">
      <div v-if="images.displayImages" class="grid justify-content-evenly justify-content-start" style="width: 260px">
        <div class="col-4 mt-2 mb-2" id="panel-image-div"
             v-for="(image, index) of images.displayImages" :key="index">
          <img class="sidebar-panel-image-middle" :src="image.thumbUrl"
               draggable="false"
               oncontextmenu="return false"
               v-tooltip.bottom="{value: '上传于 ' + image.uploadTime, class: 'image-tooltip'}"
               @click="imageClick(index)" alt=""/>
        </div>
      </div>
      <ScrollTop target="parent" :threshold="100" class="search-scrolltop"
                   icon="pi pi-arrow-up"></ScrollTop>
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