<template>
  <BlockUI :blocked="editBlock" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-align-left"/>
        <b>{{ props.header }}</b>
      </template>
      <div class="relative">
        <div v-if="userStore.user">
          <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                  @click="openEditDialog" style="right: 5%"
                  v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}">
            <template #icon>
              <span class="material-symbols-outlined">edit_note</span>
            </template>
          </Button>
        </div>
        <Button v-if="!empty" class="p-button-link absolute top-0 right-0" icon="pi pi-external-link"
                @click="openTextTingle"
                v-tooltip.bottom="{value: $t('FullScreen'), class: 'short-tooltip'}"/>
        <article ref="html" class="entity-detail-markdown"/>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<script setup lang="ts">
import {ref, onMounted, defineProps, defineAsyncComponent} from "vue";
import {useUserStore} from "@/store/user.ts";
import {META} from '@/config/Web_Const.ts';
import {marked} from 'marked';
import tingle from 'tingle.js';
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
</style>