<script setup>
import {defineProps, getCurrentInstance} from "vue";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

</script>

<template>
  <table class="table-borderless table-sm ml-2">
    <tbody class="detail-item-header-table">
    <tr>
      <td>
        <i class="pi pi-th-large"></i>
        <strong>{{ $const.Franchise }}</strong>
      </td>
      <td>
        <router-link :to="'/db/franchise/' + item.franchise.value">
          {{ item.franchise.label }}
        </router-link>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-tag"></i>
        <strong>{{ $const.Category }}</strong>
      </td>
      <td style="display:inline">
        <a :href="'/db/manager/product?category=' + item.category.value">
          <Tag class="ml-1" :value="item.category.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-calendar"></i>
        <strong>{{ $const.ReleaseDate }}</strong>
      </td>
      <td>
        {{ item.releaseDate ? item.releaseDate : "N/A" }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.detail-list-icon {
  margin-right: 0.25rem;
  font-size: 1.3rem;
}
</style>