<script setup>
import { ref, onMounted, defineProps} from "vue";
import {marked} from 'marked';
import tingle from 'tingle.js';

const props = defineProps({
  description: {
    type: String,
    default: () => ('')
  }
});

onMounted(() => {
  text2marked();
})

const descHtml = ref();

const text2marked = () => {
  if (props.description != null && props.description !== "") {
    descHtml.value.innerHTML = marked.parse(props.description);
  }
};

const openTingleDescription = () => {
  descriptionModal.open();
};

const descriptionModal = new tingle.modal({
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: "Close",
  cssClass: ['tingle-markdown-body'],
  onOpen: function () {
    if (props.description != null && props.description !== "") {
      descriptionModal.setContent(marked.parse(props.description));
    }
  }
});
</script>

<template>
  <Fieldset :toggleable="true" v-if="description">
    <template #legend>
      <i class="pi iconfont icon-miaoshu"></i>
      <b>{{ webText.Description }}</b>
    </template>
    <div class="relative">
      <Button class="p-button-link absolute top-0 right-0" icon="pi pi-external-link" @click="openTingleDescription"
                v-tooltip.bottom="{value:'全屏', class: 'short-tooltip'}" />
      <article ref="descHtml" class="markdown-body" />
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