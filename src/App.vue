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

  <Toast/>
  <DynamicDialog @scroll="handleScroll"/>
  <ConfirmDialog group="templating">
    <template #message="slotProps">
      <i :class="slotProps.message.icon" style="font-size: 3rem"/>
      <p>{{ slotProps.message.message }}</p>
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from "vue";
import PageHeader from "@/layouts/PageHeader.vue";
import PageFooter from "@/layouts/PageFooter.vue";
import {useDialog} from 'primevue/usedialog';
import { registerPrimevueService } from '@/service/baseService'
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue";

const toast = useToast();
const dialog = useDialog();
const confirm = useConfirm();
registerPrimevueService(dialog, toast, confirm);
const mainContent = ref();

const handleScroll = (event) => {
  event.stopPropagation();
}

const setMainContentHeight = () => {
  if (mainContent.value) {
    const header = mainContent.value.previousElementSibling as HTMLElement;
    const footer = mainContent.value.nextElementSibling as HTMLElement;

    if (header && footer) {
      const headerHeight = header.offsetHeight;
      const footerHeight = footer.offsetHeight;
      const computedStyle = getComputedStyle(mainContent.value);
      const marginTop = parseFloat(computedStyle.marginTop);
      const marginBottom = parseFloat(computedStyle.marginBottom);

      mainContent.value.style.minHeight =
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
  margin-top: 1rem;
  margin-bottom: 1rem;
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
