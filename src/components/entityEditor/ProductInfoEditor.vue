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

const {t} = useI18n();
const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const isUpdate = ref(false);
const editBlock = ref(false);
const item = ref<any>({});
const option = ref({});

const init = () => {
  item.value.category = item.value.category.value;
  item.value.franchise = item.value.franchise.value;
}

const submit = () => {
  editBlock.value = true;
  axios.post(API.UPDATE_PRODUCT, item.value)
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
    <div class="field col">
      <label>{{$t('Name')}}<span style="color: red">*</span></label>
      <InputText id="name" v-model="item.name" />
    </div>
    <div class="field col">
      <label>{{$t('NameEn')}}<span style="color: red">*</span></label>
      <InputText id="nameEn" v-model="item.nameEn" />
    </div>
    <div class="field col">
      <label>{{$t('NameZh')}}<span style="color: red">*</span></label>
      <InputText id="nameZh" v-model="item.nameZh" />
    </div>
    <div class="formgrid grid">
      <div class="field col-6">
        <label>{{$t('ReleaseDate')}}<span style="color: red">*</span></label>
        <DatePicker id="releaseDate" v-model="item!.releaseDate" dateFormat="yy/mm/dd"
                  :showButtonBar="true" :showIcon="true" />
      </div>
      <div class="field col-6">
        <label>{{$t('Category')}}</label>
        <Select v-model="item.category" :options="option.productCategorySet"
                  optionLabel="label" optionValue="value" />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col-6">
        <label>{{$t('Franchise')}}</label>
        <Select v-model="item.franchise" :options="option.franchiseSet"
                  optionLabel="label" optionValue="value" />
      </div>
    </div>
    <div class="field">
      <label>{{$t('Remark')}}</label>
      <Textarea id="remark" v-model="item!.remark" rows="3" cols="20" :autoResize="true" />
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