<script setup lang="ts">
import {defineProps, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";

onBeforeMount(() => {
  if(props.action) {
    if(props.action === 'create') {
      finalProps.value = {
        severity: 'success',
        icon: 'add_box',
        tip: 'Add'
      }
    }
    else if (props.action === 'update') {
      finalProps.value = {
        severity: 'info',
        icon: 'edit_square',
        tip: 'Edit'
      }
    }
    else if (props.action === 'delete') {
      finalProps.value = {
        severity: 'danger',
        icon: 'disabled_by_default',
        tip: 'Delete'
      }
    }
    else if (props.action === 'clear') {
      finalProps.value = {
        severity: 'danger',
        icon: 'disabled_by_default',
        tip: 'Delete'
      }
    }
    else if (props.action === 'export') {
      finalProps.value = {
        severity: 'help',
        icon: 'file_export',
        tip: 'Export'
      }
    }
  }else {
    finalProps.value = {
      severity: props.severity!,
      icon: props.icon!,
      tip: props.tip!
    }
  }
})

const finalProps = ref<RButtonProps>();
const {t} = useI18n();

const props = defineProps({
  action: {
    type: String,
    required: false
  },
  icon: {
    type: String,
    required: false,
    default: 'add_box'
  },
  tip: {
    type: String,
    required: false,
    default: 'Other'
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
    required: false
  }
});
</script>

<template>
  <Button :variant="props.variant" :size="props.size"
          :severity="finalProps!.severity"
          v-tooltip.bottom="{value: t(finalProps!.tip), disabled: !finalProps!.tip}">
    <template #icon>
      <RIcon :name="finalProps!.icon" />
    </template>
  </Button>
</template>

<style scoped lang="scss">

</style>