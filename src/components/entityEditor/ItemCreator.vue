<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useDialog} from "primevue/usedialog";
import {ItemFormConfig, META} from "@/config/Web_Const";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useToast} from "primevue/usetoast";
import {useOptionsStore} from "@/store/entityOptions";
import {ItemSpecParams, parseItemSpecParams} from "@/logic/itemService";

const itemSpec = ref('');
const itemType = ref();
const {t} = useI18n();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const config: ref<ItemFormConfig> = ref();
const item = ref<any>({

  releaseType: 0,
  price: 0,
  region: 'jp',

  pages: 0,
  discs: 0,
  tracks: 0,
  runTime: 0,

  albumFormat: [1],
  mediaFormat: [1],
  bookType: 0,
  lang: 'ja-JP',
});
const option = ref<any>({});
const isUpdate = ref(false);
const editBlock = ref(false);
const toast = useToast();
const optionsStore = useOptionsStore();

onBeforeMount(async () => {
  await optionsStore.fetchOptions();
  option.value = optionsStore.options;
  item.value.type = optionsStore.current;
  itemType.value = META.ITEM_TYPE_SET[item.value.type-1];
})

const submit = async () => {
  editBlock.value = true;
  const res = await axios.post(API.ADD_ITEM, item.value);
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
    if (label === 'isbn13') item.value.barcode = res.data;
    if (label === 'isbn10') item.value.isbn10 = res.data;
  }
  editBlock.value = false;
};

const switchItemType = (ev) => {
  item.value.type = parseInt(itemType.value.value);
}

const parseItemSpec = () => {
  let res: ItemSpecParams = parseItemSpecParams(itemSpec.value);
  item.value.weight = res.weight;
  item.value.width = res.width;
  item.value.length = res.length;
  item.value.height = res.height;
}

</script>

