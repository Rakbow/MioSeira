<script setup lang="ts">
import {onMounted, ref, inject} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper.ts';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs.ts';
import {useI18n} from "vue-i18n";

onMounted(() => {
  item.value = JSON.parse(JSON.stringify(dialogRef.value.data.item));
  option.value = dialogRef.value.data.option;
  init();
});

const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const isUpdate = ref(false);
const editBlock = ref(false);
const item = ref<any>({});
const option = ref({});
const {t} = useI18n();

const init = () => {
  item.value.gender = item.value.gender.value;
}

const submit = () => {
  editBlock.value = true;
  axios.post(API.UPDATE_PERSON, item.value)
      .then(res => {
        if (res.state === axios.SUCCESS) {
          toast.add({severity: 'success', detail: res.message, life: 3000});
          isUpdate.value = true;
          close();
        } else {
          toast.add({severity: 'error', detail: res.message, life: 3000});
        }
        editBlock.value = false;
      })
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
  <Toast/>
  <BlockUI :blocked="editBlock" class="p-fluid">
    <div class="formgrid grid">
      <div class="field col">
        <label class="font-bold block mb-2">{{ $t('Name') }}<span style="color: red">*</span></label>
        <InputText v-model.trim="item.name"/>
      </div>
      <div class="field col">
        <label class="font-bold block mb-2">{{ $t('NameZh') }}</label>
        <InputText v-model.trim="item.nameZh"/>
      </div>
      <div class="field col">
        <label class="font-bold block mb-2">{{ $t('NameEn') }}</label>
        <InputText v-model.trim="item.nameEn"/>
      </div>
    </div>

    <div class="formgrid grid">
      <div class="field col">
        <label class="font-bold block mb-2">{{ $t('Gender')}}</label>
        <Select v-model="item.gender"
                  :options="option.genderSet" optionLabel="label" optionValue="value"
                  :placeholder="$t('Unknown')" class="w-full md:w-14rem"/>
      </div>
      <div class="field col">
        <label class="font-bold block mb-2">{{ $t('BirthDate') }}</label>
        <InputMask v-model.trim="item!.birthDate" mask="****/**/**" />
      </div>
    </div>

    <div class="p-fluid">
      <label class="font-bold block mb-2">{{ $t('Aliases') }}</label>
      <InputChips v-model="item.aliases" separator=","  />
    </div>

    <div class="field">
      <label>{{ $t('Remark') }}</label>
      <Textarea v-model="item!.remark" rows="3" cols="20" autoResize/>
    </div>
    <div class="grid text-end mt-3 mb-2">
      <div class="col-offset-6 col-3">
        <Button icon="pi pi-times" :label="$t('Cancel')" @click="close"
                class="p-button-text" />
      </div>
      <div class="col-3">
        <Button icon="pi pi-save" :label="$t('Save')" @click="submit" />
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>