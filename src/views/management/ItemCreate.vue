<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, ref} from "vue";
import {useOptionStore} from "@/store/modules/option";
import "flag-icons/css/flag-icons.min.css";
import {API, Axios} from "@/api";
import {ItemAdvanceCreateDTO, parseItemSpecParams} from "@/service/itemService";
import {MdEditor} from "md-editor-v3";
import {useRouter} from "vue-router";
import {PublicHelper} from "@/utils/publicHelper";
import {bs} from '@/service/baseService';

import 'md-editor-v3/lib/style.css';
import {EditParam} from "@/service/entityService";

const ImageUploader = defineAsyncComponent(() => import('@/components/image/ImageUploader.vue'));
const albumQuickCreator = defineAsyncComponent(() => import('@/components/item/AlbumTrackQuickCreator.vue'));
const RelatedEntriesCreator = defineAsyncComponent(() => import('@/components/related/RelatedEntriesCreator.vue'));

const router = useRouter();
const {t} = useI18n();
const store = useOptionStore();
const itemType = ref();
const itemSpec = ref('');
const dto = ref(new ItemAdvanceCreateDTO());
const {proxy} = getCurrentInstance()!;
const param = ref(new EditParam());

const relatedEntries = ref<any[]>([])


onBeforeMount(() => {
  store.fetchOptions();
  itemType.value = proxy!.$const.ITEM_TYPE_SET[dto.value.item.type - 1];
})

const switchItemType = () => {
  dto.value.item.type = parseInt(itemType.value.value);
}
const ISBNInterConvert = async (isbn10: string) => {
  const res = await Axios.post(API.ITEM.BOOK_CONVERT_ISBN, {isbn10: isbn10})
  if (res.success())
    dto.value.item.barcode = res.data;
};

const parseItemSpec = () => {
  let res: ItemSpecParams = parseItemSpecParams(itemSpec.value);
  dto.value.item.weight = res.weight;
  dto.value.item.width = res.width;
  dto.value.item.length = res.length;
  dto.value.item.height = res.height;
}

//region related entities

const handleRelatedEntities = () => {
  dto.value.relatedEntries = [
    ...relatedEntries.value.map(e => ({
      relatedEntitySubType: e.type.value,
      relatedEntityType: proxy!.$const.ENTITY.ENTRY,
      relatedEntityId: e.id,
      remark: e.remark ?? '',

      roleId: e.relatedRole?.value ?? 0,
      relatedRoleId: e.role?.value ?? 0
    }))
  ];
}
//endregion

const submit = async () => {
  param.value.block = true;
  handleRelatedEntities();
  if (dto.value.item.type === proxy!.$const.ITEM_TYPE.ALBUM) handleTracks();
  const fd = new FormData();
  dto.value.images.forEach(i => {
    fd.append('images', (i as any).file)
    i.file = null;
  });
  fd.append('param', JSON.stringify(dto.value));
  const res = await Axios.form(API.ITEM.CREATE, fd);
  if (res.success())
    await router.push(`${proxy!.$api.ITEM.DETAIL_PATH}/${res.data}`);
  else
    bs!.toast.error(res.message);
  param.value.block = false;
}

const handlePasteDate = (ev: Event) => {
  // 获取粘贴的文本内容
  const pastedDate = (ev as ClipboardEvent).clipboardData?.getData('text') || '';
  dto.value.item.releaseDate = PublicHelper.convertToDateFormat(pastedDate);
}

