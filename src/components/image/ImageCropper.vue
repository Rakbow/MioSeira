<script setup lang="ts">
import {ref} from "vue";
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const img = 'https://static.rakbow.com/upload/99/148/99_148_f45fc26c.jpg'
const option = ref();
</script>

<template>
  <cropper
      class="cropper"
      :src="img"
      :stencil-props="{
		aspectRatio: 10/12
	}"
      @change=""
  />
</template>

<style scoped lang="scss">

</style>