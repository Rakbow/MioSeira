<script setup lang="ts">
import "@/styles/entity-search.scss";
import "flag-icons/css/flag-icons.min.css";

import {API, Axios} from "@/api";
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/store/modules/option";
import {bs} from '@/service/baseService';
import {EntitySearchParam} from "@/service/entityService";

const ItemPopover = defineAsyncComponent(() => import('@/components/item/ItemPopover.vue'));
const CurrencySelect = defineAsyncComponent(() => import('@/components/global/CurrencySelect.vue'));
const selector = defineAsyncComponent(() => import('@/components/entry/EntrySelector.vue'));

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useOptionStore();

const sortKey = ref({label: 'ReleaseDate', icon: 'event_available', field: 'releaseDate', order: -1});
const sortOptions = ref<any[]>([
  {label: 'AddedTime', icon: 'calendar_add_on', field: 'id', order: -1},
  {label: 'AddedTime', icon: 'calendar_add_on', field: 'id', order: 1},
  {label: 'ReleaseDate', icon: 'event_available', field: 'releaseDate', order: -1},
  {label: 'ReleaseDate', icon: 'event_available', field: 'releaseDate', order: 1},
  {label: 'Price', icon: 'paid', field: 'price', order: -1},
  {label: 'Price', icon: 'paid', field: 'price', order: 1},
]);
const param = ref(new EntitySearchParam());

//region data view and paginator
const layout = ref('grid');
const dataviewOptions = ref(['grid', 'list']);
const entries = ref<any[]>([]);
const {proxy} = getCurrentInstance()!;
//endregion

onBeforeMount(() => {
  store.fetchOptions();
  param.value.initFilters({
    type: {value: null},
    subType: {value: null},
    releaseType: {value: null},
    keyword: {value: ''},
    barcode: {value: ''},
    catalogId: {value: ''},
    region: {value: ''},
    entries: {value: new Array<number>()},
  });
  param.value.query.size = 45;
});

onMounted(async () => {
  await initQueryParam();
  await loadEntries();
  await loadItems();
})

watch(layout, (newValue) => {
  if (newValue === 'grid') {
    param.value.query.size = 45;
  } else {
    param.value.query.size = 10;
  }
  param.value.query.page = 1;
  loadItems()
})

const entitySubType = ref();
const switchEntitySubType = (ev: any) => {
  if (ev.value) {
    param.value.query.filters.type.value = parseInt(entitySubType.value.value);
  } else {
    entitySubType.value = null;
    param.value.query.filters.type.value = null;
  }
  loadItems();
}

const initQueryParam = async () => {
  const {query} = route;

  if (query.sort) {
    param.value.query.sortField = query.sort.toString();
    if (query.order) {
      param.value.query.sortOrder = query.order.toString() === 'desc' ? -1 : 1;
    }
  }

  param.value.query.page = parseInt(query.page?.toString() ?? '1');

  param.value.query.filters.keyword.value = query.keyword?.toString() ?? '';
  param.value.query.filters.barcode.value = query.barcode?.toString() ?? '';
  param.value.query.filters.catalogId.value = query.catalogId?.toString() ?? '';
  param.value.query.filters.region.value = query.region?.toString() ?? '';

  param.value.query.filters.type.value = query.type ? parseInt(query.type?.toString()) : null;
  param.value.query.filters.subType.value = query.subType ? parseInt(query.subType?.toString()) : null;

  if (query.entries) {
    param.value.query.filters.entries.value = query.entries.toString().split(',').map(Number)
  }

  if (param.value.query.filters.type.value) {
    entitySubType.value = proxy!.$const.ITEM_TYPE_SET.find(i => i.value === param.value.query.filters.type.value.toString())
  } else {
    entitySubType.value = null;
  }
}

