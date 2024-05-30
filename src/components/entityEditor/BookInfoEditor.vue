<script setup lang="ts">
import {onMounted, ref, inject} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper.ts';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs.ts';
import "/node_modules/flag-icons/css/flag-icons.min.css";

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

const init = () => {
  item.value.bookType = item.value.bookType.value;
  item.value.region = item.value.region.value;
  item.value.lang = item.value.lang.value;
}

const submit = () => {
  editBlock.value = true;
  axios.post(API.UPDATE_ITEM, item.value)
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

const ISBNInterConvert = (label, isbn) => {
  editBlock.value = true;
  let json = {
    label: label,
    isbn: isbn
  };
  axios.post(API.BOOK_GENERATE_ISBN, json)
      .then(res => {
        if(res.state === axios.SUCCESS) {
          if(label === 'isbn13') {
            item.value.ean13 = res.data;
          }
          if(label === 'isbn10') {
            item.value.isbn10 = res.data;
          }
        }
        editBlock.value = false;
      })
};

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
        <label>{{ $t('BookISBN10') }}<span style="color: red">*</span></label>
        <InputGroup>
          <InputText v-model="item.isbn10" />
          <Button icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('isbn10', item.ean13)"
                    v-tooltip.bottom="{value:$t('TooltipGenerateBookISBN10'), class: 'common-tooltip'}" />
        </InputGroup>
      </div>
      <div class="field col">
        <label>{{ $t('BookISBN13') }}<span style="color: red">*</span></label>
        <InputGroup>
          <InputText v-model="item.ean13" />
          <Button icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('isbn13', item.isbn10)"
                    v-tooltip.bottom="{value:$t('TooltipGenerateBookISBN13'), class: 'common-tooltip'}" />
        </InputGroup>
      </div>
    </div>
    <div class="field">
      <label>{{ $t('BookTitle') }}<span style="color: red">*</span></label>
      <InputText v-model="item.name" />
    </div>
    <div class="field">
      <label>{{ $t('BookChineseTitle') }}</label>
      <InputText v-model="item.nameZh" />
    </div>
    <div class="field">
      <label>{{ $t('BookEnglishTitle') }}</label>
      <InputText v-model="item.nameEn" />
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label class="mb-3">{{ $t('BookType') }}<span style="color: red">*</span></label>
        <Select v-model="item.bookType" :options="option.bookTypeSet"
                    optionLabel="label" optionValue="value" />
      </div>
      <div class="field col">
        <label class="mb-3">{{ $t('Region') }}<span style="color: red">*</span></label>
        <Select v-model="item.region" :options="option.regionSet" :filter="true"
                    :showClear="true" optionLabel="label" optionValue="value">
          <template #value="slotProps">
            <div class="country-item" v-if="slotProps.value">
              <span :class="'fi fi-' + slotProps.value"></span>
              <div class="ml-2">{{ (slotProps as any).label }}</div>
            </div>
            <span v-else>{{ $t('PlaceholderRegion') }}</span>
          </template>
          <template #option="slotProps">
            <div class="country-item">
              <span :class="'fi fi-' + slotProps.option.value"></span>
              <div class="ml-2">{{slotProps.option.label}}</div>
            </div>
          </template>
        </Select>
      </div>
      <div class="field col">
        <label class="mb-3">{{ $t('Language') }}<span style="color: red">*</span></label>
        <Select v-model="item.lang" :options="option.languageSet"
                  optionLabel="label" optionValue="value" />
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <div class="col-12">
          <label class="mb-3">{{ $t('Bonus') }}</label>
        </div>
        <div class="col-12 mt-4">
          <ToggleSwitch v-model="item.hasBonus" />
        </div>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col-6">
        <label>{{ $t('PublishDate') }}<span style="color: red">*</span></label>
        <InputMask v-model="item!.releaseDate" mask="****/**/**" />
      </div>
      <div class="field col">
        <label>{{ $t('PublishPrice') }}</label>
        <InputNumber v-model="item!.price" />
      </div>
      <div class="field col-3">
        <label>{{ $t('CurrencyUnit') }}</label>
        <Select v-model="item.currency" :options="option.currencySet"
                  optionLabel="label" optionValue="value" :placeholder=" $t('PlaceholderCurrencyUnit') " />
      </div>
    </div>
    <div class="field">
      <label>{{ $t('Summary') }}</label>
      <Textarea v-model="item.summary" rows="3" cols="20" :autoResize="true" />
    </div>
    <div class="field">
      <label>{{ $t('Remark') }}</label>
      <Textarea v-model="item!.remark" rows="3" cols="20" :autoResize="true" />
    </div>
    <div class="grid text-end mt-3 mb-2">
      <div class="col-offset-6 col-3">
        <Button icon="pi pi-times" :label=" $t('Cancel') " @click="close"
                class="p-button-text" />
      </div>
      <div class="col-3">
        <Button icon="pi pi-save" :label=" $t('Save')" @click="submit" />
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>