<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {META} from "@/config/Web_Const";
import {PublicHelper} from "@/toolkit/publicHelper";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useToast} from "primevue/usetoast";
import {useEntityStore} from "@/logic/entityService";
import {ItemSpecParams, parseItemSpecParams} from "@/logic/itemService";

const {t} = useI18n();
const dialogRef = inject("dialogRef");
const item = ref<any>({});
const isUpdate = ref(false);
const editBlock = ref(false);
const toast = useToast();
const store = useEntityStore();
const itemSpec = ref('');

onBeforeMount(async () => {
  await store.fetchOptions();
  item.value = PublicHelper.deepCopy(dialogRef.value.data.item);
  PublicHelper.handleAttributes(item.value);
})

onMounted(() => {
})

const submit = async () => {
  editBlock.value = true;
  const res = await axios.post(API.ITEM_UPDATE, item.value);
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
  const res = await axios.post(API.ITEM_CONVERT_ISBN, {label: label, isbn: isbn})
  if (res.state === axios.SUCCESS) {
    if (label === 'isbn13') item.value.ean13 = res.data;
    if (label === 'isbn10') item.value.isbn10 = res.data;
  }
  editBlock.value = false;
};

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
    <Divider align="center"><b>{{ t('BasicInfo') }}</b></Divider>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
        <InputText size="small" v-model="item.name" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Aliases') }}</label>
        <AutoComplete size="small" v-model="item.aliases" separator="," multiple :typeahead="false" class="static w-full"/>
      </FloatLabel>
    </div>

    <div class="formgrid grid">
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ t('ReleaseDate') }}</label>
          <InputMask size="small" v-model="item!.releaseDate" mask="****/**/**" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ t('ReleaseType') }}</label>
          <Select v-model="item.releaseType" :options="store.options.releaseTypeSet"
                  size="small" optionLabel="label" optionValue="value" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ t('ReleasePrice') }}</label>
          <InputNumber size="small" v-model="item!.price" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ t('Region') }}</label>
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
                      onIcon="pi true-icon pi-check-circle" :onLabel="t('BonusInclusion')"
                      offIcon="pi false-icon pi-times-circle" :offLabel="t('BonusExclusion')"/>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <FloatLabel variant="on">
          <label v-if="item.type !== META.ITEM_TYPE.BOOK">{{ t('Barcode') }}</label>
          <label v-if="item.type === META.ITEM_TYPE.BOOK">{{ t('BookISBN13') }}</label>
          <InputText size="small" v-if="item.type !== META.ITEM_TYPE.BOOK" v-model="item!.barcode" class="static w-full"/>
          <InputGroup v-else class="static w-full">
            <InputText size="small" v-model="item!.barcode"/>
            <Button size="small" icon="pi pi-sync" class="p-button-warning"
                    @click="ISBNInterConvert('isbn13', item.barcode)" :title="t('TooltipGenerateBookISBN13')"/>
          </InputGroup>
        </FloatLabel>
      </div>
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ t('CatalogId') }}</label>
          <InputText size="small" v-model="item.catalogId" class="static w-full" :disabled="item.type == META.ITEM_TYPE.BOOK"/>
        </FloatLabel>
      </div>
    </div>

    <div v-if="item.type === META.ITEM_TYPE.BOOK">
      <div class="formgrid grid">
        <div class="field col">
          <FloatLabel variant="on">
            <label class="mb-3">{{ t('BookType') }}<i class="required-label pi pi-asterisk"/></label>
            <Select size="small" v-model="item.subType" :options="store.options.bookTypeSet"
                    optionLabel="label" optionValue="value" class="static w-full"/>
          </FloatLabel>
        </div>
        <div class="field col">
          <FloatLabel variant="on">
            <label class="mb-3">{{ t('Language') }}<i class="required-label pi pi-asterisk"/></label>
            <Select size="small" v-model="item.lang" :options="store.options.languageSet"
                    optionLabel="label" optionValue="value" class="static w-full"/>
          </FloatLabel>
        </div>
      </div>
      <div class="field">
        <FloatLabel variant="on">
          <label>{{ t('Summary') }}</label>
          <Textarea size="small" v-model="item.summary" rows="4" cols="20" class="static w-full"/>
        </FloatLabel>
      </div>
    </div>

    <Divider align="center"><b>{{ t('Dimensions') }}</b></Divider>
    <div class="formgrid grid">
      <div class="field col" v-if="item.type === META.ITEM_TYPE.BOOK">
        <FloatLabel variant="on">
          <label>{{ t('Pages') }}</label>
          <InputNumber size="small" v-model="item.pages" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col" v-if="item.type === META.ITEM_TYPE.BOOK">
        <FloatLabel variant="on">
          <label>{{ t('BookSize') }}</label>
          <InputText size="small" v-model="item.size" class="static w-full"/>
        </FloatLabel>
      </div>

      <div class="field col" v-if="item.type === META.ITEM_TYPE.DISC">
        <FloatLabel variant="on">
          <label>{{ t('MediaFormat') }}<i class="required-label pi pi-asterisk"/></label>
          <MultiSelect showClear size="small" v-model="item.mediaFormat" :options="store.options.mediaFormatSet"
                       optionLabel="label" optionValue="value" display="chip" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col" v-if="item.type === META.ITEM_TYPE.ALBUM || item.type === META.ITEM_TYPE.DISC">
        <FloatLabel variant="on">
          <label>{{ t('Discs') }}</label>
          <InputNumber size="small" v-model="item.discs" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col" v-if="item.type === META.ITEM_TYPE.ALBUM || item.type === META.ITEM_TYPE.DISC">
        <FloatLabel variant="on">
          <template v-if="item.type === META.ITEM_TYPE.ALBUM">
            <label>{{ t('Tracks') }}</label>
            <InputNumber size="small" v-model="item.tracks" class="static w-full"/>
          </template>
          <template v-if="item.type === META.ITEM_TYPE.DISC">
            <label>{{ t('Episodes') }}</label>
            <InputNumber size="small" v-model="item.episodes" class="static w-full"/>
          </template>
        </FloatLabel>
      </div>
      <div class="field col" v-if="item.type === META.ITEM_TYPE.ALBUM || item.type === META.ITEM_TYPE.DISC">
        <FloatLabel variant="on">
          <label>{{ t('RunTime') }}</label>
          <InputNumber size="small" v-model="item!.runTime" class="static w-full"/>
        </FloatLabel>
      </div>


    </div>
    <div class="field">
      <InputGroup class="static w-full">
        <InputText size="small" v-model="itemSpec"/>
        <Button size="small" icon="pi pi-sync" class="p-button-warning"
                @click="parseItemSpec" :title="t('Analysis')"/>
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
        <label>{{ t('Remark') }}</label>
        <Textarea size="small" v-model="item!.remark" rows="4" cols="20" class="static w-full"/>
      </FloatLabel>
    </div>
    <div class="relative">
      <div class="bottom-0 right-0">
        <Button icon="pi pi-times" :label="t('Cancel')" @click="close"
                class="p-button-text"/>
        <Button icon="pi pi-save" :label="t('Save')" @click="submit"/>
      </div>
    </div>
  </BlockUI>
</template>

<style scoped lang="scss">
@use "@/assets/entity-manager";
</style>