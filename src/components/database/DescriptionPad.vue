<template>
  <Fieldset :toggleable="true">
    <template #legend>
      <span class="material-symbols-outlined fieldset-icon">article</span>
      <b>{{ props.header }}</b>
    </template>
    <div class="relative">
      <div v-if="userStore.user">
        <Button v-if="userStore.user.type === 0 || userStore.user.type > 1" class="p-button-link absolute top-0"
                @click="openEditDialog" style="right: 5%"
                v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}" >
          <template #icon>
            <span class="material-symbols-outlined">edit_note</span>
          </template>
        </Button>
      </div>
      <Button v-if="!empty" class="p-button-link absolute top-0 right-0" icon="pi pi-external-link" @click="openTextTingle"
                v-tooltip.bottom="{value: $const.FullScreen, class: 'short-tooltip'}" />
      <article ref="html" class="markdown-body" />
    </div>
  </Fieldset>
</template>

<script setup>
import {ref, onMounted, defineProps, defineAsyncComponent, getCurrentInstance } from "vue";
import {useUserStore} from "@/store/user";
import {marked} from 'marked';
import tingle from 'tingle.js';
import { useDialog } from 'primevue/usedialog';
const CommonTextEditor = defineAsyncComponent(() => import('@/components/database/CommonTextEditor.vue'));
const $const = getCurrentInstance().appContext.config.globalProperties.$const;

const empty = ref(false);

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  header: {
    type: String,
    required: true
  },
  entityType: {
    type: Number,
    required: true
  },
  entityId: {
    type: Number,
    required: true
  },
  images: {
    type: Array,
    required: false,
    default: () => ([])
  }
});

onMounted(() => {
  text.value = props.text;
  text2Markdown();
})

const dialog = useDialog();
const userStore = useUserStore();
const html = ref();
const text = ref('');

const openEditDialog = () => {
  dialog.open(CommonTextEditor, {
    props: {
      header: $const.Description,
      style: {
        width: '80vw',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '70vw'
      },
      modal: true,
      closable: false
    },
    data: {
      text: text.value,
      type: 'desc',
      images: props.images,
      entityType: props.entityType,
      entityId: props.entityId,
    },
    onClose: (options) => {
      if(options.data !== undefined) {
        if(options.data.isUpdate) {
          text.value = options.data.text;
          text2Markdown();
        }
      }
    }
  });
}

const text2Markdown = () => {
  if (text.value == null || text.value === '') {
    html.value.innerHTML = marked.parse('<span class="emptyInfo"><em>' + $const.NoDescription + '</em></span>');
    empty.value = true;
  }else {
    empty.value = false;
    html.value.innerHTML = marked.parse(text.value);
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
    if (text.value != null && text.value !== "") {
      tingleModal.setContent(marked.parse(text.value));
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