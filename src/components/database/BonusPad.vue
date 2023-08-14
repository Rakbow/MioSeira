<script setup>
import { ref, onMounted, defineProps} from "vue";
import {marked} from 'marked';
import tingle from 'tingle.js';

const props = defineProps({
  text: {
    type: String,
    default: () => ('')
  }
});

const html = ref();

onMounted(() => {
  text2Markdown();
})

const text2Markdown = () => {
  if (props.text != null && props.text !== "") {
    html.value.innerHTML = marked.parse(props.text);
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

<template>
  <Fieldset :toggleable="true">
    <template #legend>
      <i class="pi iconfont icon-gift"></i>
      <b>{{ webText.Bonus }}</b>
    </template>
    <div class="relative">
      <Button class="p-button-link absolute top-0 right-0" icon="pi pi-external-link" @click="openTextTingle"
                v-tooltip.bottom="{value:'全屏', class: 'short-tooltip'}" />
      <article ref="html" class="markdown-body" />
    </div>
  </Fieldset>
</template>

<style scoped>
@import 'tingle.js/src/tingle.css';

article {
  width: 100%;
  font-size: 13px;
}
</style>