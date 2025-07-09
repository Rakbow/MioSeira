<template>
  <BlockUI :blocked="param.block" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-align-left"/>
        <b>{{ t('Description') }}</b>
      </template>
      <div class="entity-fieldset-actions">
        <RButton v-if="!empty"
                 @click="openTextTingle" icon="arrows_output" tooltip="FullScreen"/>
        <RButton v-if="userStore.user && userStore.user.type > 1"
                 @click="openEditDialog" icon="edit_square" tooltip="Edit"/>
      </div>
      <div class="relative">
        <article style="width: 90%;font-size: 1.2rem" ref="html" class="entity-detail-markdown"/>
        <Button v-if="text.length > maxLength" @click="toggleCollapse"
                class="p-button-link" size="small" style="font-size: 1.1rem">
          <span v-if="isCollapsed">{{t('Expand')}}&nbsp;<i class="pi pi-sort-down-fill" style="font-size: 1.1rem" /></span>
          <span v-else>{{t('Collapse')}}&nbsp;<i class="pi pi-sort-up-fill" style="font-size: 1.1rem" /></span>
        </Button>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<script setup lang="ts">
import {computed, defineAsyncComponent, defineProps, onMounted, ref} from "vue";
import {useUserStore} from "@/store/modules/user";
import tingle from 'tingle.js';
import 'tingle.js/src/tingle.css';
import {marked} from 'marked';
import 'md-editor-v3/lib/style.css';
import {useI18n} from "vue-i18n";
import {EditParam} from "@/service/entityService";

const CommonTextEditor = defineAsyncComponent(() => import('@/components/common/DetailEditor.vue'));
const {t} = useI18n();
const param = ref(new EditParam());
const empty = ref(false);
const maxLength = ref(400);
const isCollapsed = ref(true);
// 可见行
const visibleText = computed(() => {
  return isCollapsed.value ? text.value.slice(0, maxLength.value) : text.value;
});
// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  text2Markdown();
};

const props = defineProps({
  text: {
    type: String,
    required: true
  }
});

onMounted(() => {
  text.value = <string>props.text;
  text2Markdown();
})

const userStore = useUserStore();
const html = ref();
const text = ref('');

const openEditDialog = () => {
  bs!.dialog.open(CommonTextEditor, {
    props: {
      header: t('Description'),
      style: {
        width: '100rem'
      },
      modal: true,
      closable: true
    },
    data: {
      text: text.value
    },
    onClose: (options: any) => {
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
  if (visibleText.value == null || visibleText.value === '') {
    html.value.innerHTML = marked(`<span class="empty-search-result">${t('NoDescription')}</span>`);
    empty.value = true;
  } else {
    empty.value = false;
    html.value.innerHTML = marked(visibleText.value);
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
    if (text.value && text.value !== "") {
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