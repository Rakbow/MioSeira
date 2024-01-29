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
  item.value.publishFormat = item.value.publishFormat.map(i => i.value);
  item.value.mediaFormat = item.value.mediaFormat.map(i => i.value);
  item.value.albumFormat = item.value.albumFormat.map(i => i.value);
}

const submit = () => {
  editBlock.value = true;
  axios.post(API.UPDATE_ALBUM, item.value)
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
        <label>{{$const.Name}}<span style="color: red">*</span></label>
        <InputText id="name" v-model="item.name" />
      </div>
      <div class="field col">
        <label>{{$const.NameEn}}</label>
        <InputText id="nameEn" v-model="item.nameEn" />
      </div>
      <div class="field col">
        <label>{{$const.NameZh}}</label>
        <InputText id="nameZh" v-model="item.nameZh" />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label>{{$const.AlbumCatalogNo}}</label>
        <InputText id="catalogNo" v-model.trim="item.catalogNo" />
      </div>
      <div class="field col">
        <label>{{$const.Barcode}}</label>
        <InputText id="barcode" v-model.trim="item.barcode" />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col-6">
        <label>{{$const.ReleaseDate}}<span style="color: red">*</span></label>
        <Calendar id="releaseDate" v-model="item.releaseDate" dateFormat="yy/mm/dd"
                    :showButtonBar="true"
                    :showIcon="true" />
      </div>
      <div class="field col-3">
        <label>{{$const.ReleasePrice}}</label>
        <InputNumber id="price" v-model="item.price" />
      </div>
      <div class="field col-3">
        <label>{{$const.CurrencyUnit}}</label>
        <Dropdown v-model="item.currencyUnit" :options="$const.CurrencyUnitSet"
                    optionLabel="label" optionValue="value" :placeholder="$const.PlaceholderCurrencyUnit" />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <div class="col-12">
          <label class="mb-3">{{$const.Bonus}}</label>
        </div>
        <div class="col-12 mt-4">
          <InputSwitch v-model="item.hasBonus" :trueValue="1" :falseValue="0" />
        </div>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col-4">
        <label class="mb-3">{{$const.PublishFormat}}<span
            style="color: red">*</span></label>
        <MultiSelect id="publishFormat" v-model="item.publishFormat" :options="option.publishFormatSet"
                     optionLabel="label" optionValue="value" display="chip" />
      </div>
      <div class="field col-4">
        <label class="mb-3">{{$const.AlbumFormat}}<span style="color: red">*</span></label>
        <MultiSelect id="albumFormat" v-model="item.albumFormat" :options="option.albumFormatSet"
                     optionLabel="label" optionValue="value" display="chip" />
      </div>
      <div class="field col-4">
        <label class="mb-3">{{$const.MediaFormat}}<span style="color: red">*</span></label>
        <MultiSelect id="mediaFormat" v-model="item.mediaFormat" :options="option.mediaFormatSet"
                     optionLabel="label" optionValue="value" display="chip" />
      </div>
    </div>
    <div class="field">
      <label>{{$const.Remark}}</label>
      <Textarea id="remark" v-model="item.remark" rows="3" cols="20" :autoResize="true" />
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