<script setup lang="ts">
import {computed, getCurrentInstance, onBeforeUnmount, onMounted, ref} from 'vue'

interface Props {
  modelValue: string
  query: string
}

const props = defineProps<Props>();
const {proxy} = getCurrentInstance()!;
const show = ref(false)

const filteredOptions = computed(() =>
    Object.fromEntries(Object.entries(proxy!.$const.CURRENCIES).filter(([code]) => code !== props.modelValue))
)

const toggle = () => {
  show.value = !show.value;
}

// 点击外部关闭 dropdown
const dropdownRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    show.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="r-dropdown" ref="dropdownRef">
    <a class="r-dropdown-toggle" @click.prevent="toggle">
      <span>{{ props.modelValue }}<i class="ml-2 pi pi-sort-down-fill"/></span>
    </a>
    <div v-if="show" class="r-dropdown-menu">
      <a class="r-dropdown-item"
          v-for="(label, code) in filteredOptions"
          :key="code"
          :href="`https://www.bing.com/search?q=${props.query}+IN+${code}`"
          target="_blank">
        {{ label }}
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.r-dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;

  &-toggle {
    padding: 0 .5rem;
    text-decoration: none !important;
    transition: background 0.1s;

    span, i {
      color: var(--r-mint-100)
    }

    span {
      font-size: 1.1rem;
    }

    i {
      font-size: .8rem !important;
    }

  }

  &-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 5rem;
    background: var(--r-bg-blue-950);
    border-radius: .6rem;
    margin-top: 0.5rem;
    box-shadow: 0 .4rem .8rem rgba(0, 0, 0, 0.2);
    z-index: 999;
  }

  &-item {
    font-size: 1rem;
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none !important;
    transition: background 0.2s;

    &:hover {
      background: #222;
    }
  }
}
</style>
