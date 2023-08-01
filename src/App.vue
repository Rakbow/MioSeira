<template>
  <header>
    <CommonHeader></CommonHeader>
  </header>
  <main ref="mainContent">
    <router-view></router-view>
  </main>
  <footer>
    <CommonFooter></CommonFooter>
  </footer>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from "vue";
import CommonHeader from "@/components/common/CommonHeader.vue";
import CommonFooter from "@/components/common/CommonFooter.vue";

const mainContent = ref(null);

const setMainContentHeight = () => {
  const headerHeight = mainContent.value.previousElementSibling.offsetHeight;
  const footerHeight = mainContent.value.nextElementSibling.offsetHeight;
  const marginTop = getComputedStyle(mainContent.value).marginTop;
  const marginBottom = getComputedStyle(mainContent.value).marginBottom;

  mainContent.value.style.minHeight =
      `calc(${window.innerHeight}px - ${headerHeight}px - ${footerHeight}px - ${marginTop} - ${marginBottom} )`;
};

onMounted(() => {
  window.addEventListener('resize', setMainContentHeight);
  setMainContentHeight();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', setMainContentHeight);
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 使页面最小高度为视口高度，以撑开内容 */
}

header {
  //position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999; /* 如果需要header位于其他内容上方，可以提高层级 */
}

main {
  margin-top: 10px;
  margin-bottom: 10px;
  //position: relative;
  flex: 1; /* 让main占满剩余空间，使其高度随内容动态变化 */
  min-height: calc(100vh);
  /* 可选：设置额外的样式，如背景色或滚动条等 */
}

footer {
  //position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
