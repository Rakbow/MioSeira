<template>
  <Fieldset :toggleable="true">
    <template #legend>
      <span class="material-symbols-outlined fieldset-icon">article</span>
      <b>{{ $constant.Description }}</b>
    </template>
    <div class="relative">
      <Button v-if="userStore.user.type === 0 || userStore.user.type > 1" class="p-button-link absolute top-0"
              @click="openEditDialog" style="right: 5%"
              v-tooltip.bottom="{value: $constant.Edit, class: 'short-tooltip'}" >
        <template #icon>
          <span class="material-symbols-outlined">edit_note</span>
        </template>
      </Button>
      <Button v-if="!empty" class="p-button-link absolute top-0 right-0" icon="pi pi-external-link" @click="openTextTingle"
                v-tooltip.bottom="{value: $constant.FullScreen, class: 'short-tooltip'}" />
      <article v-if="!empty" ref="html" class="markdown-body" />
      <span v-else class="emptyInfo"><em>{{ $constant.NoDescription }}</em></span>
    </div>
  </Fieldset>
</template>

<script setup>
import {ref, onMounted, defineProps, defineAsyncComponent, getCurrentInstance} from "vue";
import {useUserStore} from "@/store/user";
import {marked} from 'marked';
import tingle from 'tingle.js';
import { useDialog } from 'primevue/usedialog';
const CommonTextEditor = defineAsyncComponent(() => import('@/components/database/CommonTextEditor.vue'));
const $constant = getCurrentInstance().appContext.config.globalProperties.$constant;

const empty = ref(false);

const props = defineProps({
  text: {
    type: String,
    required: true,
    default: () => ('')
  },
  entityType: {
    type: Number,
    required: true,
    default: () => (0)
  },
  entityId: {
    type: Number,
    required: true,
    default: () => (0)
  },
  images: {
    type: Array,
    required: true,
    default: () => ([])
  }
});

onMounted(() => {
  text2Markdown();
})

const dialog = useDialog();
const userStore = useUserStore();
const html = ref();

const openEditDialog = () => {
  dialog.open(CommonTextEditor, {
    props: {
      header: $constant.Description,
      style: {
        width: '80vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '70vw'
      },
      modal: true
    },
    data: {
      text: props.text,
      type: 'desc',
      images: props.images,
      entityType: props.entityType,
      entityId: props.entityId,
    }
  });
}

const text2Markdown = () => {
  if (props.text != null && props.text !== "") {
    html.value.innerHTML = marked.parse(props.text);
  }else {
    empty.value = true;
  }
}

const openTextTingle = () => {
  tingleModal.open();
};

const tingleModal = new tingle.modal({
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: "Close",
  cssClass: ['tingle-markdown-body'],
  onOpen: function () {
    if (props.text != null && props.text !== "") {
      tingleModal.setContent(marked.parse(props.text));
    }
  }
});
</script>

<style scoped>

@import 'tingle.js/src/tingle.css';

article {
  width: 100%;
  font-size: 13px;
}
</style>