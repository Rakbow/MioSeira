<script setup lang="ts">
import {getCurrentInstance, ref} from "vue"
import {useI18n} from "vue-i18n"

const props = defineProps<{
  modelValue: Number,
  disabled: boolean
}>()

const emit = defineEmits(['update', 'update:modelValue'])
const {t} = useI18n()
const {proxy} = getCurrentInstance()!;
const entryType = ref(props.modelValue ? proxy!.$const.ENTRY_TYPE_SET[(props.modelValue as number) - 1] : null )

const update = (ev: any) => {
  if(ev.value) {
    emit('update', parseInt(ev.value.value))
  }else {
    emit('update', null)
  }
}

</script>

<template>
  <SelectButton size="small" @change="update" :disabled="disabled"
                v-model="entryType" :options="$const.ENTRY_TYPE_SET"
                optionLabel="value" ariaLabelledby="custom">
    <template #option="{option}">
      <RIcon :name="option.icon" :size="1.4"/>
      <span style="font-size: 1.1rem">{{ t(option!.label) }}</span>
    </template>
  </SelectButton>
</template>

<style scoped lang="scss">
</style>