//analysis
let analysisBasicInfoText = '';
const analysisBasicInfoDisplay = ref(false);
const parseBasicInfo = () => {
  parseBasicInfoText(analysisBasicInfoText);
  analysisBasicInfoText = '';
  analysisBasicInfoDisplay.value = false;
}
const parseBasicInfoText = (input: string) => {
  const lines = input.trim().split('\n').map(line => line.trim()).filter(line => line !== '');

  // 查找关键词起始的下标
  const catalogIndex = lines.findIndex(line => line.startsWith('Catalog Number'));
  if (catalogIndex === -1 || catalogIndex < 1) {
    throw new Error('Invalid format: Catalog Number not found or no name line');
  }

  dto.value.item.name = lines[0];
  dto.value.item.aliases = lines.slice(1, catalogIndex);

  dto.value.item.catalogId = lines[catalogIndex].replace(/^Catalog Number\s+/, '').trim();
  dto.value.item.barcode = (lines[catalogIndex + 1]?.split(/\s+/).slice(1).join(' ') || '').trim();
  const releaseDateRaw = lines[catalogIndex + 2]?.split(/\s+/).slice(1).join(' ') || '';
  const releasePriceRaw = lines[catalogIndex + 4]?.split(/\s+/).slice(1).join(' ') || '';
  dto.value.item.releaseDate = (() => {
    const date = new Date(releaseDateRaw);
    if (isNaN(date.getTime())) return releaseDateRaw;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  })();
  dto.value.item.price = parseInt(releasePriceRaw.replace(/\D/g, ''), 10);
}

const openAlbumTrackQuickCreatorDialog = () => {
  bs!.dialog.open(albumQuickCreator, {
    props: {
      header: t('TrackInfo'),
      style: {
        width: '65rem'
      },
      modal: true,
      closable: false
    },
    data: {
      mode: 'advance'
    },
    onClose: (options) => {
      if (options!.data !== undefined) {
        if (options!.data.disc && options!.data.disc.tracks.length > 0) {
          dto.value.item.disc = options!.data.disc;
        }
      }
    }
  });
}

const handleTracks = () => {
  if (dto.value.item.disc.tracks.length === 0) return;
  dto.value.item.episodes = dto.value.item.disc.tracks.length;
  dto.value.item.discs = 1;
  dto.value.item.runTime = dto.value.item.disc.tracks.reduce((sum: number, item: any) => {
    return sum + PublicHelper.getDuration(item.duration);
  }, 0);
}
</script>

