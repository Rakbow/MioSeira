<script setup lang="ts">
import ManagerMenu from "@/views/manager/ManagerMenu.vue";
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