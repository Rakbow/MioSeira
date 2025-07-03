<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {META} from "@/config/Web_Const";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useToast} from "primevue/usetoast";
import {useEntityStore} from "@/logic/entityService";
const ImageEditor = defineAsyncComponent(() => import('@/components/image/EntryImageEditor.vue'));

const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const entry = ref<any>({});
const isUpdate = ref(false);
const block = ref(false);
const toast = useToast();
ref([]);
const store = useEntityStore();

onBeforeMount(() => {
  store.fetchOptions();
  entry.value = PublicHelper.deepCopy(dialogRef.value.data.entry);
  PublicHelper.handleAttributes(entry.value);
})

onMounted(() => {
})

const submit = async () => {
  block.value = true;
  const res = await axios.post(API.ENTRY_UPDATE, entry.value);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    isUpdate.value = true;
    close();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  block.value = false;
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
  <BlockUI :blocked="block" class="entity-editor">

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

    <div class="grid" v-if="entry.type !== META.ENTRY_TYPE.CLASSIFICATION && entry.type !== META.ENTRY_TYPE.MATERIAL">
      <FloatLabel variant="on">
        <label>{{ t('Date') }}</label>
        <InputText size="large" v-model="entry.date"/>
      </FloatLabel>
      <FloatLabel variant="on">
        <template v-if="entry.type === META.ENTRY_TYPE.CHARACTER || entry.type === META.ENTRY_TYPE.PERSON">
          <label>{{ t('Gender') }}</label>
          <Select v-model="entry.gender" :options="store.options.genderSet"
                  size="large" optionLabel="label" optionValue="value"/>

        </template>
        <template v-if="entry.type === META.ENTRY_TYPE.PRODUCT">
          <label>{{ t('Category') }}</label>
          <Select v-model="entry.type" :options="store.options.entrySubTypeSet" disabled
                  size="large" optionLabel="label" optionValue="value"/>
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
    <Button icon="pi pi-times" @click="close" :disabled="block"
            class="p-button-text"/>
    <Button icon="pi pi-save" @click="submit" :disabled="block" />
  </BlockUI>
</template>

<style scoped lang="scss">
</style>