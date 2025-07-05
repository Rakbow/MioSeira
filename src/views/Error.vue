<script setup lang="ts">
import {useRouter} from "vue-router";
import {onBeforeMount, ref} from "vue";

const router = useRouter();
const errorMessage = ref('');

onBeforeMount(() => {
  errorMessage.value = '';
});

//跳转首页
const goIndex = () => {
  //跳转页面覆盖当前页面
  window.location.href = "/";
};

//返回上一页
const goBack = () => {
  window.history.back();
};
</script>

<template>
  <div class="px-2 py-4 md:px-6 lg:px-8 sm:px-4">
    <div class="text-900 font-bold text-2xl mb-1 text-center">系统消息</div>

    <div class="grid">
      <div class="col-12 lg:col-6 lg:col-offset-3 sm:col-10 sm:col-offset-1">
        <div class="p-3 h-full">
          <Card style="overflow: hidden">
            <template #header>
              <img alt="error" :src="`${$const.STATIC_DOMAIN}common/404.jpg`" />
            </template>
            <template #title>系统消息</template>
            <template #subtitle>错误</template>
            <template #content>
              <p class="m-0">
                {{ errorMessage }}
              </p>
            </template>
            <template #footer>
              <div class="flex gap-3 mt-1">
                <Button label="首页" severity="secondary" outlined class="w-full" @click="goIndex" />
                <Button label="返回上一页" class="w-full" @click="goBack" />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>