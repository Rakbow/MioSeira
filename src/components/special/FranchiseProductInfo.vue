<script setup>
import {defineProps, getCurrentInstance, onMounted, ref} from 'vue';
import {useDialog} from "primevue/usedialog";
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {useRoute} from "vue-router";

const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;

onMounted(() => {
  getProducts();
});

const route = useRoute();
const dialog = useDialog();
const editBlock = ref(false);
const products = ref([]);

const getProducts = async () => {
  editBlock.value = true;
  let param = {
    id: route.params.id
  }
  const res = await axios.post($api.GET_RELATED_PRODUCTS, param);
  if (res.state === axios.SUCCESS)
    products.value = res.data;
  editBlock.value = false;
}

</script>

<template>
  <BlockUI :blocked="editBlock">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-th-large"></i>
        <b>{{ $const.Product }}</b>
      </template>

      <div v-if="products.length > 0" class="grid justify-content-evenly justify-content-start" style="width: 700px">
        <div class="col-4 mt-2 mb-2 info_bit_small" id="product-image-div"
             v-for="(item, index) of products" :key="index">
          <div class="sidebar-panel-image-small-div product_info_bit_thumb">
            <a :href="'/db/product/' + item.id">
              <img class="sidebar-panel-image-small" :src="item.cover" alt=""
                   draggable="false" oncontextmenu="return false"
                   v-tooltip.bottom="item.name + '/' + item.nameZh">
            </a>
          </div>
        </div>
      </div>

      <div class="grid" v-if="products.length === 0">
          <span class="small_font">
              <div class="info_bit_small small_font grid m-0 p-0"
                   v-if="products.length !== 0"
                   v-for="item of products">
                  <div class="sidebar-panel-image-small-div album_info_bit_thumb mt-2">
                      <a :href="'/db/product/' + item.id">
                          <img class="sidebar-panel-image-small" :src="item.cover" alt=""
                               v-tooltip.bottom="item.name + '/' + item.nameZh">
                      </a>
                  </div>
                  <div class="col p-0" style="height: 80px">
                      <ul class="info_bit_small_other">
                        <li>
                          <span class="small_font col-6 related-item-date">
                              {{ item.category.label }}
                          </span>
                        </li>
                        <li>
                            <a class="small_font"
                               :href="'/db/product/' + item.id">
                                <span class="text-truncate-2 mr-2">
                                    {{ item.name }}
                                </span>
                            </a>
                        </li>
                        <li>
                          <span class="small_font col-6 related-item-catalog">
                              {{ item.nameZh }}
                          </span>
                        </li>
                      </ul>
                  </div>
              </div>
          </span>
      </div>
      <div v-else>
        <span class="emptyInfo"><em>{{ $const.NoInfo }}</em></span>
      </div>

    </Fieldset>
  </BlockUI>
</template>

<style scoped>
#product-image-div {
  display: flex;
  position: relative;
  width: 70px;
  height: 70px;
  overflow: hidden;
}
</style>