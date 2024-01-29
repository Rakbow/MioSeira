<script setup>
import {onMounted, ref, inject, getCurrentInstance} from "vue";
import {AxiosHelper as axios} from '@/utils/axiosHelper';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs';
const $const = getCurrentInstance().appContext.config.globalProperties.$const;

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
const item = ref({});
const option = ref({});

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
        <label class="font-bold block mb-2">{{ $const.Name }}<span style="color: red">*</span></label>
        <InputText v-model.trim="item.name"/>
      </div>
      <div class="field col">
        <label class="font-bold block mb-2">{{ $const.NameZh }}</label>
        <InputText v-model.trim="item.nameZh"/>
      </div>
      <div class="field col">
        <label class="font-bold block mb-2">{{ $const.NameEn }}</label>
        <InputText v-model.trim="item.nameEn"/>
      </div>
    </div>

    <div class="formgrid grid">
      <div class="field col">
        <label class="font-bold block mb-2">{{ $const.Gender }}</label>
        <Dropdown v-model="item.gender"
                  :options="option.genderSet" optionLabel="label" optionValue="value"
                  :placeholder="$const.Unknown" class="w-full md:w-14rem"/>
      </div>
      <div class="field col">
        <label class="font-bold block mb-2">{{ $const.BirthDate }}</label>
        <InputText v-model.trim="item.birthDate" />
      </div>
    </div>

    <div class="p-fluid">
      <label class="font-bold block mb-2">{{ $const.Aliases }}</label>
      <Chips v-model="item.aliases" separator=","  />
    </div>

    <div class="field">
      <label>{{ $const.Remark }}</label>
      <Textarea v-model="item.remark" rows="3" cols="20" autoResize/>
    </div>
    <div class="grid text-end mt-3 mb-2">
      <div class="col-offset-6 col-3">
        <Button icon="pi pi-times" :label="$const.Cancel" @click="close"
                class="p-button-text" />
      </div>
      <div class="col-3">
        <Button icon="pi pi-save" :label="$const.Save" @click="submit" />
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>