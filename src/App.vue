<template>
  <div class="page">
    <header>
      <PageHeader/>
    </header>
    <main>
      <router-view/>
    </main>
    <footer>
      <PageFooter/>
    </footer>
  </div>

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
import {defineAsyncComponent} from "vue";
import {registerPrimevueService} from '@/service/baseService'
import {useDialog} from 'primevue/usedialog';
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue";

const PageHeader = defineAsyncComponent(() => import('@/layouts/PageHeader.vue'));
const PageFooter = defineAsyncComponent(() => import('@/layouts/PageFooter.vue'));

const toast = useToast();
const dialog = useDialog();
const confirm = useConfirm();
registerPrimevueService(dialog, toast, confirm);

const handleScroll = (event: Event) => {
  event.stopPropagation();
}
</script>

<style lang="scss" scoped>
</style>
