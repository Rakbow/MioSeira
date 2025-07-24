<template>
  <Menubar :model="menuItems" style="border-style: none !important;">
    <template #start>
      <img alt="logo" :src="`${$const.STATIC_DOMAIN}common/logo.png`" height="40" class="mr-2" />
    </template>
    <template #item="{item}">
      <Button @click="router.push(item.url!.toString())" size="large" link :label="item.label!.toString()">
        <template #icon>
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24">
              {{ item.icon }}
            </span>
        </template>
      </Button>
    </template>
    <template #end>
      <div style="display: flex">
        <Language />
        <b style="font-size: 1.1rem;color: var(--r-mint-100);user-select: none;cursor: default;">&nbsp;|&nbsp;</b>
        <User :user="user" />
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, ref} from "vue";
import {useUserStore} from "@/store/modules/user";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const Language = defineAsyncComponent(() => import('@/components/global/Language.vue'));
const User = defineAsyncComponent(() => import('@/components/global/User.vue'));

const {t} = useI18n();
const router = useRouter();
const user = useUserStore();
const {proxy} = getCurrentInstance()!;

onBeforeMount(() => {
})
onMounted(() => {
})

const menuItems = ref([
  {
    label: t('Item'),
    icon: 'toys_and_games',
    url: proxy!.$api.ITEM.SEARCH_PATH
  },
  {
    label: t('Entry'),
    icon: 'lists',
    url: proxy!.$api.ENTRY.SEARCH_PATH
  },
  {
    label: t('Manage'),
    icon: 'folder_managed',
    url: '/db/manage/item'
  }
]);
</script>

<style scoped lang="scss">
</style>