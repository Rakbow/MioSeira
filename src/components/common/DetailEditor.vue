<template>
  <BlockUI :blocked="editBlock">
    <MdEditor v-model="text" preview-theme="github"/>
    <div class="text-end mt-3 mb-2">
      <Button size="large" icon="pi pi-times" :label="t('Cancel')" @click="close"
              class="p-button-text"/>
      <Button size="large" icon="pi pi-save" :label="t('Save')" @click="submit"/>
    </div>
  </BlockUI>
</template>

<script setup lang="ts">
import {MdEditor} from "md-editor-v3";
import {onMounted, ref, inject, onBeforeMount} from "vue";
import {PublicHelper} from '@/toolkit/publicHelper';
import {useToast} from "primevue/usetoast";
import { API, Axios } from '@/api';
import {EntityInfo} from '@/config/Web_Const';
import { useRoute } from 'vue-router';
import {useI18n} from "vue-i18n";
import {PToast} from "@/logic/frame";

const {t} = useI18n();
const toast = useToast();
const dialogRef = inject<any>("dialogRef");
const text = ref('');
const type = ref('');
// const emit = defineEmits(['update']);
const isUpdate = ref(false);
const route = useRoute();
const entityInfo = ref<EntityInfo>();

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted(() => {
  text.value = dialogRef.value.data.text;
  type.value = dialogRef.value.data.type;
  // loadImages();
});

const editBlock = ref(false);

const submit = () => {
  editBlock.value = true;
  let json = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    text: text.value
  };
  Axios.post(API.ENTITY_UPDATE_DETAIL, json)
      .then(res => {
        if (res.success()) {
          toast.add(new PToast().success(res.message));
          isUpdate.value = true;
          close();
        } else {
          toast.add(new PToast().error(res.message));
        }
        editBlock.value = false;
      })
}

const close = () => {
  // emit('update', isUpdate.value)
  dialogRef.value.close(
      {
        isUpdate: isUpdate.value,
        text: text.value
      }
  );
}

</script>

<style scoped lang="scss">

</style>