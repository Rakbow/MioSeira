<script setup lang="ts">
import {defineProps} from "vue";

const props = defineProps({
  severity: {
    type: String,
    default: 'success'
  },
  size: {
    type: String,
    required: true,
    default: ''
  }
});

</script>

<template>

</template>

<style scoped lang="scss">

</style>