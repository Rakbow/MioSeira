<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useDialog} from "primevue/usedialog";
import {ItemFormConfig, META} from "@/config/Web_Const";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useToast} from "primevue/usetoast";

const {t} = useI18n();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const config: ref<ItemFormConfig> = ref();
const item = ref<any>({});
const option = ref<any>({});
const isUpdate = ref(false);
const editBlock = ref(false);
const toast = useToast();

onBeforeMount(() => {
  item.value = PublicHelper.deepCopy(dialogRef.value.data.item);
  PublicHelper.handleAttributes(item.value);
})

onMounted(() => {
  option.value = dialogRef.value.data.option;
})

const submit = async () => {
  editBlock.value = true;
  const res = await axios.post(API.UPDATE_ITEM, item.value);
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

const ISBNInterConvert = async (label, isbn) => {
  editBlock.value = true;
  const res = await axios.post(API.BOOK_GENERATE_ISBN, {label: label, isbn: isbn})
  if (res.state === axios.SUCCESS) {
    if (label === 'isbn13') item.value.ean13 = res.data;
    if (label === 'isbn10') item.value.isbn10 = res.data;
  }
  editBlock.value = false;
};

</script>

<template>
  <BlockUI :blocked="editBlock" class="p-fluid">
    <div class="field">
      <label>{{ $t('Name') }}<i class="required-label pi pi-asterisk"/></label>
      <InputText v-model="item.name"/>
    </div>
    <div class="field">
      <label>{{ $t('NameZh') }}</label>
      <InputText v-model="item.nameZh"/>
    </div>
    <div class="field">
      <label>{{ $t('NameEn') }}</label>
      <InputText v-model="item.nameEn"/>
    </div>
    <div class="formgrid grid">
      <div class="field col-3">
        <label>{{ $t('ReleaseDate') }}</label>
        <InputMask v-model="item!.releaseDate" mask="****/**/**"/>
      </div>
      <div class="field col-3">
        <label>{{ $t('ReleaseType') }}</label>
        <Select v-model="item!.releaseType" :options="option!.releaseTypeSet as any[]"
                optionLabel="label" optionValue="value"/>
      </div>
      <div class="field col-3">
        <label>{{ $t('Region') }}</label>
        <Select v-model="item.region" :options="META.RegionSet" optionLabel="label" optionValue="value">
          <template #value="slotProps">
            <span :class="`fi fi-${slotProps.value}`"/>
          </template>
          <template #option="slotProps">
            <span :class="`fi fi-${slotProps.option.value}`"/>
          </template>
        </Select>
      </div>
      <div class="field col-3">
        <label>{{ $t('ReleasePrice') }}</label>
        <InputGroup>
          <InputNumber v-model="item!.price"/>
        </InputGroup>
      </div>
    </div>

    <div v-if="item.type === META.ITEM_TYPE.ALBUM">
      <div class="formgrid grid">
        <div class="field col">
          <label>{{ $t('AlbumCatalogNo') }}</label>
          <InputText id="catalogNo" v-model.trim="item.catalogNo"/>
        </div>
        <div class="field col">
          <label>{{ $t('Barcode') }}</label>
          <InputText id="ean13" v-model.trim="item!.barcode"/>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-4">
          <label>{{ $t('AlbumFormat') }}<i class="required-label pi pi-asterisk"/></label>
          <MultiSelect v-model="item.albumFormat" :options="option.albumFormatSet"
                       optionLabel="label" optionValue="value" display="chip"/>
        </div>
        <div class="field col-4">
          <label>{{ $t('MediaFormat') }}<i class="required-label pi pi-asterisk"/></label>
          <MultiSelect v-model="item.mediaFormat" :options="option.mediaFormatSet"
                       optionLabel="label" optionValue="value" display="chip"/>
        </div>
      </div>
    </div>

    <div v-if="item.type === META.ITEM_TYPE.BOOK">
      <div class="formgrid grid">
        <div class="field col">
          <label>{{ $t('BookISBN10') }}</label>
          <InputGroup>
            <InputText v-model="item.isbn10"/>
            <Button icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('isbn10', item.ean13)"
                    v-tooltip.bottom="{value:$t('TooltipGenerateBookISBN10'), class: 'common-tooltip'}"/>
          </InputGroup>
        </div>
        <div class="field col">
          <label>{{ $t('BookISBN13') }}</label>
          <InputGroup>
            <InputText v-model="item!.barcode"/>
            <Button icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('isbn13', item.isbn10)"
                    v-tooltip.bottom="{value:$t('TooltipGenerateBookISBN13'), class: 'common-tooltip'}"/>
          </InputGroup>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label class="mb-3">{{ $t('BookType') }}<i class="required-label pi pi-asterisk"/></label>
          <Select v-model="item.bookType" :options="option.bookTypeSet"
                  optionLabel="label" optionValue="value"/>
        </div>
        <div class="field col">
          <label class="mb-3">{{ $t('Language') }}<i class="required-label pi pi-asterisk"/></label>
          <Select v-model="item.lang" :options="option.languageSet"
                  optionLabel="label" optionValue="value"/>
        </div>
      </div>
      <div class="field">
        <label>{{ $t('Summary') }}</label>
        <Textarea v-model="item.summary" rows="3" cols="20" :autoResize="true"/>
      </div>
    </div>

    <div class="field">
      <label class="mr-3">{{ $t('Bonus') }}</label>
      <ToggleButton v-model="item.hasBonus" onIcon="pi true-icon pi-check-circle"
                    offIcon="pi false-icon pi-times-circle" class="w-36"/>
    </div>
    <div class="field">
      <label>{{ $t('Remark') }}</label>
      <Textarea v-model="item!.remark" rows="3" cols="20" :autoResize="true"/>
    </div>
    <div class="grid text-end mt-3 mb-2">
      <div class="col-offset-6 col-3">
        <Button icon="pi pi-times" :label="$t('Cancel')" @click="close"
                class="p-button-text"/>
      </div>
      <div class="col-3">
        <Button icon="pi pi-save" :label="$t('Save')" @click="submit"/>
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>
.required-label {
  color: red;
  font-size: 0.8rem;
  margin-left: .5rem !important
}
</style>