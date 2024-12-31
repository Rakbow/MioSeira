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
    <tbody class="entity-info-table">
    <tr>
      <td>
        <i class="pi pi-tag"></i>
        <strong>{{ $t('Category') }}</strong>
      </td>
      <td style="display:inline">
        <a :href="'/db/manager/product?type=' + item.type.value">
          <Tag class="ml-1" :value="item.type.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-calendar"></i>
        <strong>{{ $t('ReleaseDate') }}</strong>
      </td>
      <td>
        {{ item.date ? item.date : "N/A" }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
</style>