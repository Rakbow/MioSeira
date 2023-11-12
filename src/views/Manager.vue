<script setup>
import ManagerMenu from "@/components/ManagerMenu.vue";
import {getCurrentInstance} from "vue";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
</script>

<template>
  <Toast />
  <div class="grid">
    <div class="col-2">
      <ManagerMenu />
    </div>
    <div class="col-10">
      <router-view />
    </div>
  </div>
</template>

<style scoped>

</style>