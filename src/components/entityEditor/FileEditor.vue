<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useToast} from "primevue/usetoast";
import {PToast} from "@/logic/frame";

const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const entity = ref<any>();
const isUpdate = ref(false);
const editBlock = ref(false);
const toast = useToast();

onBeforeMount(async () => {
  entity.value = PublicHelper.deepCopy(dialogRef.value.data.entity);
  entity.value.name = entity.value.name.replace(`.${entity.value.extension}`, "")
})

onMounted(() => {
})

const submit = async () => {
  editBlock.value = true;
  entity.value.name = `${entity.value.name}.${entity.value.extension}`;
  const res = await axios.post(API.FILE_UPDATE, entity.value);
  if (res.state === axios.SUCCESS) {
    toast.add(new PToast().success(res.message));
    isUpdate.value = true;
    close();
  } else {
    toast.add(new PToast().error(res.message));
  }
  editBlock.value = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: isUpdate.value
      }
  );
}

</script>

<template>
  <BlockUI :blocked="editBlock" class="entity-editor">
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