<template>
  <BlockUI :blocked="editBlock" class="form-container">
    <SelectButton size="small" v-model="itemType" :options="META.ITEM_TYPE_SET" @change="switchItemType($event)"
                  optionLabel="value" dataKey="value" ariaLabelledby="custom" optionDisabled="disabled">
      <template #option="slotProps">
        <span class="material-symbols-outlined">{{ slotProps.option.icon }}</span>
      </template>
    </SelectButton>
    <Divider align="center"><b>{{ $t('BasicInfo') }}</b></Divider>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Name') }}<i class="required-label pi pi-asterisk"/></label>
        <InputText size="small" v-model="item.name" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Aliases') }}</label>
        <AutoComplete size="small" v-model="item.aliases" separator="," multiple :typeahead="false" class="static w-full"/>
      </FloatLabel>
    </div>

    <div class="formgrid grid">
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('ReleaseDate') }}</label>
          <InputMask size="small" v-model="item!.releaseDate" mask="****/**/**" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('ReleaseType') }}</label>
          <Select v-model="item!.releaseType" :options="option!.releaseTypeSet as any[]"
                  size="small" optionLabel="label" optionValue="value" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('ReleasePrice') }}</label>
          <InputNumber size="small" v-model="item!.price" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('Region') }}</label>
          <Select v-model="item.region" :options="META.RegionSet" optionLabel="label"
                  size="small" optionValue="value" class="static w-full">
            <template #value="slotProps">
              <span :class="`fi fi-${slotProps.value}`"/>
            </template>
            <template #option="slotProps">
              <span :class="`fi fi-${slotProps.option.value}`"/>
            </template>
          </Select>
        </FloatLabel>
      </div>
      <div class="field col">
        <ToggleButton size="small" v-model="item.bonus"
                      onIcon="pi true-icon pi-check-circle" :onLabel="$t('BonusInclusion')"
                      offIcon="pi false-icon pi-times-circle" :offLabel="$t('BonusExclusion')"/>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <FloatLabel variant="on">
          <label v-if="item.type !== META.ITEM_TYPE.BOOK">{{ $t('Barcode') }}</label>
          <label v-if="item.type === META.ITEM_TYPE.BOOK">{{ $t('BookISBN13') }}</label>
          <InputText size="small" v-if="item.type !== META.ITEM_TYPE.BOOK" v-model="item!.barcode" class="static w-full"/>
          <InputGroup v-else class="static w-full">
            <InputText size="small" v-model="item!.barcode"/>
            <Button size="small" icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('isbn13', item.barcode)" :title="$t('TooltipGenerateBookISBN13')"/>
          </InputGroup>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('CatalogId') }}</label>
          <InputText size="small" v-model="item.catalogId" class="static w-full" :disabled="item.type == META.ITEM_TYPE.BOOK"/>
        </FloatLabel>
      </div>
    </div>

    <Divider/>
    <div v-if="item.type === META.ITEM_TYPE.ALBUM">
      <div class="formgrid grid">
        <div class="field col">
          <FloatLabel variant="on">
            <label>{{ $t('AlbumFormat') }}<i class="required-label pi pi-asterisk"/></label>
            <MultiSelect showClear size="small" v-model="item.albumFormat" :options="option.albumFormatSet"
                         optionLabel="label" optionValue="value" display="chip" class="static w-full"/>
          </FloatLabel>
        </div>
        <div class="field col">
          <FloatLabel variant="on">
            <label>{{ $t('MediaFormat') }}<i class="required-label pi pi-asterisk"/></label>
            <MultiSelect showClear size="small" v-model="item.mediaFormat" :options="option.mediaFormatSet"
                         optionLabel="label" optionValue="value" display="chip" class="static w-full"/>
          </FloatLabel>
        </div>
      </div>
    </div>

    <div v-if="item.type === META.ITEM_TYPE.BOOK">
      <div class="formgrid grid">
        <div class="field col">
          <FloatLabel variant="on">
            <label class="mb-3">{{ $t('BookType') }}<i class="required-label pi pi-asterisk"/></label>
            <Select size="small" v-model="item.subType" :options="option.bookTypeSet"
                    optionLabel="label" optionValue="value" class="static w-full"/>
          </FloatLabel>
        </div>
        <div class="field col">
          <FloatLabel variant="on">
            <label class="mb-3">{{ $t('Language') }}<i class="required-label pi pi-asterisk"/></label>
            <Select size="small" v-model="item.lang" :options="option.languageSet"
                    optionLabel="label" optionValue="value" class="static w-full"/>
          </FloatLabel>
        </div>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <label>{{ $t('Summary') }}</label>
          <Textarea size="small" v-model="item.summary" rows="4" cols="20" class="static w-full"/>
        </FloatLabel>
      </div>
    </div>

    <Divider align="center"><b>{{ $t('Dimensions') }}</b></Divider>
    <div class="formgrid grid">
      <div class="field col" v-if="item.type === META.ITEM_TYPE.BOOK">
        <FloatLabel variant="on">
          <label>{{ $t('Pages') }}</label>
          <InputNumber size="small" v-model="item.pages" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col" v-if="item.type === META.ITEM_TYPE.BOOK">
        <FloatLabel variant="on">
          <label>{{ $t('Size') }}</label>
          <InputText size="small" v-model="item.size" class="static w-full"/>
        </FloatLabel>
      </div>

      <div class="field col" v-if="item.type === META.ITEM_TYPE.ALBUM">
        <FloatLabel variant="on">
          <label>{{ $t('Discs') }}</label>
          <InputNumber size="small" v-model="item.discs" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col" v-if="item.type === META.ITEM_TYPE.ALBUM">
        <FloatLabel variant="on">
          <label>{{ $t('Tracks') }}</label>
          <InputNumber size="small" v-model="item.tracks" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col" v-if="item.type === META.ITEM_TYPE.ALBUM">
        <FloatLabel variant="on">
          <label>{{ $t('RunTime') }}</label>
          <InputNumber size="small" v-model="item!.runTime" class="static w-full"/>
        </FloatLabel>
      </div>
    </div>
    <div class="field">
      <InputGroup class="static w-full">
        <InputText size="small" v-model="itemSpec"/>
        <Button size="small" icon="pi pi-sync" class="p-button-warning"
                @click="parseItemSpec" :title="$t('Analysis')"/>
      </InputGroup>
    </div>
    <div class="field">
      <div class="flex flex-col gap-4">
        <InputGroup>
          <InputGroupAddon>M</InputGroupAddon>
          <InputNumber size="small" suffix=" g" :minFractionDigits="0" :maxFractionDigits="2" v-model="item.weight"/>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>W</InputGroupAddon>
          <InputNumber size="small" suffix=" mm" v-model="item.width"/>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>L</InputGroupAddon>
          <InputNumber size="small" suffix=" mm" v-model="item.length"/>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>H</InputGroupAddon>
          <InputNumber size="small" suffix=" mm" v-model="item.height"/>
        </InputGroup>
      </div>
    </div>

    <div class="field">
      <FloatLabel variant="on">
        <label>{{ $t('Remark') }}</label>
        <Textarea size="small" v-model="item!.remark" rows="4" cols="20" class="static w-full"/>
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

<style scoped>
.required-label {
  color: red;
  font-size: 0.8rem;
  margin-left: .5rem !important
}
</style>