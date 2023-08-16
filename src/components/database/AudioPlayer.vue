<script setup>
import { reactive,nextTick, onBeforeUnmount,getCurrentInstance, onMounted, defineProps, ref } from 'vue'
import ColorThief from 'colorthief';
import APlayer from 'aplayer';
const { proxy } = getCurrentInstance()

const props = defineProps({
  audios: {
    type: Array,
    required: true,
    validator: (value) => {
      // 验证每个数组元素是否是合法的JSON对象
      return value.every(item => {
        return typeof value === 'object' && value !== null && value !== undefined;
      });
    },
  }
});
onMounted(() => {
  createAplayer();
})
const playerOption = ref({
  fixed: false,
});
const aplayer = ref({});
const createAplayer = () => {

  const ap = new APlayer({
    container: aplayer.value,
    theme: '#e9e9e9',
    volume: 0.5,
    lrcType: 3,
    fixed: playerOption.value.fixed,
    audio: props.audios
  });
  // const colorThief = new ColorThief();
  // const image = new Image();
  // const xhr = new XMLHttpRequest();
  // const setTheme = (index) => {
  //   if (!ap.list.audios[index].theme) {
  //     xhr.onload = function () {
  //       let coverUrl = URL.createObjectURL(this.response);
  //       image.onload = function () {
  //         let color = colorThief.getColor(image);
  //         ap.theme(`rgb(${color[0]}, ${color[1]}, ${color[2]})`, index);
  //         URL.revokeObjectURL(coverUrl)
  //       };
  //       image.src = coverUrl;
  //     }
  //     xhr.open('GET', ap.list.audios[index].cover, true);
  //     xhr.responseType = 'blob';
  //     xhr.send();
  //   }
  // };
  // setTheme(ap.list.index);
  // ap.on('listswitch', (index) => {
  //   setTheme(index);
  // });
}
</script>

<template>
  <Fieldset :toggleable="true" v-if="audios">
    <template #legend>
      <i class="pi iconfont icon-music"></i>
      <b>{{ $constant.ItemDetailPlayListTitle }}</b>
    </template>
    <Button @click="playerOption.fixed=true, createAplayer()" class="mr-2"
            v-tooltip.bottom="$constant.TooltipMusicPlayerChangeBottom">
      <i class="pi pi-arrow-circle-down"></i>
    </Button>
    <div ref="aplayer"></div>
  </Fieldset>
</template>

<style scoped>
@import 'APlayer/dist/APlayer.min.css';


.aplayer .aplayer-list ol li {
  color: black;
}

.aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: black;
}

</style>