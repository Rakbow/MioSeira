<script setup>
import {useRoute} from "vue-router";
import {defineAsyncComponent, ref} from "vue";
import {AxiosHelper as axios} from "@/utils/axiosHelper.js";
import {API} from "@/config/Web_Helper_Strs.js";
import {META} from "@/config/Web_Const.js";

const route = useRoute();
const info = ref();

const ItemDetailComponent = defineAsyncComponent(() => {
      return axios.post(API.GET_ITEM_DETAIL, {id: route.params.id}).then(res => {
        if (res.state === axios.SUCCESS) {
          info.value = res.data;
          document.title = res.data.item.name;
          let itemTypeName;
          if (res.data.type === META.ITEM_TYPE.ALBUM) {
            itemTypeName = 'Album';
          } else if (res.data.type === META.ITEM_TYPE.BOOK) {
            itemTypeName = 'Book';
          }
          return import(`@/views/detail/${itemTypeName}Detail.vue`);
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