<script setup lang="ts">
import {useRoute} from "vue-router";
import {defineAsyncComponent, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {API} from "@/config/Web_Helper_Strs.ts";
import {META} from "@/config/Web_Const.ts";

const route = useRoute();
const info = ref();

const ItemDetailComponent = defineAsyncComponent(() => {
      return axios.post(API.GET_ITEM_DETAIL, {id: route.params.id}).then(async res => {
        if (res.state === axios.SUCCESS) {
          info.value = res.data;
          document.title = res.data.item.name;
          let itemTypeName: string;
          if (res.data.type === META.ITEM_TYPE.ALBUM) {
            itemTypeName = 'Album';
          } else if (res.data.type === META.ITEM_TYPE.BOOK) {
            itemTypeName = 'Book';
          }
          if (itemTypeName) {
            // 使用 import.meta.glob 提前定义好所有可能的动态导入
            const modules = import.meta.glob('@/views/detail/*Detail.vue');
            const importComponent = modules[`/src/views/detail/${itemTypeName}Detail.vue`];
            if (importComponent) {
              const component = await importComponent();
              return component.default;
            } else {
              throw new Error(`Component not found: /src/views/detail/${itemTypeName}Detail.vue`);
            }
          }
        }
      });
    }
)
</script>

<template>
  <ItemDetailComponent :info="info"/>
</template>

<style scoped>

</style>