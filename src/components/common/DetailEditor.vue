<template>
  <BlockUI :blocked="param.block">
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
import {inject, onMounted, ref} from "vue";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {bs} from '@/service/baseService';
import {EditParam} from "@/service/entityService";

const {t} = useI18n();
const param = ref(new EditParam())
const dialogRef = inject<any>("dialogRef");
const text = ref('');
const type = ref('');
const entity = inject<Entity>('entity')!;

onMounted(() => {
  text.value = dialogRef.value.data.text;
  type.value = dialogRef.value.data.type;
});

const submit = async () => {
  param.value.block = true;
  const res = await Axios.post(API.ENTITY_UPDATE_DETAIL, {
    entityType: entity!.type,
    entityId: entity!.id,
    text: text.value
  });
  if (res.success()) {
    bs!.toast.success(res.message);
    param.value.isUpdate = true;
    close();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.block = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: param.value.isUpdate,
        text: text.value
      }
  );
}

</script>

<style scoped lang="scss">

</style>