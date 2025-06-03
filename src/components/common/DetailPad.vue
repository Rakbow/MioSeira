<template>
  <BlockUI :blocked="editBlock" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-align-left"/>
        <b>{{ props.header }}</b>
      </template>
      <article ref="html" class="entity-detail-markdown"/>
      <div class="relative">
        <Button v-if="userStore.user && userStore.user.type > 1" class="p-button-link absolute bottom-0"
                @click="openEditDialog" style="right: 5%" icon="pi pi-pen-to-square"
                v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}"/>
        <Button v-if="!empty" class="p-button-link absolute bottom-0"
                @click="openTextTingle" style="right: 0" icon="pi pi-external-link"
                v-tooltip.bottom="{value: $t('FullScreen'), class: 'short-tooltip'}"/>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<script setup lang="ts">
import {ref, onMounted, defineProps, defineAsyncComponent} from "vue";
import {useUserStore} from "@/store/user";
import {META} from '@/config/Web_Const.ts';

import tingle from 'tingle.js';
import 'tingle.js/src/tingle.css';

import {marked} from 'marked';
import 'md-editor-v3/lib/style.css';

import {useDialog} from 'primevue/usedialog';
import {useI18n} from "vue-i18n";

const CommonTextEditor = defineAsyncComponent(() => import('@/components/common/CommonTextEditor.vue'));
const {t} = useI18n();
const editBlock = ref(false);
const empty = ref(false);

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  header: {
    type: String,
    required: true
  }
});

onMounted(() => {
  text.value = <string>props.text;
  text2Markdown();
})

const dialog = useDialog();
const userStore = useUserStore();
const html = ref();
const text = ref('');

const openEditDialog = () => {
  dialog.open(CommonTextEditor, {
    props: {
      header: t('Description'),
      style: {
        width: '80vw',
      },
      breakpoints: {
        '960px': '80vw',
        '640px': '70vw'
      },
      modal: true,
      closable: false
    },
    data: {
      text: text.value,
      type: META.TEXT_TYPE.DETAIL
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          text.value = options.data.text;
          text2Markdown();
        }
      }
    }
  });
}

const text2Markdown = () => {
  if (text.value == null || text.value === '') {
    html.value.innerHTML = marked('<span class="emptyInfo"><em>' + t('NoDescription') + '</em></span>');
    empty.value = true;
  } else {
    empty.value = false;
    html.value.innerHTML = marked(text.value);
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
      tingleModal.setContent(marked.parse(text.value).toString());
    }
  }
});
</script>

<style lang="scss" scoped>
@use 'tingle.js/src/tingle.css';

//.edit-btn {
//  @apply p-button-link
//  position: absolute
//  bottom: 0
//}

</style>