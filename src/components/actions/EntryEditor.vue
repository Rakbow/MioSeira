<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/toolkit/publicHelper";
import {API, Axios} from "@/api";
import {useOptionStore} from "@/store/modules/option";
import {bs} from '@/service/baseService';
import {EditParam} from "@/service/entityService";

const ImageEditor = defineAsyncComponent(() => import('@/components/image/EntryImageEditor.vue'));

const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const entry = ref<any>({});
const store = useOptionStore();
const param = ref(new EditParam());

onBeforeMount(() => {
  store.fetchOptions();
  entry.value = PublicHelper.deepCopy(dialogRef.value.data.entry);
})

const submit = async () => {
  param.value.block = true;
  const res = await Axios.post(API.ENTRY_UPDATE, entry.value);
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
        entry: entry.value
      }
  );
}

</script>

<template>
  <BlockUI :blocked="param.block" class="entity-editor">

    <Divider align="center"><b>{{ t('Images') }}</b></Divider>
    <ImageEditor :id="entry.id" :cover="entry.cover" :thumb="entry.thumb" />

    <Divider align="center"><b>{{ t('BasicInfo') }}</b></Divider>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
      <InputText size="large" v-model="entry.name"/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('NameEn') }}</label>
      <InputText size="large" v-model="entry.nameEn"/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('NameZh') }}</label>
      <InputText size="large" v-model="entry.nameZh"/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Aliases') }}</label>
      <AutoComplete size="large" v-model="entry.aliases" separator="," multiple :typeahead="false"/>
    </FloatLabel>

    <div class="grid" v-if="![$const.ENTRY_TYPE.CLASSIFICATION, $const.ENTRY_TYPE.MATERIAL].includes(entry.type.value)">
      <FloatLabel variant="on">
        <label>{{ t('Date') }}</label>
        <InputText size="large" v-model="entry.date"/>
      </FloatLabel>
      <FloatLabel variant="on">
        <template v-if="[$const.ENTRY_TYPE.PERSON, $const.ENTRY_TYPE.CHARACTER].includes(entry.type.value)">
          <label>{{ t('Gender') }}</label>
          <Select v-model="entry.gender" :options="store.options.genderSet" filled
                  size="large" optionLabel="label"/>
        </template>
        <template v-if="entry.type.value === $const.ENTRY_TYPE.PRODUCT">
          <label>{{ t('Category') }}</label>
          <Select v-model="entry.subType" :options="store.options.entrySubTypeSet" disabled filled
                  size="large" optionLabel="label"/>
        </template>
      </FloatLabel>
    </div>

    <Divider align="center"><b>{{ t('AdvanceInfo') }}</b></Divider>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Link') }}</label>
      <AutoComplete size="large" v-model="entry.links" separator="," multiple :typeahead="false"/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Remark') }}</label>
      <Textarea size="large" v-model="entry!.remark" rows="4" cols="20"/>
    </FloatLabel>
    <Button icon="pi pi-times" @click="close" :disabled="param.block"
            class="p-button-text"/>
    <Button icon="pi pi-save" @click="submit" :disabled="param.block" />
  </BlockUI>
</template>

<style scoped lang="scss">
</style>