const updateQueryParam = () => {
  const {query: {filters, sortField, sortOrder, page}} = param.value;
  const curQuery = {...route.query};

  curQuery.page = page.toString();

  ['type', 'subType', 'releaseType',
    'keyword', 'barcode', 'region', 'catalogId'].forEach(key => {
    if (filters[key]?.value || filters[key]?.value === 0) {
      curQuery[key] = filters[key].value;
    } else {
      delete curQuery[key];
    }
  });

  if (sortField && ['price', 'releaseDate'].includes(sortField)) {
    curQuery.sort = sortField;
    curQuery.order = sortOrder === 1 ? 'asc' : sortOrder === -1 ? 'desc' : null;
    sortKey.value = sortOptions.value.find(op => op.field === sortField && op.order === sortOrder);
  } else {
    delete curQuery.sort;
    delete curQuery.order;
    sortKey.value = sortOptions.value[0];
  }

  if (Array.isArray(param.value.query.filters.entries.value) && param.value.query.filters.entries.value.length) {
    curQuery.entries = param.value.query.filters.entries.value.join(',');
  } else {
    delete curQuery.entries;
  }

  router.push({path: route.path, query: curQuery});
};

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1)
  loadItems();
};

const loadItems = async () => {
  param.value.query.filters.entries.value = entries.value.map(e => e.id)
  updateQueryParam();
  param.value.loading = true;
  const res = await Axios.post(API.ITEM.SEARCH, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  } else {
    bs!.toast.error(res.message);
  }
  param.value.loading = false;
}

const loadEntries = async () => {
  if (param.value.query.filters.entries.value.length) {
    param.value.loading2 = true;
    const res = await Axios.post(API.ENTRY.MINI, param.value.query.filters.entries.value);
    if (res.success()) entries.value = res.data;
    param.value.loading2 = false;
  }
}

const clearEntries = () => {
  entries.value = [];
  param.value.query.filters.entries.value = [];
  loadItems();
}

const removeEntries = (id: number) => {
  entries.value = entries.value.filter(e => e.id !== id);
  param.value.query.filters.entries.value = (param.value.query.filters.entries.value as number[]).filter(i => i !== id);
}

const search = () => {
  param.value.initPage();
  loadItems();
}

const clearFilter = () => {
  param.value.initPage();
  resetFilter();
  loadItems();
}

const resetFilter = () => {
  param.value.query.filters = {
    keyword: {value: ''},
    barcode: {value: ''},
    catalogId: {value: ''},
    region: {value: ''},
    type: {value: null},
    subType: {value: null},
    releaseType: {value: null},
    entries: {value: []},
  };
  if(entitySubType.value) {
    param.value.query.filters.type.value = parseInt(entitySubType.value.value);
  }
  sortKey.value = sortOptions.value[0];
  param.value.clearSort();
}

const onSortChange = (ev: any) => {
  param.value.query.sortField = ev.value.field;
  param.value.query.sortOrder = ev.value.order;
  loadItems();
};

//region pop

const selectedItem = ref();
const op = ref();
const startHover = (ev: PointerEvent, item: any) => {
  selectedItem.value = item;
  op.value.show(ev);
};

const endHover = () => {
  op.value.hide();
};

//endregion

const openSelector = () => {
  bs!.dialog.open(selector, {
    props: {
      header: t('Entry'),
      style: {
        width: '60rem'
      },
      modal: true,
      closable: true
    },
    data: {
      entries: entries.value,
      all: true
    }
  })
}

</script>

