<script setup lang="ts">

import {defineProps, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
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
      {{ `${t('SearchIn')} ${time}s` }}
    </template>
    <template #end>
      {{ total }} {{ t('Result') }}
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
<!--    <template #container="{pageLinks, changePageCallback, firstPageCallback, prevPageCallback, nextPageCallback, lastPageCallback}">-->
<!--      <Button @click="firstPageCallback" text>-->
<!--        <RIcon name="first_page" size="0.5"/>-->
<!--      </Button>-->
<!--      <div v-for="page in pageLinks">-->
<!--        <Button @click="changePageCallback(page-1)" :label="page.toString()" text />-->
<!--      </div>-->
<!--    </template>-->
  </Paginator>
</template>

<style scoped lang="scss">

</style>