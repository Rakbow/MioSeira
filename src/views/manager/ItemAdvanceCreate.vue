<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {META, RelatedEntry} from "@/config/Web_Const";
import {defineAsyncComponent, onBeforeMount, reactive, ref} from "vue";
import {useEntityStore} from "@/logic/entityService";
import {useToast} from "primevue/usetoast";
import "flag-icons/css/flag-icons.min.css";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {ItemAdvanceCreateDTO, ItemSpecParams, parseItemSpecParams} from "@/logic/itemService";
import {MdEditor} from "md-editor-v3";
import {useDialog} from "primevue/usedialog";
import {useRouter} from "vue-router";
import {PublicHelper} from "@/toolkit/publicHelper";

import 'md-editor-v3/lib/style.css';
import {useDraftStore} from "@/store/draft";

const ImageUploader = defineAsyncComponent(() => import('@/components/image/ImageUploader.vue'));
const RelatedEntriesPicker = defineAsyncComponent(() => import('@/components/related/RelatedEntriesPicker.vue'));
const albumQuickCreator = defineAsyncComponent(() => import('@/components/item/AlbumTrackQuickCreator.vue'));

const block = ref(false);
const router = useRouter();
const dialog = useDialog();
const {t} = useI18n();
const toast = useToast();
const store = useEntityStore();
const draft = useDraftStore();
const itemType = ref();
const itemSpec = ref('');
const dto = ref(new ItemAdvanceCreateDTO());

const relatedEntry = reactive<RelatedEntry>(new RelatedEntry())


onBeforeMount(async () => {
  await store.fetchOptions();
  itemType.value = META.ITEM_TYPE_SET[dto.value.item.type - 1];
})

const switchItemType = () => {
  dto.value.item.type = parseInt(itemType.value.value);
}
const ISBNInterConvert = async (isbn10: string) => {
  const res = await axios.post(API.ITEM_CONVERT_ISBN, isbn10)
  if (res.state === axios.SUCCESS)
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

const handleRelatedEntry = () => {
  const entities: any[] = [
    ...relatedEntry.products.map(e => ({
      relatedGroup: META.RELATION_RELATED_GROUP.PRODUCT,
      relatedEntityType: META.ENTITY.ENTRY,
      relatedEntityId: e.id
    })),
    ...relatedEntry.persons.map(e => ({
      relatedGroup: META.RELATION_RELATED_GROUP.PERSON,
      relatedEntityType: META.ENTITY.ENTRY,
      relatedEntityId: e.id,
      roleId: e.role.value
    }))
  ];

  dto.value.relatedEntities.push(...entities);
}

const handleImage = async () => {
  for (const i of dto.value.images) {
    i.base64Code = await PublicHelper.fileToBase64(i.file);
  }
}

//endregion

const submit = async () => {
  block.value = true;
  handleRelatedEntry();
  if(dto.value.item.type === META.ITEM_TYPE.ALBUM) handleTracks();
  // await handleImage();

  const fd = new FormData();
  dto.value.images.forEach(i => {
    fd.append('images', i.file)
    i.file = null;
  });
  fd.append('param', JSON.stringify(dto.value));
  const res = await axios.form(API.ITEM_CREATE_ADVANCE, fd);
  if (res.state === axios.SUCCESS)
    await router.push(`${API.ITEM_DETAIL_PATH}/${res.data}`);
  else
    toast.add({severity: 'error', detail: res.message, life: 3000});
  block.value = false;
}

const handlePasteDate = (ev: ClipboardEvent) => {
  // 获取粘贴的文本内容
  const pastedDate = ev.clipboardData?.getData('text') || '';
  dto.value.item.releaseDate = PublicHelper.convertToDateFormat(pastedDate);
}

//draft
const getDraft = () => {
  Object.assign(relatedEntry, JSON.parse(JSON.stringify(draft.relatedEntry)))
}

const saveDraft = () => {
  draft.save(relatedEntry)
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
  dialog.open(albumQuickCreator, {
    props: {
      header: t('TrackInfo'),
      style: {
        width: '650px'
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
          dto.value.item.disc.tracks = options!.data.tracks;
        }
      }
    }
  });
}

