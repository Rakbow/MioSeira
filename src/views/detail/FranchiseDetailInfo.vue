<script setup lang="ts">
import {defineProps} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({})
  } as any
});

</script>

<template>
  <table class="table-borderless table-sm ml-2">
    <tbody class="detail-item-header-table">
      <tr>
        <td>
          <i class="pi material-symbols-outlined">tag</i>
          <strong>{{ $t('Name') }}</strong>
        </td>
        <td>
          {{ item.name }}
        </td>
      </tr>
      <tr>
        <td>
          <i class="pi material-symbols-outlined">tag</i>
          <strong>{{ $t('NameZh') }}</strong>
        </td>
        <td>
          {{ item.nameZh }}
        </td>
      </tr>
      <tr>
        <td>
          <i class="pi material-symbols-outlined">tag</i>
          <strong>{{ $t('NameEn') }}</strong>
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