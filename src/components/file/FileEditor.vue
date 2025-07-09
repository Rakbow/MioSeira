<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/toolkit/publicHelper";
import {API, Axios} from "@/api";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const entity = ref<any>();
const param = ref(new EditParam());

onBeforeMount(async () => {
  entity.value = PublicHelper.deepCopy(dialogRef.value.data.entity);
  entity.value.name = entity.value.name.replace(`.${entity.value.extension}`, "")
})

onMounted(() => {
})

const submit = async () => {
  param.value.block = true;
  entity.value.name = `${entity.value.name}.${entity.value.extension}`;
  const res = await Axios.post(API.FILE_UPDATE, entity.value);
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
        isUpdate: param.value.isUpdate
      }
  );
}

</script>

<template>
  <BlockUI :blocked="param.block" class="entity-editor">
    <Divider align="center"><b>{{ t('BasicInfo') }}</b></Divider>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
      <InputGroup>
        <InputText v-model="entity.name"/>
        <InputGroupAddon>{{ entity!.extension }}</InputGroupAddon>
      </InputGroup>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Size') }}<i class="required-label pi pi-asterisk"/></label>
      <InputText v-model="entity.size" disabled/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Path') }}</label>
      <InputText v-model="entity.path" disabled/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Remark') }}</label>
      <Textarea v-model="entity!.remark" rows="4" cols="20"/>
    </FloatLabel>
    <Button icon="pi pi-times" :label="t('Cancel')" @click="close" variant="text"/>
    <Button icon="pi pi-save" :label="t('Save')" @click="submit"/>
  </BlockUI>
</template>

<style scoped lang="scss">
</style>