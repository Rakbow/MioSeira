<script setup lang="ts">
import {defineProps} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  tooltip: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    required: false,
    default: 'text'
  },
  size: {
    type: String,
    required: false
  },
  severity: {
    type: String,
    required: false,
    default: 'success'
  }
});
</script>

<template>
  <Button :variant="props.variant" :size="props.size" :severity="props.severity" v-tooltip.bottom="{value: t(tooltip)}">
    <template #icon>
      <RIcon :name="icon" />
    </template>
  </Button>
</template>

<style scoped lang="scss">

</style>