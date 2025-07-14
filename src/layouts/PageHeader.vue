<template>
  <div class="card">
    <Menubar>
      <template #start>
        <img alt="logo" :src="`${$const.STATIC_DOMAIN}common/logo.png`" height="40" class="mr-2" />
      </template>
      <template #end>
        <div style="display: flex;margin-right: 3rem">
          <Avatar v-if="userStore.isAuthenticated" :image="userStore!.user!.headerUrl"
                  size="xlarge" shape="circle" @pointerover="openSetting" />
          <Button v-if="!userStore.isAuthenticated" text rounded @click="openLogin" size="large"
                  v-tooltip="{value: t('SignIn'), class: 'short-tooltip'}">
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
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {logout} from '@/service/login';
import {useUserStore} from "@/store/modules/user";
import {useI18n} from "vue-i18n";
import {bs} from "@/service/baseService";

const Login = defineAsyncComponent(() => import('@/components/common/Login.vue'));

const {t} = useI18n();
const op = ref();
const userStore = useUserStore();

onBeforeMount(() => {
})
onMounted(() => {
})

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
</script>

<style scoped lang="scss">
</style>