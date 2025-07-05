<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  name: string,           // 图标名称，如 'home', 'search'
  size?: string | number, // 尺寸，支持 '24rem' 或数字
  fill?: number,          // 0 = 空心, 1 = 实心
  weight?: number,        // 字重，范围 100~700
  grade?: number          // 细节调整：-25 到 200
}>()

const computedStyle = computed(() => ({
  fontSize: typeof props.size === 'number' ? `${props.size}rem` : props.size || '2.4rem',
  fontVariationSettings: `'FILL' ${props.fill ?? 0}, 'wght' ${props.weight ?? 400}, 'GRAD' ${props.grade ?? 0}, 'opsz' auto`
}))
</script>

<template>
  <span class="material-symbols-outlined" :style="computedStyle">
    {{ name }}
  </span>
</template>

<style scoped lang="scss">

</style>