const handleTracks = () => {
  if(dto.value.item.disc.tracks.length === 0) return;
  dto.value.item.tracks = dto.value.item.disc.tracks.length;
  dto.value.item.discs = 1;
  dto.value.item.runTime = dto.value.item.disc.tracks.reduce((sum: number, item: any) => {
    return sum + PublicHelper.getDuration(item.duration);
  }, 0);
}
</script>

<template>
  <BlockUI :blocked="block">
    <div class="grid manager-panel">
      <div class="col-7">
        <div class="col-12">
          <Panel>
            <template #header>
              <span><i class="pi pi-tag"/><strong>{{ t('Category') }}</strong></span>
            </template>
            <template #icons>
              <Button size="small" @click="submit" icon="pi pi-save"/>
            </template>
            <div class="field">
              <label>{{ t('Type') }}<i class="required-label pi pi-asterisk"/></label>
              <SelectButton class="w-full" size="small" v-model="itemType" :options="META.ITEM_TYPE_SET"
                            @change="switchItemType"
                            optionLabel="value" dataKey="value" ariaLabelledby="custom" :optionDisabled="'disabled'">
                <template #option="slotProps">
                  <span class="material-symbols-outlined">{{ slotProps.option.icon }}</span>
                </template>
              </SelectButton>
            </div>
            <div v-if="dto.item.type === META.ITEM_TYPE.BOOK" class="field">
              <label>{{ t('BookType') }}<i class="required-label pi pi-asterisk"/></label>
              <div class="flex flex-wrap flex-col gap-3">
                <div v-for="format of store.options.bookTypeSet" class="flex gap-2">
                  <RadioButton v-model="dto.item.subType" :value="format.value"/>
                  <label>{{ format.label }}</label>
                </div>
              </div>
            </div>
          </Panel>
        </div>
        <div class="col-12">
          <Panel>
            <template #header>
              <span><i class="pi pi-tag"/><strong>{{ t('BasicInfo') }}</strong></span>
            </template>
            <template #icons>
              <Button size="small" severity="info" @click="analysisBasicInfoDisplay = true" icon="pi pi-file"/>
            </template>
            <div class="field">
              <FloatLabel variant="on">
                <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
                <InputText size="small" v-model="dto.item.name" class="static w-full"/>
              </FloatLabel>
            </div>
            <div class="field">
              <FloatLabel variant="on">
                <label>{{ t('Aliases') }}</label>
                <AutoComplete size="small" v-model="dto.item.aliases" separator="," multiple :typeahead="false"
                              class="static w-full"/>
              </FloatLabel>
            </div>
            <div class="formgrid grid">
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('ReleaseDate') }}</label>
                  <InputMask size="small" @paste="handlePasteDate" v-model="dto.item.releaseDate" mask="****/**/**"
                             class="static w-full"/>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('ReleasePrice') }}</label>
                  <InputNumber size="small" v-model="dto.item.price" class="static w-full"/>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('ReleaseType') }}</label>
                  <Select v-model="dto.item.releaseType" :options="store.options.releaseTypeSet"
                          size="small" optionLabel="label" optionValue="value" class="static w-full"/>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('Region') }}</label>
                  <Select v-model="dto.item.region" :options="META.RegionSet" optionLabel="label"
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
                <ToggleButton size="small" v-model="dto.item.bonus"
                              onIcon="pi true-icon pi-check-circle" :onLabel="t('BonusInclusion')"
                              offIcon="pi false-icon pi-times-circle" :offLabel="t('BonusExclusion')"/>
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field col">
                <FloatLabel variant="on">
                  <label v-if="dto.item.type !== META.ITEM_TYPE.BOOK">{{ t('Barcode') }}</label>
                  <label v-if="dto.item.type === META.ITEM_TYPE.BOOK">{{ t('BookISBN13') }}</label>
                  <InputText size="small" v-if="dto.item.type !== META.ITEM_TYPE.BOOK" v-model="dto.item.barcode"
                             class="static w-full"/>
                  <InputGroup v-else class="static w-full">
                    <InputText size="small" v-model="dto.item.barcode"/>
                    <Button size="small" icon="pi pi-sync" class="p-button-warning"
                            @click="ISBNInterConvert(dto.item.barcode)" :title="t('TooltipGenerateBookISBN13')"/>
                  </InputGroup>
                </FloatLabel>
              </div>
              <div v-if="dto.item.type !== META.ITEM_TYPE.BOOK" class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('CatalogId') }}</label>
                  <InputText size="small" v-model="dto.item.catalogId" class="static w-full"/>
                </FloatLabel>
              </div>
            </div>

            <div v-if="dto.item.type === META.ITEM_TYPE.ALBUM || dto.item.type === META.ITEM_TYPE.DISC" class="formgrid grid">
              <div class="field col" v-if="dto.item.type === META.ITEM_TYPE.DISC">
                <FloatLabel variant="on">
                  <label>{{ t('MediaFormat') }}<i class="required-label pi pi-asterisk"/></label>
                  <MultiSelect showClear size="small" v-model="dto.item.mediaFormat" :options="store.options.mediaFormatSet"
                               optionLabel="label" optionValue="value" display="chip" class="static w-full"/>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('Discs') }}</label>
                  <InputNumber size="small" v-model="dto.item.discs" class="static w-full"/>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <template v-if="dto.item.type === META.ITEM_TYPE.ALBUM">
                    <label>{{ t('Tracks') }}</label>
                    <InputNumber size="small" v-model="dto.item.tracks" class="static w-full"/>
                  </template>
                  <template v-if="dto.item.type === META.ITEM_TYPE.DISC">
                    <label>{{ t('Episodes') }}</label>
                    <InputNumber size="small" v-model="dto.item.episodes" class="static w-full"/>
                  </template>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('RunTime') }}</label>
                  <InputNumber size="small" v-model="dto.item.runTime" class="static w-full"/>
                </FloatLabel>
              </div>
            </div>

            <div v-if="dto.item.type === META.ITEM_TYPE.BOOK" class="formgrid grid">
              <div class="field col">
                <FloatLabel variant="on">
                  <label class="mb-3">{{ t('Language') }}<i class="required-label pi pi-asterisk"/></label>
                  <Select size="small" v-model="dto.item.lang" :options="store.options.languageSet"
                          optionLabel="label" optionValue="value" class="static w-full"/>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('Pages') }}</label>
                  <InputNumber size="small" v-model="dto.item.pages" class="static w-full"/>
                </FloatLabel>
              </div>
              <div class="field col">
                <FloatLabel variant="on">
                  <label>{{ t('BookSize') }}</label>
                  <InputText size="small" v-model="dto.item.size" class="static w-full"/>
                </FloatLabel>
              </div>
            </div>
            <div v-if="dto.item.type === META.ITEM_TYPE.BOOK" class="field">
              <FloatLabel variant="on">
                <label>{{ t('Summary') }}</label>
                <Textarea size="small" v-model="dto.item.summary" rows="4" cols="20" class="static w-full"/>
              </FloatLabel>
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
                  <InputNumber size="small" suffix=" g" :minFractionDigits="0" :maxFractionDigits="2"
                               v-model="dto.item.weight"/>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>W</InputGroupAddon>
                  <InputNumber size="small" suffix=" mm" v-model="dto.item.width"/>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>L</InputGroupAddon>
                  <InputNumber size="small" suffix=" mm" v-model="dto.item.length"/>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>H</InputGroupAddon>
                  <InputNumber size="small" suffix=" mm" v-model="dto.item.height"/>
                </InputGroup>
              </div>
            </div>

            <div class="field">
              <FloatLabel variant="on">
                <label>{{ t('Remark') }}</label>
                <Textarea size="small" v-model="dto.item.remark" rows="4" cols="20" class="static w-full"/>
              </FloatLabel>
            </div>
          </Panel>
        </div>
        <div class="col-12" v-if="dto.item.type === META.ITEM_TYPE.ALBUM">
          <Panel>
            <template #header>
              <span><i class="pi pi-list"/><strong>{{ t('TrackInfo') }}</strong></span>
            </template>
            <template #icons>
              <Button class="p-button-link" @click="openAlbumTrackQuickCreatorDialog"
                      v-tooltip.bottom="{value: t('Add'), class: 'short-tooltip'}">
                <template #icon>
                  <span class="material-symbols-outlined">music_note_add</span>
                </template>
              </Button>
            </template>
            <DataTable ref="dt" :value="dto.item.disc.tracks"
                       alwaysShowPaginator paginator :rows="50" stripedRows size="small"
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
                       currentPageReportTemplate="{first} to {last} of {totalRecords}"
                       scrollable scrollHeight="400px" responsiveLayout="scroll">
              <template #empty>
        <span class="emptyInfo">
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
          </Panel>
        </div>
      </div>
      <div class="col-5">
        <div class="col-12">
          <Panel>
            <template #header>
              <span><i class="pi pi-images"/><strong>{{ t('Images') }}</strong></span>
            </template>
            <ImageUploader v-model:images="dto.images" v-model:generateThumb="dto.generateThumb" :showDetail="false"/>
          </Panel>
        </div>
      </div>
      <div class="col-12">
        <Panel>
          <template #header>
            <span><i class="pi pi-objects-column"/><strong>{{ t('Relation') }}</strong></span>
          </template>
          <template #icons>
            <Button size="small" severity="info" @click="saveDraft" icon="pi pi-save" class="mr-1"/>
            <Button size="small" severity="info" @click="getDraft" icon="pi pi-file"/>
          </template>
          <Divider class="mb-0" align="left"><i class="pi pi-th-large"/><b class="ml-1">{{ t('Product') }}</b>
          </Divider>
          <RelatedEntriesPicker v-model:relatedEntries="relatedEntry.products"
                                :type="META.ENTRY_TYPE.PRODUCT"/>
          <Divider class="mb-0" align="left"><i class="pi pi-users"/><b class="ml-1">{{ t('Person') }}</b></Divider>
          <RelatedEntriesPicker v-model:relatedEntries="relatedEntry.persons"
                                :type="META.ENTRY_TYPE.PERSON"/>
          <div v-if="dto.item.type !== META.ITEM_TYPE.ALBUM && dto.item.type !== META.ITEM_TYPE.BOOK">
            <Divider class="mb-0" align="left"><i class="pi pi-users"/><b class="ml-1">{{ t('Character') }}</b>
            </Divider>
            <RelatedEntriesPicker v-model:relatedEntries="relatedEntry.characters"
                                  :type="META.ENTRY_TYPE.CHARACTER"/>
          </div>
          <Divider class="mb-0" align="left"><i class="pi pi-folder-open"/><b class="ml-1">{{
              t('Classification')
            }}</b>
          </Divider>
          <RelatedEntriesPicker v-model:relatedEntries="relatedEntry.classifications"
                                :type="META.ENTRY_TYPE.CLASSIFICATION"/>
          <div v-if="dto.item.type === META.ITEM_TYPE.GOODS || dto.item.type === META.ITEM_TYPE.FIGURE">
            <Divider class="mb-0" align="left">
              <span style="font-size: 1rem" class="material-symbols-outlined">diamond</span>
              <b class="ml-1">{{ t('Material') }}</b>
            </Divider>
            <RelatedEntriesPicker v-model:relatedEntries="relatedEntry.materials"
                                  :type="META.ENTRY_TYPE.MATERIAL"/>
          </div>
          <Divider class="mb-0" align="left"><i class="pi pi-calendar"/><b class="ml-1">{{ t('Event') }}</b></Divider>
          <RelatedEntriesPicker v-model:relatedEntries="relatedEntry.events"
                                :type="META.ENTRY_TYPE.EVENT"/>
        </Panel>
      </div>
      <div class="col-12">
        <Panel>
          <MdEditor v-model="dto.item.detail" theme="dark" previewTheme="github"
                    :toolbarsExclude="['save', 'pageFullscreen', 'fullscreen',
                   'preview', 'previewOnly', 'htmlPreview', 'catalog', 'github']"/>
        </Panel>
      </div>
    </div>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="analysisBasicInfoDisplay" :header="t('Analysis')">
    <Textarea size="small" v-model="analysisBasicInfoText" rows="8" cols="20" class="static w-full"/>
    <Button size="small" class="mt-2" severity="info" @click="parseBasicInfo" icon="pi pi-file"/>
  </Dialog>
</template>

<style lang="scss" scoped>
@use "@/assets/entity-manager";
@use "@/assets/entity-global";
</style>