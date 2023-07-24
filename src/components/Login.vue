<template>
  <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
    <div class="text-center mb-5">
      <img src="https://blocks.primevue.org/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3">
      <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
      <span class="text-600 font-medium line-height-3">Don't have an account?</span>
      <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
    </div>

    <div>
      <label for="email1" class="block text-900 font-medium mb-2">Email</label>
      <InputText id="email1" type="text" class="w-full mb-3"/>

      <label for="password1" class="block text-900 font-medium mb-2">Password</label>
      <InputText id="password1" type="password" class="w-full mb-3"/>

      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <InputText id="verifyCode" name="verifyCode" v-model="param.verifyCode" class="mr-1"
                       placeholder="验证码"></InputText>
          <!--                        <label htmlFor="verifyCode" class="block text-900 font-medium mb-2">验证码</label>-->
        </div>
        <div class="flex align-items-center">
          <img id="kaptcha" style="width:100px;height:40px;" class="mr-2" />
          <Button @click="refreshKaptcha" icon="pi pi-refresh"
                    class="p-button-rounded p-button-text"></Button>
        </div>
      </div>

      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <Checkbox id="rememberMe" :binary="true" v-model="checked" class="mr-2"></Checkbox>
          <label for="rememberMe">Remember me</label>
        </div>
        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
      </div>

      <Button label="Sign In" icon="pi pi-user" class="w-full" @click="login"></Button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import $ from 'jquery';
import {AxiosHelper} from "@/utils/axios_helper";
import {API} from "@/config/Web_Helper_Strs";

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
    console.log(res.message);
  }
}

const param = ref({
  username: "",
  password: "",
  verifyCode: "",
  rememberMe: false,
});

const checked = ref(false);

</script>

<style scoped>

</style>