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
          <i class="pi material-symbols-outlined">tag</i>
          <strong>{{ $const.Name }}</strong>
        </td>
        <td>
          {{ item.name }}
        </td>
      </tr>
      <tr>
        <td>
          <i class="pi material-symbols-outlined">tag</i>
          <strong>{{ $const.NameZh }}</strong>
        </td>
        <td>
          {{ item.nameZh }}
        </td>
      </tr>
      <tr>
        <td>
          <i class="pi material-symbols-outlined">tag</i>
          <strong>{{ $const.NameEn }}</strong>
        </td>
        <td>
          {{ item.nameEn }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>