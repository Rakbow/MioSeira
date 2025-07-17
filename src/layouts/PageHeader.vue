<template>
  <div class="card">
    <Menubar :model="menuItems">
      <template #start>
        <img alt="logo" :src="`${$const.STATIC_DOMAIN}common/logo.png`" height="40" class="mr-2" />
      </template>
      <template #item="{item}">
        <Button @click="router.push(item.url!.toString())" size="large" outlined :label="item.label!.toString()">
          <template #icon>
            <span class="material-symbols-outlined">
              {{ item.icon }}
            </span>
          </template>
        </Button>
      </template>
      <template #end>
        <div style="display: flex;margin-right: 3rem">
          <div class="language-selector">
            <select v-model="currentLocale" @change="changeLanguage">
              <option value="zh">简体中文</option>
              <option value="en">English</option>
            </select>
          </div>
          <Avatar v-if="userStore.isAuthenticated" :image="userStore!.user!.headerUrl"
                  size="xlarge" shape="circle" @pointerover="openSetting" />
          <Button v-if="!userStore.isAuthenticated" text rounded @click="openLogin" size="large"
                  v-tooltip="{value: t('SignIn')}">
            <template #icon>
              <RIcon name="login" :size="3"/>
            </template>
          </Button>
        </div>

      </template>
    </Menubar>
  </div>
  <Popover ref="op">
    <Button @click="logout" :label="t('SignOut')" text>
      <template #icon>
        <RIcon name="logout" :size="2"/>
      </template>
    </Button>
  </Popover>
</template>

<script setup lang="ts">
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, ref} from "vue";
import {logout} from '@/service/login';
import {useUserStore} from "@/store/modules/user";
import {useI18n} from "vue-i18n";
import {bs} from "@/service/baseService";
import {useRouter} from "vue-router";
import {useOptionStore} from "@/store/modules/option";

const Login = defineAsyncComponent(() => import('@/components/common/Login.vue'));

const {t} = useI18n();
const op = ref();
const router = useRouter();
const userStore = useUserStore();
const {proxy} = getCurrentInstance()!;
const { locale } = useI18n();
const currentLocale = ref(locale.value);
const optionStore = useOptionStore();

onBeforeMount(() => {
})
onMounted(() => {
})

const menuItems = ref([
  {
    label: t('Item'),
    icon: 'chess_pawn',
    url: proxy!.$api.ITEM.SEARCH_PATH
  },
  {
    label: t('Entry'),
    icon: 'lists',
    url: proxy!.$api.ENTRY.SEARCH_PATH
  }
]);

const openLogin = () => {
  bs!.dialog.open(Login, {
    props: {
      header: t('SignIn'),
      style: {
        width: '40rem',
      },
      modal: true
    }
  });
}

const openSetting = (ev: any) => {
  op.value.toggle(ev);
}

const changeLanguage = () => {
  locale.value = currentLocale.value;
  localStorage.setItem('locale', currentLocale.value);
  optionStore.clear();
}
</script>

<style scoped lang="scss">
.language-selector {
  align-items: center;
  display: flex;
  margin-right: 1rem;
}
</style>