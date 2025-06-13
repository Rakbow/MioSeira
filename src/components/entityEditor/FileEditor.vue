<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useToast} from "primevue/usetoast";
import {META} from "@/config/Web_Const";

const {t} = useI18n();
const dialogRef = inject("dialogRef");
const entity = ref<any>({});
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
    toast.add({severity: 'success', detail: res.message, life: 3000});
    isUpdate.value = true;
    close();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
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
  <BlockUI :blocked="editBlock" class="form-container">
    <Divider align="center"><b>{{ $t('BasicInfo') }}</b></Divider>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Name') }}<i class="required-label pi pi-asterisk"/></label>
        <InputGroup>
          <InputText size="small" v-model="entity.name" class="static w-full"/>
          <InputGroupAddon>{{ entity.extension }}</InputGroupAddon>
        </InputGroup>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Size') }}<i class="required-label pi pi-asterisk"/></label>
        <InputText size="small" v-model="entity.size" class="static w-full" disabled/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Path') }}</label>
        <InputText size="small" v-model="entity.path" class="static w-full" disabled/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Remark') }}</label>
        <Textarea size="small" v-model="entity!.remark" rows="4" cols="20" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="relative">
      <div class="bottom-0 right-0">
        <Button icon="pi pi-times" :label="$t('Cancel')" @click="close"
                class="p-button-text"/>
        <Button icon="pi pi-save" :label="$t('Save')" @click="submit"/>
      </div>
    </div>
  </BlockUI>
</template>

<style scoped lang="scss">
@use "@/assets/entity-manager";
</style>