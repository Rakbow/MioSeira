<template>
  <BlockUI :blocked="param.block">
    <div class="text-center mb-5">
      <img src="https://blocks.primevue.org/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3">
      <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
      <span class="text-600 font-medium line-height-3">Don't have an account?</span>
      <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
    </div>
    <div>
      <label for="username" class="block text-900 font-medium mb-2">{{ t('Username') }}</label>
      <InputText id="username" v-model="param.username" type="text" class="w-full mb-3"/>

      <label for="password" class="block text-900 font-medium mb-2">{{ t('Password') }}</label>
      <InputText id="password" v-model="param.password" type="password" class="w-full mb-3"/>

      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <InputText id="verifyCode" name="verifyCode" v-model="param.verifyCode" class="mr-1"
                     :placeholder="t('VerifyCode')"/>
          <!--                        <label htmlFor="verifyCode" class="block text-900 font-medium mb-2">验证码</label>-->
        </div>
        <div class="flex align-items-center">
          <img id="kaptcha" style="width:10rem;height:4rem;" class="mr-2" alt="" src=""/>
          <Button @click="refreshKaptcha" icon="pi pi-refresh" :v-tooltip="t('RefreshVerifyCode')"
                  class="p-button-rounded p-button-text"/>
        </div>
      </div>

      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <Checkbox id="rememberMe" :binary="true" v-model="param.rememberMe" class="mr-2"></Checkbox>
          <label for="rememberMe">{{ t('RememberMe') }}</label>
        </div>
        <!--        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>-->
      </div>

      <Button :label="t('SignIn')" icon="pi pi-user" class="w-full" @click="login"/>
    </div>
  </BlockUI>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import $ from 'jquery';
import {API, Axios} from "@/api";
import {useUserStore} from "@/store/modules/user";
import {useI18n} from "vue-i18n";
import {bs} from '@/service/baseService';
import {EditParam} from "@/service/entityService";

const {t} = useI18n();
const userStore = useUserStore();
const param = ref(new EditParam());

onMounted(() => {
  refreshKaptcha();
});

const refreshKaptcha = () => {
  const path = API.VERIFY_CODE + "?p=" + Math.random();
  $("#kaptcha").attr("src", path);
}

const login = async () => {
  param.value.block = true;
  const res = await Axios.post(API.LOGIN, param.value);
  if (res.success()) {
    userStore.login(res.data.user, res.data.token);
    location.reload();
  } else {
    bs!.toast.error(res.message);
    param.value.block = false;
  }
}

const param = ref({
  username: "",
  password: "",
  verifyCode: "",
  rememberMe: false,
});

</script>

<style scoped lang="scss">
</style>