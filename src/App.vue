<template>
  <header>
    <PageHeader/>
  </header>
  <main ref="mainContent">
    <router-view/>
  </main>
  <footer>
    <PageFooter/>
  </footer>
  <DynamicDialog @scroll="handleScroll"/>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount} from "vue";
import PageHeader from "@/components/page/PageHeader.vue";
import PageFooter from "@/components/page/PageFooter.vue";
import {useDialog} from 'primevue/usedialog';

const dialog = useDialog();

let mainContent: HTMLElement;

const handleScroll = (event) => {
  event.stopPropagation();
}

const setMainContentHeight = () => {
  if (mainContent) {
    const header = mainContent.previousElementSibling as HTMLElement;
    const footer = mainContent.nextElementSibling as HTMLElement;

    if (header && footer) {
      const headerHeight = header.offsetHeight;
      const footerHeight = footer.offsetHeight;
      const computedStyle = getComputedStyle(mainContent);
      const marginTop = parseFloat(computedStyle.marginTop);
      const marginBottom = parseFloat(computedStyle.marginBottom);

      mainContent.style.minHeight =
          `calc(${window.innerHeight}px - ${headerHeight}px - ${footerHeight}px - ${marginTop}px - ${marginBottom}px)`;
    }
  }

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
