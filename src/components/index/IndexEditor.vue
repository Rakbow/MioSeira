<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/utils/publicHelper";
import {API, Axios} from "@/api";
import {useOptionStore} from "@/store/modules/option";
import {EditParam} from "@/service/entityService";

const ImageEditor = defineAsyncComponent(() => import('@/components/image/EntityImageEditor.vue'));

const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const entity = ref<any>({});
const store = useOptionStore();
const param = ref(new EditParam());

onBeforeMount(() => {
  store.fetchOptions();
  entity.value = PublicHelper.deepCopy(dialogRef.value.data.entity);
})

const submit = async () => {
  param.value.block = true;
  const res = await Axios.post(API.INDEX.UPDATE, entity.value);
  if (res.success()) {
    param.value.isUpdate = true;
    close();
  }
  param.value.block = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: param.value.isUpdate,
        entity: entity.value
      }
  );
}

</script>

<template>
  <BlockUI :blocked="param.block" class="entity-editor">
    <ImageEditor :id="entity.id" :cover="entity.cover" />
    <Divider align="center"><b>{{ t('BasicInfo') }}</b></Divider>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
      <InputText size="large" v-model="entity.name"/>
    </FloatLabel>
    <FloatLabel variant="on">
      <label>{{ t('Remark') }}</label>
      <Textarea size="large" style="width: 100%" v-model="entity!.remark" rows="7" cols="20"/>
    </FloatLabel>
    <div class="dialog-action">
      <RButton icon="close" @click="close" :disabled="param.block" class="p-button-text" severity="info"/>
      <RButton icon="save" @click="submit" :disabled="param.block" class="p-button-text" />
    </div>
  </BlockUI>
</template>

<style scoped lang="scss">
.dialog-action {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0;
}
</style>