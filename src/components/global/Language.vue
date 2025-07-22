<script setup lang="ts">
import {onBeforeMount, onBeforeUnmount, onMounted, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/store/modules/option";

const show = ref(false)
const {locale} = useI18n();
const currentLocale = ref();
const optionStore = useOptionStore();
const languages = ref([
  {label: '简体中文', code: 'zh'},
  {label: 'English', code: 'en'},
]);

const toggle = () => {
  show.value = !show.value;
}

const dropdownRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    show.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeMount(() => {
  currentLocale.value = languages.value.find(l => l.code === locale.value)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const changeLanguage = (code: string) => {
  locale.value = code;
  localStorage.setItem('locale', code);
  optionStore.clear();
  location.reload();
}
</script>

<template>
  <div class="r-dropdown" ref="dropdownRef">
    <a class="r-dropdown-toggle" @click.prevent="toggle">
      <span>{{ currentLocale.label }}<i class="ml-2 pi pi-sort-down-fill"/></span>
    </a>
    <div v-if="show" class="r-dropdown-menu">
      <a class="r-dropdown-item"
         v-for="lang in languages"
         @click.prevent="changeLanguage(lang.code)">
        {{ lang.label }}
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.r-dropdown {
  height: 1.7rem;
  position: relative;
  display: inline-block;
  cursor: pointer;

  a:hover {
    text-decoration: none !important;
  }

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
    width: 6rem;
    background: var(--r-bg-indigo-700);
    border-radius: .6rem;
    margin-top: 0.5rem;
    box-shadow: 0 .4rem .8rem rgba(0, 0, 0, 0.2);
    z-index: 999;
  }

  &-item {
    font-size: 1rem;
    display: block;
    padding: 0.3rem 1rem;
    text-decoration: none !important;
    transition: background 0.2s;

    &:hover {
      background: #222;
    }
  }
}
</style>
