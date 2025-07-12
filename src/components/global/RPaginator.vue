<script setup lang="ts">

import {defineProps, onBeforeMount, ref} from "vue";

const emit = defineEmits(['page', 'update:rows'])
const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  alwaysShow: {
    type: Boolean,
    required: false,
    default: true
  },
  sizeOptions: {
    type: Array<number>,
    required: false,
    default: null
  }
});
const pageTemplate = ref();
onBeforeMount(() => {
  if (props.sizeOptions) {
    pageTemplate.value = "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown";
  } else {
    pageTemplate.value = "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink";
  }
})

</script>

<template>
  <Paginator v-bind:first="(page - 1) * size" v-bind:rows="size" :totalRecords="total"
             @page="e => emit('page', e)" @update:rows="e => emit('update:rows', e)"
             :alwaysShow="alwaysShow" :rowsPerPageOptions="sizeOptions" :template="pageTemplate">
    <template #start>
      search in {{ time }}s
    </template>
    <template #end>
      {{ total }} items
    </template>
    <template #firsticon>
      <RIcon name="first_page"/>
    </template>
    <template #previcon>
      <RIcon name="chevron_left"/>
    </template>
    <template #nexticon>
      <RIcon name="chevron_right"/>
    </template>
    <template #lasticon>
      <RIcon name="last_page"/>
    </template>
  </Paginator>
</template>

<style scoped lang="scss">

</style>