<template>
  <div class="flex justify-content-center">
    <BlockUI :blocked="param.block" class="entity-creator" style="width: 125rem">
      <div class="col-7">
        <Card class="col-12">
          <template #header>
            <div><RIcon name="label"/><strong>{{ t('Category') }}</strong></div>
          </template>
          <template #content>
            <div class="content-space-between">
              <SelectButton v-model="itemType" :options="$const.ITEM_TYPE_SET"
                            @change="switchItemType"
                            optionLabel="value" dataKey="value" ariaLabelledby="custom" :optionDisabled="'disabled'">
                <template #option="{option}">
                  <RIcon :name="option.icon"/>
                </template>
              </SelectButton>
              <RButton @click="submit" tip="Save" icon="save"/>
            </div>
            <div v-if="dto.item.type === $const.ITEM_TYPE.BOOK" class="field mt-3 flex gap-3">
              <div v-for="type of store.options.bookTypeSet" class="flex gap-2 align-items-center">
                <RadioButton v-model="dto.item.subType" :value="type.value"/>
                <label>{{ type.label }}</label>
              </div>
            </div>
          </template>
        </Card>
        <Card class="mt-3 col-12">
          <template #header>
            <div><RIcon name="format_list_bulleted"/><strong>{{ t('BasicInfo') }}</strong></div>
            <RButton severity="info" @click="analysisBasicInfoDisplay = true" icon="convert_to_text" tip="Analysis"/>
          </template>
          <template #content>
            <div class="entity-editor">
              <FloatLabel class="field" variant="on">
                <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
                <InputText v-model="dto.item.name"/>
              </FloatLabel>
              <FloatLabel class="field" variant="on">
                <label>{{ t('Aliases') }}</label>
                <AutoComplete v-model="dto.item.aliases" separator="," multiple :typeahead="false"/>
              </FloatLabel>
              <div class="grid">
                <FloatLabel variant="on">
                  <label>{{ t('ReleaseDate') }}</label>
                  <InputMask @paste="handlePasteDate" v-model="dto.item.releaseDate" mask="****/**/**"/>
                </FloatLabel>
                <FloatLabel variant="on">
                  <label>{{ t('ReleasePrice') }}</label>
                  <InputNumber v-model="dto.item.price" :minFractionDigits="0" :maxFractionDigits="2"/>
                </FloatLabel>
                <FloatLabel variant="on">
                  <label>{{ t('ReleaseType') }}</label>
                  <Select v-model="dto.item.releaseType" :options="store.options.releaseTypeSet"
                          optionLabel="label" optionValue="value"/>
                </FloatLabel>
                <FloatLabel variant="on">
                  <label>{{ t('Region') }}</label>
                  <Select v-model="dto.item.region" :options="$const.RegionSet" optionLabel="label" optionValue="value">
                    <template #value="{value}">
                      <span :class="`fi fi-${value}`"/>
                    </template>
                    <template #option="{option}">
                      <span :class="`fi fi-${option.value}`"/>
                    </template>
                  </Select>
                </FloatLabel>
                <ToggleButton style="height: 2.5rem" size="small" v-model="dto.item.bonus"
                              onIcon="pi true-icon pi-check-circle" :onLabel="t('BonusInclusion')"
                              offIcon="pi false-icon pi-times-circle" :offLabel="t('BonusExclusion')"/>
              </div>
              <div class="grid">
                <FloatLabel variant="on">
                  <label>{{ t('Barcode') }}</label>
                  <InputText v-if="dto.item.type !== $const.ITEM_TYPE.BOOK" v-model="dto.item!.barcode"/>
                  <InputGroup v-else>
                    <InputText v-model="dto.item!.barcode"/>
                    <Button icon="pi pi-sync" class="p-button-warning"
                            @click="ISBNInterConvert(dto.item.barcode)" :title="t('GenerateISBN13')"/>
                  </InputGroup>
                </FloatLabel>
                <FloatLabel variant="on" v-if="dto.item.type !== $const.ITEM_TYPE.BOOK">
                  <label>{{ t('CatalogId') }}</label>
                  <InputText v-model="dto.item.catalogId"/>
                </FloatLabel>
              </div>

              <div class="grid"
                   v-if="dto.item.type === $const.ITEM_TYPE.ALBUM || dto.item.type === $const.ITEM_TYPE.VIDEO">
                <FloatLabel variant="on" v-if="dto.item.type === $const.ITEM_TYPE.VIDEO">
                  <label>{{ t('MediaFormat') }}<i class="required-label pi pi-asterisk"/></label>
                  <MultiSelect showClear v-model="dto.item.mediaFormat" :options="store.options.mediaFormatSet"
                               optionLabel="label" optionValue="value" display="chip"/>
                </FloatLabel>
                <FloatLabel variant="on">
                  <label>{{ t('Discs') }}</label>
                  <InputNumber v-model="dto.item.discs"/>
                </FloatLabel>
                <FloatLabel variant="on">
                  <template v-if="dto.item.type === $const.ITEM_TYPE.ALBUM">
                    <label>{{ t('Tracks') }}</label>
                    <InputNumber v-model="dto.item.tracks"/>
                  </template>
                  <template v-if="dto.item.type === $const.ITEM_TYPE.VIDEO">
                    <label>{{ t('Episodes') }}</label>
                    <InputNumber v-model="dto.item.episodes"/>
                  </template>
                </FloatLabel>
                <FloatLabel variant="on">
                  <label>{{ t('RunTime') }}</label>
                  <InputNumber v-model="dto.item.runTime"/>
                </FloatLabel>
              </div>

              <div class="grid" v-if="dto.item.type === $const.ITEM_TYPE.BOOK">
                <FloatLabel variant="on">
                  <label>{{ t('Pages') }}</label>
                  <InputNumber v-model="dto.item.pages"/>
                </FloatLabel>
                <FloatLabel variant="on">
                  <label>{{ t('BookSize') }}</label>
                  <InputText v-model="dto.item.scale"/>
                </FloatLabel>
              </div>

              <InputGroup class="field">
                <InputText v-model="itemSpec"/>
                <Button icon="pi pi-sync" class="p-button-warning"
                        @click="parseItemSpec" :title="t('Analysis')"/>
              </InputGroup>

              <div class="flex flex-col gap-3 field">
                <InputGroup>
                  <InputGroupAddon>M</InputGroupAddon>
                  <InputNumber suffix=" g" :minFractionDigits="0" :maxFractionDigits="2"
                               v-model="dto.item.weight"/>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>W</InputGroupAddon>
                  <InputNumber suffix=" mm" v-model="dto.item.width"/>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>L</InputGroupAddon>
                  <InputNumber suffix=" mm" v-model="dto.item.length"/>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>H</InputGroupAddon>
                  <InputNumber suffix=" mm" v-model="dto.item.height"/>
                </InputGroup>
              </div>

              <FloatLabel class="field" variant="on">
                <label>{{ t('Remark') }}</label>
                <Textarea v-model="dto.item.remark" rows="4" cols="20"/>
              </FloatLabel>
            </div>
          </template>
        </Card>
        <Card class="mt-3 col-12" v-if="dto.item.type === $const.ITEM_TYPE.ALBUM">
          <template #header>
            <div><RIcon name="queue_music"/><strong>{{ t('TrackInfo') }}</strong></div>
            <RButton @click="openAlbumTrackQuickCreatorDialog" severity="info" icon="music_note_add" tip="Add"/>
          </template>
          <template #content>
            <DataTable ref="dt" :value="dto.item.disc.tracks" :rows="50" stripedRows size="small"
                       scrollable scrollHeight="40rem" responsiveLayout="scroll">
              <template #empty>
                <span class="empty-search-result">
                    {{ t('CommonDataTableEmptyInfo') }}
                </span>
              </template>
              <template #loading>
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                <span>{{ t('CommonDataTableLoadingInfo') }}</span>
              </template>
              <Column :header="t('Index')" field="serial" style="flex: 0 0 10rem"/>
              <Column :header="t('Name')" field="name" style="flex: 0 0 10rem"/>
              <Column :header="t('Duration')" field="duration" style="flex: 0 0 10rem"/>
            </DataTable>
          </template>
        </Card>
        <RelatedEntriesCreator class="mt-3 col-12" v-model:relatedEntries="relatedEntries"/>
      </div>
      <div class="col-5">
        <Card>
          <template #header>
            <div><RIcon name="image"/><strong>{{ t('Images') }}</strong></div>
          </template>
          <template #content>
            <ImageUploader v-model:images="dto.images" v-model:generateThumb="dto.generateThumb" :showDetail="false"/>
          </template>
        </Card>
      </div>
      <div class="col-9">
        <Card>
          <template #header>
            <div><RIcon name="article"/><strong>{{ t('Description') }}</strong></div>
          </template>
          <template #content>
            <MdEditor v-model="dto.item.detail" theme="dark" previewTheme="github"
                      :toolbarsExclude="['save', 'pageFullscreen', 'fullscreen',
                   'preview', 'previewOnly', 'htmlPreview', 'catalog', 'github']"/>
          </template>
        </Card>
      </div>
    </BlockUI>
  </div>
  <Dialog :modal="true" v-model:visible="analysisBasicInfoDisplay" :header="t('Analysis')" style="width: 40rem">
    <Textarea size="small" v-model="analysisBasicInfoText" rows="8" cols="20" class="static w-full"/>
    <RButton class="mt-2" severity="info" @click="parseBasicInfo" icon="convert_to_text"/>
  </Dialog>
</template>

<style lang="scss" scoped>
</style>