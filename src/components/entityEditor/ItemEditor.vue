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
const dialogRef = inject<any>("dialogRef");
const item = ref<any>({});
const isUpdate = ref(false);
const block = ref(false);
const toast = useToast();
const store = useEntityStore();
const itemSpec = ref('');

onBeforeMount(() => {
  store.fetchOptions();
  item.value = PublicHelper.deepCopy(dialogRef.value.data.item);
  PublicHelper.handleAttributes(item.value);
})

onMounted(() => {
})

const submit = async () => {
  block.value = true;
  const res = await axios.post(API.ITEM_UPDATE, item.value);
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

const ISBNInterConvert = async (isbn10: string) => {
  block.value = true;
  const res = await axios.post(API.ITEM_CONVERT_ISBN, isbn10)
  if (res.state === axios.SUCCESS)
    item.value.ean13 = res.data;
  block.value = false;
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
  <BlockUI :blocked="block" class="entity-editor">
    <Divider align="center"><b>{{ t('BasicInfo') }}</b></Divider>

    <FloatLabel class="field" variant="on">
      <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
      <InputText size="large" v-model="item.name"/>
    </FloatLabel>
    <FloatLabel class="field" variant="on">
      <label>{{ t('Aliases') }}</label>
      <AutoComplete size="large" v-model="item.aliases" separator="," multiple :typeahead="false"/>
    </FloatLabel>

    <div class="grid">
      <FloatLabel variant="on">
        <label>{{ t('Barcode') }}</label>
        <InputText size="large" v-if="item.type !== META.ITEM_TYPE.BOOK" v-model="item!.barcode"/>
        <InputGroup v-else>
          <InputText size="large" v-model="item!.barcode"/>
          <Button size="large" icon="pi pi-sync" class="p-button-warning"
                  @click="ISBNInterConvert(item.barcode)" :title="t('TooltipGenerateBookISBN13')"/>
        </InputGroup>
      </FloatLabel>
      <FloatLabel variant="on">
        <label>{{ t('CatalogId') }}</label>
        <InputText size="large" v-model="item.catalogId" :disabled="item.type == META.ITEM_TYPE.BOOK"/>
      </FloatLabel>
    </div>

    <div class="grid" style="align-items: center">
      <FloatLabel variant="on">
        <label>{{ t('ReleaseDate') }}</label>
        <InputMask size="large" v-model="item!.releaseDate" mask="****/**/**"/>
      </FloatLabel>
      <FloatLabel variant="on">
        <label>{{ t('ReleaseType') }}</label>
        <Select v-model="item.releaseType" :options="store.options.releaseTypeSet"
                size="large" optionLabel="label" optionValue="value"/>
      </FloatLabel>
      <FloatLabel variant="on">
        <label>{{ t('ReleasePrice') }}</label>
        <InputNumber size="large" v-model="item!.price"/>
      </FloatLabel>
      <FloatLabel variant="on">
        <label>{{ t('Region') }}</label>
        <Select v-model="item.region" :options="META.RegionSet" optionLabel="label"
                size="large" optionValue="value">
          <template #value="slotProps">
            <span :class="`fi fi-${slotProps.value}`"/>
          </template>
          <template #option="slotProps">
            <span :class="`fi fi-${slotProps.option.value}`"/>
          </template>
        </Select>
      </FloatLabel>
      <ToggleButton style="height: 3rem" size="small" v-model="item.bonus"
                    onIcon="pi pi-check-circle" :onLabel="t('BonusInclusion')"
                    offIcon="pi pi-times-circle" :offLabel="t('BonusExclusion')"/>
    </div>

    <template v-if="item.type === META.ITEM_TYPE.BOOK">
      <div class="grid">
        <FloatLabel variant="on">
          <label class="mb-3">{{ t('BookType') }}<i class="pi pi-asterisk"/></label>
          <Select size="large" v-model="item.subType" :options="store.options.bookTypeSet"
                  optionLabel="label" optionValue="value"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label class="mb-3">{{ t('Language') }}<i class="pi pi-asterisk"/></label>
          <Select size="large" v-model="item.lang" :options="store.options.languageSet"
                  optionLabel="label" optionValue="value"/>
        </FloatLabel>
      </div>
      <FloatLabel variant="on">
        <label>{{ t('Summary') }}</label>
        <Textarea size="large" v-model="item.summary" rows="4" cols="20"/>
      </FloatLabel>
    </template>

    <Divider align="center"><b>{{ t('Dimensions') }}</b></Divider>

    <div class="grid">
      <template v-if="item.type === META.ITEM_TYPE.BOOK">
        <FloatLabel variant="on">
          <label>{{ t('Pages') }}</label>
          <InputNumber size="large" v-model="item.pages"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('BookSize') }}</label>
          <InputText size="large" v-model="item.size"/>
        </FloatLabel>
      </template>
      <template v-if="item.type === META.ITEM_TYPE.ALBUM || item.type === META.ITEM_TYPE.DISC">
        <FloatLabel variant="on" v-if="item.type === META.ITEM_TYPE.DISC">
          <label>{{ t('MediaFormat') }}<i class="pi pi-asterisk"/></label>
          <MultiSelect showClear v-model="item.mediaFormat" :options="store.options.mediaFormatSet"
                       optionLabel="label" optionValue="value" display="chip"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('Discs') }}</label>
          <InputNumber size="large" v-model="item.discs"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <template v-if="item.type === META.ITEM_TYPE.ALBUM">
            <label>{{ t('Tracks') }}</label>
            <InputNumber size="large" v-model="item.tracks"/>
          </template>
          <template v-if="item.type === META.ITEM_TYPE.DISC">
            <label>{{ t('Episodes') }}</label>
            <InputNumber size="large" v-model="item.episodes"/>
          </template>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('RunTime') }}</label>
          <InputNumber size="large" v-model="item!.runTime"/>
        </FloatLabel>
      </template>
    </div>

    <InputGroup class="field">
      <InputText size="large" v-model="itemSpec"/>
      <Button size="large" icon="pi pi-sync" class="p-button-warning" @click="parseItemSpec" :title="t('Analysis')"/>
    </InputGroup>

    <div class="field flex gap-3">
      <InputGroup>
        <InputGroupAddon>M</InputGroupAddon>
        <InputNumber size="large" suffix=" g" :minFractionDigits="0" :maxFractionDigits="2" v-model="item.weight"/>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>W</InputGroupAddon>
        <InputNumber size="large" suffix=" mm" v-model="item.width"/>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>L</InputGroupAddon>
        <InputNumber size="large" suffix=" mm" v-model="item.length"/>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>H</InputGroupAddon>
        <InputNumber size="large" suffix=" mm" v-model="item.height"/>
      </InputGroup>
    </div>

    <template v-if="[META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(item.type)">
      <Divider align="center"><b>{{ t('Other') }}</b></Divider>
      <div class="grid">
        <FloatLabel variant="on">
          <label>{{ t('Scale') }}</label>
          <InputText size="large" v-model="item.scale"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('Various') }}</label>
          <InputText size="large" v-model="item.various"/>
        </FloatLabel>
      </div>
      <div class="grid">
        <FloatLabel variant="on">
          <label>{{ t('Title') }}</label>
          <InputText size="large" v-model="item.title"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('TitleEn') }}</label>
          <InputText size="large" v-model="item.titleEn"/>
        </FloatLabel>
      </div>
      <FloatLabel class="field" variant="on">
        <label>{{ t('Version') }}</label>
        <AutoComplete size="large" v-model="item.versions" separator="," multiple :typeahead="false"/>
      </FloatLabel>
      <FloatLabel class="field" variant="on">
        <label>{{ t('VersionEn') }}</label>
        <AutoComplete size="large" v-model="item.versionsEn" separator="," multiple :typeahead="false"/>
      </FloatLabel>
    </template>

    <FloatLabel class="field" variant="on">
      <label>{{ t('Remark') }}</label>
      <Textarea size="large" v-model="item!.remark" rows="4" cols="20"/>
    </FloatLabel>

    <Button icon="pi pi-times" class="p-button-text" @click="close"/>
    <Button icon="pi pi-save" @click="submit"/>
  </BlockUI>
</template>

<style scoped lang="scss">
</style>