<script setup>
import {getCurrentInstance, ref} from "vue";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;
import {useRouter} from "vue-router";

const router = useRouter();

const info = ref([
  {label: $const.Franchise, color: '#34d399', value: router.currentRoute.value.meta.items[0].ratio, icon: 'pi pi-tags'},
  {label: $const.Product, color: '#fbbf24', value: router.currentRoute.value.meta.items[1].ratio, icon: 'pi pi-th-large'},
  // {label: $const.Person, color: '#60a5fa', value: router.currentRoute.value.meta.items[2].value, icon: 'pi pi-user'},
  {label: $const.Role, color: '#c084fc', value: router.currentRoute.value.meta.items[2].ratio, icon: 'pi pi-tag'},
  {label: $const.Album, color: '#fa6072', value: router.currentRoute.value.meta.items[3].ratio, icon: 'pi pi-images'},
  {label: $const.Book, color: '#84fc8e', value: router.currentRoute.value.meta.items[4].ratio, icon: 'pi pi-book'},
]);
</script>

<template>

  <div class="surface-ground px-4 py-5 md:px-6 lg:px-8" style="max-width: 900px">
    <div class="card mb-3">
      <MeterGroup :value="info"/>
    </div>
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">{{ $const.Franchise }}</span>
              <div class="text-900 font-medium text-xl">{{ router.currentRoute.value.meta.items[0].count }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-tags text-blue-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">{{ `${router.currentRoute.value.meta.items[0].ratio}%` }}</span>
<!--          <span class="text-500">since last visit</span>-->
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">{{ $const.Product }}</span>
              <div class="text-900 font-medium text-xl">{{ router.currentRoute.value.meta.items[1].count }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-th-large text-orange-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">{{ `${router.currentRoute.value.meta.items[1].ratio}%` }}</span>
<!--          <span class="text-500">since last week</span>-->
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">{{ $const.Album }}</span>
              <div class="text-900 font-medium text-xl">{{ router.currentRoute.value.meta.items[3].count }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-images text-cyan-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">{{ `${router.currentRoute.value.meta.items[3].ratio}%` }}</span>
<!--          <span class="text-500">newly registered</span>-->
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">{{ $const.Book }}</span>
              <div class="text-900 font-medium text-xl">{{ router.currentRoute.value.meta.items[4].count }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-book text-purple-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">{{ `${router.currentRoute.value.meta.items[4].ratio}%` }}</span>
<!--          <span class="text-500">responded</span>-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>