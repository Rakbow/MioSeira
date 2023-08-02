<template>
  <div class="flex justify-content-evenly flex-wrap">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-3">
      <div class="text-center mb-5">
        <img src="https://blocks.primevue.org/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3">
        <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
        <span class="text-600 font-medium line-height-3">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
      </div>
      <div>
        <label for="username" class="block text-900 font-medium mb-2">{{WebText.Username}}</label>
        <InputText id="username" v-model="param.username" type="text" class="w-full mb-3"/>

        <label for="password" class="block text-900 font-medium mb-2">{{WebText.Password}}</label>
        <InputText id="password" v-model="param.password" type="password" class="w-full mb-3"/>

        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <InputText id="verifyCode" name="verifyCode" v-model="param.verifyCode" class="mr-1"
                       :placeholder="WebText.VerifyCode"></InputText>
            <!--                        <label htmlFor="verifyCode" class="block text-900 font-medium mb-2">验证码</label>-->
          </div>
          <div class="flex align-items-center">
            <img id="kaptcha" style="width:100px;height:40px;" class="mr-2"/>
            <Button @click="refreshKaptcha" icon="pi pi-refresh" :v-tooltip="WebText.RefreshVerifyCode"
                    class="p-button-rounded p-button-text"></Button>
          </div>
        </div>

        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <Checkbox id="rememberMe" :binary="true" v-model="param.rememberMe" class="mr-2"></Checkbox>
            <label for="rememberMe">{{WebText.RememberMe}}</label>
          </div>
          <!--        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>-->
        </div>

        <Button :label="WebText.SignIn" icon="pi pi-user" class="w-full" @click="login"></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import $ from 'jquery';
import {AxiosHelper} from "@/utils/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useAuth} from "@/utils/useAuth";

onMounted(() => {
  refreshKaptcha();
});

const refreshKaptcha = () => {
  const path = API.DOMAIN + "/kaptcha?p=" + Math.random();
  $("#kaptcha").attr("src", path);
}

const login = async () => {
  const res = await AxiosHelper.basePost(API.LOGIN, param.value);
  if(res.state === 1) {
    useAuth().setUser(res.data.user);
    useAuth().setToken(res.data.token);
  }
}

const param = ref({
  username: "",
  password: "",
  verifyCode: "",
  rememberMe: false,
});

</script>

<style scoped>

</style>