<template>
  <Panel>
    <template #header>
      <span class="text-start side-panel-header">
          <i class="pi iconfont icon-product_b"></i><span><strong>{{ webText.Category }}</strong></span>
      </span>
    </template>
    <div class="grid">
      <div class="col-fixed pt-0 pb-0">
        <i class="pi pi-bookmark mr-2"></i><b>{{ webText.Franchises }}</b>
      </div>
      <div class="col-10 col-offset-2 pt-0 pb-0">
        <p class="mb-0 a_with_underline" v-for="franchise of info.franchises">
          <router-link :to="'/db/entry/' +  franchise.value">
            <span style="display:inline">
                {{franchise.label}}
            </span>
          </router-link>
        </p>
      </div>
      <div class="col-fixed pt-0 pb-0">
        <i class="pi pi-tags mr-2"></i><b>{{ webText.Products }}</b>
      </div>
      <div class="col-10 col-offset-2 pt-0 pb-0">
        <p class="mb-0 a_with_underline" v-for="product of info.products">
          <router-link :to="'/db/entry/' +  product.value">
            <span style="display:inline">
                {{product.label}}
            </span>
          </router-link>
        </p>
      </div>
    </div>
  </Panel>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  info: {
    type: Object,
    default: () => ({
      products: [],
      franchises: []
    })
  }
});
</script>

<style scoped>

</style>