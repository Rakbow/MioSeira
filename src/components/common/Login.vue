<template>
  <BlockUI :blocked="param.block">
    <div class="text-center mb-5">
      <img alt="logo" :src="`${$const.STATIC_DOMAIN}common/logo.png`" height="40" class="mr-2" />
      <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
      <span class="text-600 font-medium line-height-3">Don't have an account?</span>
      <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
    </div>
    <div class="entity-editor">
      <FloatLabel class="field" variant="on">
        <label>{{ t('Username') }}</label>
        <InputText id="username" size="large" v-model="loginDTO.username"/>
      </FloatLabel>
      <FloatLabel class="field" variant="on">
        <label>{{ t('Password') }}</label>
        <InputText id="password" size="large" v-model="loginDTO.password"/>
      </FloatLabel>

      <div class="grid gap-4">
        <FloatLabel variant="on">
          <label>{{ t('VerifyCode') }}</label>
          <InputText size="large" v-model="loginDTO.verifyCode"/>
        </FloatLabel>
        <div class="flex align-items-center">
          <img id="kaptcha" style="width:7rem;height:2.8rem;" class="mr-2" alt="" src=""/>
          <Button @click="refreshKaptcha" icon="pi pi-refresh" :v-tooltip="t('RefreshVerifyCode')"
                  class="p-button-rounded p-button-text"/>
        </div>
        <div class="flex align-items-center">
          <Checkbox id="rememberMe" :binary="true" v-model="loginDTO.rememberMe" class="mr-2"></Checkbox>
          <label for="rememberMe">{{ t('RememberMe') }}</label>
        </div>
      </div>
      <Button :label="t('SignIn')" icon="pi pi-user" class="w-full" @click="toLogin"/>
    </div>
  </BlockUI>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import $ from 'jquery';
import {API} from "@/api";
import {useI18n} from "vue-i18n";
import {login} from '@/service/login';
import {EditParam} from "@/service/entityService";

const {t} = useI18n();
const param = ref(new EditParam());

onMounted(() => {
  refreshKaptcha();
});

const refreshKaptcha = () => {
  const path = API.VERIFY_CODE + "?p=" + Math.random();
  $("#kaptcha").attr("src", path);
}

const toLogin = async () => {
  param.value.block = true;
  await login(loginDTO.value);
  param.value.block = false;
}

const loginDTO = ref({
  username: "",
  password: "",
  verifyCode: "",
  rememberMe: false,
});

</script>

<style scoped lang="scss">
</style>