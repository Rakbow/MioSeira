<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useDialog} from "primevue/usedialog";
import {ItemFormConfig, META} from "@/config/Web_Const";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useToast} from "primevue/usetoast";
import {useOptionsStore} from "@/store/entityOptions";

const {t} = useI18n();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const config: ref<ItemFormConfig> = ref();
const entry = ref<any>({});
const option = ref<any>({});
const isUpdate = ref(false);
const editBlock = ref(false);
const toast = useToast();
const optionsStore = useOptionsStore();

onBeforeMount(async () => {
  await optionsStore.fetchOptions();
  option.value = optionsStore.options;
  entry.value = PublicHelper.deepCopy(dialogRef.value.data.entry);
  entry.value.entityType = dialogRef.value.data.type;
  PublicHelper.handleAttributes(entry.value);
})

onMounted(() => {
})

const submit = async () => {
  editBlock.value = true;
  const res = await axios.post(API.UPDATE_ENTRY, entry.value);
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
        <InputText size="small" v-model="entry.name" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('NameEn') }}</label>
        <InputText size="small" v-model="entry.nameEn" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('NameZh') }}</label>
        <InputText size="small" v-model="entry.nameZh" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Aliases') }}</label>
        <AutoComplete size="small" v-model="entry.aliases" separator="," multiple :typeahead="false" class="static w-full"/>
      </FloatLabel>
    </div>

    <Divider align="center"><b>{{ $t('AdvanceInfo') }}</b></Divider>
    <div class="formgrid grid" v-if="entry.entityType === META.ENTITY.PRODUCT">
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('Date') }}</label>
          <InputText size="small" v-model="entry.date" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('Category') }}</label>
          <Select v-model="entry.type" :options="option!.productTypeSet as any[]"
                  size="small" optionLabel="label" optionValue="value" class="static w-full"/>
        </FloatLabel>
      </div>
    </div>

    <div class="formgrid grid" v-if="entry.entityType === META.ENTITY.CHARACTER || entry.entityType === META.ENTITY.PERSON">
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('BirthDate') }}</label>
          <InputText size="small" v-model="entry.birthDate" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('Gender') }}</label>
          <Select v-model="entry.gender" :options="option.genderSet"
                  size="small" optionLabel="label" optionValue="value" class="static w-full"/>
        </FloatLabel>
      </div>
    </div>

    <div class="formgrid grid" v-if="entry.entityType === META.ENTITY.SUBJECT">
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('Date') }}</label>
          <InputText size="small" v-model="entry.date" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('Category') }}</label>
          <Select v-model="entry.type" :options="option!.subjectTypeSet as any[]"
                  size="small" optionLabel="label" optionValue="value" class="static w-full"/>
        </FloatLabel>
      </div>
    </div>

    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Link') }}</label>
        <AutoComplete size="small" v-model="entry.links" separator="," multiple :typeahead="false" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Remark') }}</label>
        <Textarea size="small" v-model="entry!.remark" rows="4" cols="20" class="static w-full"/>
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