<template>
  <div class="entity-search">
    <div class="entity-search-main">
      <DataView :value="param.result.data" :layout="layout">
        <template #header>
          <div style="display: flex;justify-content: space-between;align-items: center;height: auto;width: 100%">
            <SelectButton size="large" :options="$const.ITEM_TYPE_SET" :disabled="param.loading"
                          v-model="entitySubType" @change="switchEntitySubType"
                          optionLabel="value" ariaLabelledby="custom" :optionDisabled="'disabled'">
              <template #option="{option}">
                <RIcon :name="option.icon" :size="1.8"/>
                {{ t(option.label) }}
              </template>
            </SelectButton>

            <div style="align-items: center;display: flex;gap: 1rem">
              <Select v-model="sortKey" :options="sortOptions" filled style="width: 13rem" scrollHeight="20rem"
                      @change="onSortChange" size="small">
                <template #value="{value}">
                  <div style="display: flex;align-items: center">
                    <RIcon :name="value.order === -1 ? 'south' : 'north'" :size="1.5" />
                    <RIcon :name="value.icon" :size="1.5" />
                    <span style="font-size: 1.2rem;margin-left: .5rem">{{ t(value.label) }}</span>
                  </div>
                </template>
                <template #option="{option}">
                  <RIcon :name="option.order === -1 ? 'south' : 'north'" :size="1.5" />
                  <RIcon :name="option.icon" :size="1.5" />
                  <span style="font-size: 1.2rem;margin-left: .5rem">{{ t(option.label) }}</span>
                </template>
              </Select>

              <SelectButton v-model="layout" :options="dataviewOptions" :allowEmpty="false" :disabled="param.loading">
                <template #option="{ option }">
                  <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']"/>
                </template>
              </SelectButton>
            </div>
          </div>
        </template>
        <template #empty>
            <span class="empty-search-result">
                {{ t('NoSearchResult') }}
            </span>
        </template>
        <template #grid="{items}">
          <div class="entity-search-item-grid">
            <div v-if="param.loading" v-for="() in param.query.size">
              <div class="entity-search-item-grid-loading">
                <Skeleton/>
              </div>
            </div>
            <div v-else v-for="item in items as any[]">
              <router-link :to="`${$api.ITEM.DETAIL_PATH}/${item.id}`"
                           @pointerover="startHover($event, item)" @pointerleave="endHover"
                           :class="`item-thumb-grid item-thumb-grid-${item.type.value}-${item.subType.value}`">
                <img role="presentation" :alt="item.id" :src="item.thumb"/>
              </router-link>
            </div>
          </div>
        </template>
        <template #list="{items}">
          <div class="entity-search-item-list">
            <div v-if="param.loading" v-for="() in param.query.size" class="entity-search-item-list-loading grid">
              <div class="col-fixed">
                <Skeleton size="6rem"/>
              </div>
              <div class="col" style="padding: 1rem 1.5rem 0 .25rem !important;">
                <Skeleton width="30rem" height="1.2rem"/>
                <Skeleton width="5rem" height="1.6rem" style="margin: .2rem 0"/>
                <Skeleton width="20rem" height="1.7rem"/>
              </div>
            </div>
            <div class="grid" v-if="!param.loading" v-for="item in items as any[]">
              <div class="entity-search-item-list-thumb col-fixed">
                <router-link :to="`${$api.ITEM.DETAIL_PATH}/${item.id}`" class="item-thumb-list">
                  <img role="presentation" :alt="item.id" :src="item.thumb"/>
                </router-link>
              </div>
              <div class="entity-search-item-list-info col">
                <router-link :to="`${$api.ITEM.DETAIL_PATH}/${item.id}`" class="text-ellipsis-one"
                             :title="item.name">{{ item.name }}
                </router-link>
                <Tag v-if="![$const.ITEM_TYPE.ALBUM, $const.ITEM_TYPE.DISC].includes(item.type.value)"
                     :value="item.subType.label"
                     :style="`color: var(--r-item-${item.type.value}-${item.subType.value})`"/>
                <Tag v-else :value="item.type.label"
                     :style="`color: var(--r-item-${item.type.value}-${item.subType.value})`"/>
                <div class="relative">
                  <span class="entity-search-item-list-info-time" v-if="item.releaseDate">{{ item.releaseDate }}&nbsp;&nbsp;</span>
                  <span class="entity-search-item-list-info-sub" v-if="item.barcode">
                    <span v-if="item.catalogId">{{ item.catalogId }}&nbsp;•&nbsp;</span>
                    <span v-if="item.barcode">{{ item.barcode }}</span>
                  </span>
                  <span v-if="item.price" style="position: absolute;right: 0">
                    {{ item.price }}
                    <CurrencySelect v-model="item.currency" :query="`${item.price}+${item.currency}`"/>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <BlockUI :blocked="param.loading">
            <RPaginator v-model:page="param.query.page" v-model:size="param.query.size" alwaysShow
                        :total="param.result.total" @page="onPage($event)" :time="param.result.time"/>
          </BlockUI>
        </template>
      </DataView>
    </div>
    <Card class="entity-search-side entity-editor">
      <template #content>
        <Divider align="left"><i class="pi pi-list"/><b>{{ t('BasicInfo') }}</b></Divider>
        <FloatLabel class="field" variant="on">
          <label>{{ t('Keyword') }}</label>
          <InputText size="large" v-model="param.query.filters.keyword.value" :disabled="param.loading"/>
        </FloatLabel>
        <div class="grid">
          <FloatLabel variant="on">
            <label>{{ t('Barcode') }}</label>
            <InputText size="large" v-model="param.query.filters.barcode.value" :disabled="param.loading"/>
          </FloatLabel>
          <FloatLabel variant="on">
            <label>{{ t('CatalogId') }}</label>
            <InputText size="large" v-model="param.query.filters.catalogId.value" :disabled="param.loading"/>
          </FloatLabel>
        </div>
        <div class="grid">
          <FloatLabel variant="on">
            <label>{{ t('ReleaseType') }}</label>
            <Select v-model="param.query.filters.releaseType.value" :options="store.options.releaseTypeSet"
                    size="large" optionLabel="label" optionValue="value" :disabled="param.loading"/>
          </FloatLabel>
          <FloatLabel variant="on">
            <label>{{ t('Region') }}</label>
            <Select v-model="param.query.filters.region.value" :options="$const.RegionSet" optionLabel="label"
                    size="large" optionValue="value" :disabled="param.loading">
              <template #value="{value}">
                <span :class="`fi fi-${value}`"/>
              </template>
              <template #option="{option}">
                <span :class="`fi fi-${option!.value}`"/>
              </template>
            </Select>
          </FloatLabel>
        </div>
        <div class="relative">
          <div class="bottom-0 right-0">
            <RButton @click="search" icon="search" :disabled="param.loading"/>
            <RButton @click="clearFilter" icon="filter_alt_off" severity="danger" :disabled="param.loading"/>
          </div>
        </div>
        <Divider align="left"><i class="pi pi-th-large"/><b>{{ t('RelatedEntry') }}</b></Divider>
        <RButton @click="openSelector" action="create" :disabled="param.loading"/>
        <RButton @click="clearEntries" action="clear" v-if="entries.length" :disabled="param.loading"/>
        <div class="grid" style="padding: 1.25rem" v-if="entries">
          <div v-if="param.loading2" class="field">
            <Skeleton width="30rem" height="4.6rem"/>
          </div>
          <div v-if="entries.length && !param.loading2">
            <div class="related-entity" style="width: 30rem"
                 v-for="(entry, index) in entries as any[]" :key="index">
              <div class="related-entity-thumb">
                <img role="presentation" :alt="entry.name" :src="entry.thumb"/>
              </div>
              <div class="related-entity-info">
                <router-link :to="`${$api.ENTRY.DETAIL_PATH}/${entry.id}`"
                             :title="entry.name">{{ entry.name }}
                </router-link>
                <small :title="entry.subName">
                  {{ entry.subName }}
                </small>
              </div>
              <div class="related-entity-role">
                <RButton action="clear" @click="removeEntries(entry.id)"/>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Popover ref="op">
      <ItemPopover :item="selectedItem"/>
    </Popover>
  </div>
</template>

<style scoped lang="scss">
</style>