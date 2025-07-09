<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/toolkit/publicHelper";
import {API, Axios} from "@/api";
import {useOptionStore} from "@/store/modules/option";
import {parseItemSpecParams} from "@/service/itemService";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const item = ref<any>({});
const store = useOptionStore();
const itemSpec = ref('');
const param = ref(new EditParam());

onBeforeMount(() => {
  store.fetchOptions();
  item.value = PublicHelper.deepCopy(dialogRef.value.data.item);
  PublicHelper.handleAttributes(item.value);
})

onMounted(() => {
})

const submit = async () => {
  param.value.block = true;
  const res = await Axios.post(API.ITEM_UPDATE, item.value);
  if (res.success()) {
    bs!.toast.success(res.message);
    param.value.isUpdate = true;
    close();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.block = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: param.value.isUpdate
      }
  );
}

const ISBNInterConvert = async (isbn10: string) => {
  param.value.block = true;
  const res = await Axios.post(API.ITEM_CONVERT_ISBN, {isbn10: isbn10})
  if (res.success())
    item.value.ean13 = res.data;
  param.value.block = false;
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
  <BlockUI :blocked="param.block" class="entity-editor">
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
        <InputText size="large" v-if="item.type !== $const.ITEM_TYPE.BOOK" v-model="item!.barcode"/>
        <InputGroup v-else>
          <InputText size="large" v-model="item!.barcode"/>
          <Button size="large" icon="pi pi-sync" class="p-button-warning"
                  @click="ISBNInterConvert(item.barcode)" :title="t('GenerateISBN13')"/>
        </InputGroup>
      </FloatLabel>
      <FloatLabel variant="on">
        <label>{{ t('CatalogId') }}</label>
        <InputText size="large" v-model="item.catalogId" :disabled="item.type == $const.ITEM_TYPE.BOOK"/>
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
        <InputNumber size="large" :minFractionDigits="0" :maxFractionDigits="2" v-model="item!.price"/>
      </FloatLabel>
      <FloatLabel variant="on">
        <label>{{ t('Region') }}</label>
        <Select v-model="item.region" :options="$const.RegionSet" optionLabel="label"
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

    <template v-if="item.type === $const.ITEM_TYPE.BOOK">
      <div class="grid">
        <FloatLabel variant="on">
          <label>{{ t('Category') }}<i class="pi pi-asterisk"/></label>
          <Select size="large" v-model="item.subType" :options="store.options.bookTypeSet"
                  optionLabel="label" optionValue="value"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('Language') }}<i class="pi pi-asterisk"/></label>
          <Select size="large" v-model="item.lang" :options="store.options.languageSet"
                  optionLabel="label" optionValue="value"/>
        </FloatLabel>
      </div>
    </template>

    <Divider align="center"><b>{{ t('Dimensions') }}</b></Divider>

    <div class="grid">
      <template v-if="item.type === $const.ITEM_TYPE.BOOK">
        <FloatLabel variant="on">
          <label>{{ t('Pages') }}</label>
          <InputNumber size="large" v-model="item.pages"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('BookSize') }}</label>
          <InputText size="large" v-model="item.size"/>
        </FloatLabel>
      </template>
      <template v-if="item.type === $const.ITEM_TYPE.ALBUM || item.type === $const.ITEM_TYPE.DISC">
        <FloatLabel variant="on" v-if="item.type === $const.ITEM_TYPE.DISC">
          <label>{{ t('MediaFormat') }}<i class="pi pi-asterisk"/></label>
          <MultiSelect showClear v-model="item.mediaFormat" :options="store.options.mediaFormatSet"
                       optionLabel="label" optionValue="value" display="chip"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('Discs') }}</label>
          <InputNumber size="large" v-model="item.discs"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <template v-if="item.type === $const.ITEM_TYPE.ALBUM">
            <label>{{ t('Tracks') }}</label>
            <InputNumber size="large" v-model="item.tracks"/>
          </template>
          <template v-if="item.type === $const.ITEM_TYPE.DISC">
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

    <template v-if="[$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(item.type)">
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