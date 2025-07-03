<script setup lang="ts">
import "@/assets/entity-global.scss";
import "@/assets/entity-search.scss";
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';
import "flag-icons/css/flag-icons.min.css";

import {API} from "@/config/Web_Helper_Strs";
import {defineAsyncComponent, onBeforeMount, onMounted, ref, watch} from "vue";
import {LocationQueryValue, useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useEntityStore} from "@/logic/entityService";
import {ItemQueryParams} from "@/logic/itemService";
import {META} from "@/config/Web_Const";

const ItemPopover = defineAsyncComponent(() => import('@/components/item/ItemPopover.vue'));
const EntrySelector = defineAsyncComponent(() => import('@/components/selector/EntrySelector.vue'));

const {t} = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const store = useEntityStore();

//region data view and paginator
const first = ref(0);
const layout = ref('grid');
const dataviewOptions = ref(['grid', 'list']);
const loading = ref(false);
const entryLoading = ref(false);
const entries = ref(<any>[]);
//endregion

const displayEntrySelector = ref(false);
const queryParams = new ItemQueryParams();
const searchResult = ref({
  total: 0,
  time: 0,
  data: []
});

onBeforeMount(() => {
  store.fetchOptions();
});

onMounted(async () => {
  await initQueryParam();
  await getRelatedEntries();
  await getItems();
  first.value = (queryParams.page - 1) * queryParams.size;
})

watch(layout, (newValue) => {
  if (newValue === 'grid') {
    queryParams.size = 60;
  } else {
    queryParams.size = 20;
  }
  resetPage();
  getItems()
})

const itemTypeSet = [
  {icon: 'filter_alt_off', value: null},
  {icon: 'music_note', value: '1'},
  {icon: 'menu_book', value: '2'},
  {icon: 'tv', value: '3'},
  {icon: 'stadia_controller', value: '4'},
  {icon: 'category', value: '5'},
  {icon: 'accessibility', value: '6'}
]
const itemType = ref();
const switchItemType = () => {
  if (itemType.value === null) {
    queryParams.type = null;
    return
  }
  if (itemType.value.value === null)
    queryParams.type = null;
  else
    queryParams.type = parseInt(itemType.value.value);
}

const initQueryParam = async () => {
  // 解析 entry 参数
  if (Array.isArray(route.query.entry)) {
    queryParams.entries = route.query.entry.map(item => {
      const [entryId] = item.split(',');
      return {
        id: parseInt(entryId, 10)
      };
    });
  } else if (route.query.entry) {
    // 如果 entry 是单个字符串
    const [entityId] = route.query.entry.split(',');
    queryParams.entries = [parseInt(entityId, 10)];
  }
  queryParams.keyword = getStringValue(route.query.keyword);
  queryParams.type = getNumberValue(route.query.type);
  queryParams.subType = getNumberValue(route.query.subType);
  queryParams.releaseType = getNumberValue(route.query.releaseType);
  queryParams.bonus = getNumberValue(route.query.bonus);
  queryParams.barcode = getStringValue(route.query.barcode);
  queryParams.catalogId = getStringValue(route.query.catalogId);
  queryParams.region = getStringValue(route.query.region);
  queryParams.page = getNumberValue(route.query.page, 1);
  queryParams.sortField = getStringValue(route.query.sortField);
  queryParams.sortOrder = getNumberValue(route.query.sortOrder);

  if (queryParams.type !== null) {
    itemType.value = itemTypeSet.find(i => i.value === queryParams.type?.toString())
  } else {
    itemType.value = itemTypeSet[0]
  }
}

const getStringValue = (value: string | null | LocationQueryValue[] | undefined): string | null => {
  return typeof value === 'string' ? value : null;
};

const getNumberValue = (value: string | null | LocationQueryValue[] | undefined, defaultValue: number | null = null): number | null => {
  return typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : defaultValue;
};

const updateQueryParam = () => {
  // 构造查询参数
  const query = {...route.query};

  // 防御逻辑
  // 1. 如果 page 大于 1，则加入路由参数
  if (queryParams.page) {
    query.page = queryParams.page;
  } else {
    delete query.page;
  }

  // 2. 如果 entries 非空，则加入路由参数
  if (Array.isArray(queryParams.entries) && queryParams.entries.length) {
    query.entry = queryParams.entries.join(',');
  } else {
    delete query.entry;
  }

  // 3. 如果 keyword 去除首尾空格后非空，则加入路由参数
  const trimmedKeyword = queryParams.keyword?.trim();
  if (trimmedKeyword) {
    query.keyword = trimmedKeyword;
  } else {
    delete query.keyword;
  }

  const trimmedBarcode = queryParams.barcode?.trim();
  if (trimmedBarcode) {
    query.barcode = trimmedBarcode;
  } else {
    delete query.barcode;
  }

  const trimmedCatalogId = queryParams.catalogId?.trim();
  if (trimmedCatalogId) {
    query.catalogId = trimmedCatalogId;
  } else {
    delete query.catalogId;
  }

  if (queryParams.type) {
    query.type = queryParams.type;
  } else {
    delete query.type;
  }

  if (queryParams.subType) {
    query.subType = queryParams.subType;
  } else {
    delete query.subType;
  }

  if (queryParams.releaseType) {
    query.releaseType = queryParams.releaseType;
  } else {
    delete query.releaseType;
  }

  if (queryParams.bonus) {
    query.bonus = queryParams.bonus;
  } else {
    delete query.bonus;
  }

  // 更新路由
  router.replace({path: route.path, query: query});
};

const onPage = (ev) => {
  queryParams.page = ev.page + 1;
  getItems();
}

const getItems = async () => {
  searchResult.value.data = Array.from({length: 60});
  queryParams.entries = entries.value.map(e => e.id)
  updateQueryParam();
  loading.value = true;
  const res = await axios.post(API.ITEM_SEARCH, queryParams);
  if (res.state === axios.SUCCESS) {
    if (res.data.data === null)
      searchResult.value.data = [];
    else
      searchResult.value.data = res.data.data;
    searchResult.value.total = res.data.total;
    searchResult.value.time = res.data.searchTime;
  } else {
    toast.add(new PToast().error(res.message));
  }
  loading.value = false;
}

const getRelatedEntries = async () => {
  if (queryParams.entries.length) {
    entryLoading.value = true;
    const res = await axios.post(API.ENTRY_GET_MINI, queryParams.entries);
    if (res.state === axios.SUCCESS) {
      entries.value = res.data;
    }
    entryLoading.value = false;
  }
}

const clearEntries = () => {
  entries.value = [];
  queryParams.entries = [];
  getItems();
}

const removeEntries = (index: number) => {
  entries.value.splice(index, 1);
}

const search = () => {
  resetPage();
  getItems();
}

const clearFilter = () => {
  resetPage();
  resetFilter();
  getItems();

}

const resetPage = () => {
  queryParams.page = 1;
  first.value = 0;
}

const resetFilter = () => {
  itemType.value.value = null
  queryParams.keyword = null;
  queryParams.barcode = null;
  queryParams.catalogId = null;
  queryParams.region = null;
  queryParams.type = null;
  queryParams.subType = null;
  queryParams.releaseType = null;
  queryParams.bonus = null;
}

//region pop

const selectedItem = ref();
const op = ref();
const startHover = (event: PointerEvent, item: any) => {
  selectedItem.value = item;
  op.value.show(event);
};

const endHover = () => {
  op.value.hide();
};

//endregion
</script>

<template>
  <Toast/>
  <div class="flex flex-wrap justify-content-center gap-3">
    <div class="entity-search-main-col">
      <DataView :value="searchResult.data" :layout="layout">
        <template #header>
          <div class="flex justify-end">
            <SelectButton v-model="layout" :options="dataviewOptions" :allowEmpty="false">
              <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']"/>
              </template>
            </SelectButton>
          </div>
        </template>
        <template #empty>
            <span class="empty-search-result">
                {{ t('NoSearchResult') }}
            </span>
        </template>
        <template #grid="slotProps">
          <div class="item-search-grid">
            <div v-if="loading" v-for="(index_1) in 60" :key="index_1">
              <div class="item-thumb-loading">
                <Skeleton size="60px"/>
              </div>
            </div>
            <div v-else v-for="(item, index) in slotProps.items" :key="index">
              <a :href="`${API.ITEM_DETAIL_PATH}/${item.id}`"
                 @pointerover="startHover($event, item)" @pointerleave="endHover"
                 :class="`item-thumb item-thumb-${item.type.value}-${item.subType.value}`">
                <img role="presentation" :alt="item.id" :src="(item as any).thumb"/>
              </a>
            </div>
          </div>
        </template>
        <template #list="slotProps">
          <div class="item-search-list">
            <div v-if="loading" v-for="(index_1) in 60" :key="index_1">
              <Skeleton height="78px"/>
            </div>
            <div v-if="!loading" v-for="(item, index) in slotProps.items" :key="index" class="grid">
              <div class="item-search-list-thumb col-fixed">
                <a :href="`${API.ITEM_DETAIL_PATH}/${item.id}`"
                   :class="`item-thumb item-thumb-${item.type.value}-${item.subType.value}`">
                  <img role="presentation" :alt="item.id" :src="(item as any).thumb"/>
                </a>
              </div>
              <div class="item-search-list-info col">
                <a :href="`${API.ITEM_DETAIL_PATH}/${item.id}`" class="text-overflow-hidden-one"
                   :title="item.name">{{ item.name }}</a>
                <Tag :value="item.type.label"/>
                <span v-if="item.type.value !== META.ITEM_TYPE.ALBUM">
                  <i class="pi pi-caret-right"/><Tag :value="item.subType.label"/>
                </span>
                <div>
                  <span class="item-search-list-info-time" v-if="item.releaseDate">{{ item.releaseDate }}&nbsp;</span>
                  <span class="item-search-list-info-sub" v-if="item.barcode">
                    <span v-if="item.catalogId">{{ item.catalogId }}&nbsp;•&nbsp;</span>
                    <span v-if="item.barcode">{{ item.barcode }}</span>
                  </span>
                  <!--                  <span :class="'fi fi-' + item.region" />-->
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <BlockUI :blocked="loading">
            <Paginator v-model:first="first" :rows="queryParams.size" :totalRecords="searchResult.total"
                       @page="onPage($event)" :alwaysShow="searchResult.total !== 0">
              <template #start>
                search in {{ searchResult.time }}s
              </template>
              <template #end>
                {{ searchResult.total }} items
              </template>
            </Paginator>
          </BlockUI>
        </template>
      </DataView>
    </div>
    <div class="entity-search-side-col">
      <Panel>
        <BlockUI :blocked="loading">
          <Divider align="left"><i class="pi pi-list"/><b>{{ t('BasicInfo') }}</b></Divider>
          <div class="field">
            <SelectButton class="w-full justify justify-content-center" size="small" v-model="itemType"
                          :options="itemTypeSet"
                          @change="switchItemType"
                          optionLabel="value" dataKey="value" ariaLabelledby="custom" optionDisabled="disabled">
              <template #option="slotProps">
                <span class="material-symbols-outlined">{{ slotProps.option.icon }}</span>
              </template>
            </SelectButton>
          </div>
          <div class="field">
            <FloatLabel variant="on">
              <label>{{ t('Keyword') }}</label>
              <InputText size="small" v-model="queryParams.keyword" class="static w-full"/>
            </FloatLabel>
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <FloatLabel variant="on">
                <label>{{ t('Barcode') }}</label>
                <InputText size="small" v-model="queryParams.barcode" class="static w-full"/>
              </FloatLabel>
            </div>
            <div class="field col">
              <FloatLabel variant="on">
                <label>{{ t('CatalogId') }}</label>
                <InputText size="small" v-model="queryParams.catalogId" class="static w-full"/>
              </FloatLabel>
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <FloatLabel variant="on">
                <label>{{ t('ReleaseType') }}</label>
                <Select v-model="queryParams.releaseType" :options="store.options.releaseTypeSet"
                        size="small" optionLabel="label" optionValue="value" class="static w-full"/>
              </FloatLabel>
            </div>
            <div class="field col">
              <FloatLabel variant="on">
                <label>{{ t('Region') }}</label>
                <Select v-model="queryParams.region" :options="META.RegionSet" optionLabel="label"
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
              <ToggleButton size="small" v-model="queryParams.bonus"
                            onIcon="pi true-icon pi-check-circle" :onLabel="t('BonusInclusion')"
                            offIcon="pi false-icon pi-times-circle" :offLabel="t('BonusExclusion')"/>
            </div>
          </div>
          <div class="relative">
            <div class="bottom-0 right-0">
              <Button size="small" icon="pi pi-search" @click="search"/>
              <Button size="small" icon="pi pi-filter-slash" variant="text" @click="clearFilter"
                      severity="danger"/>
            </div>
          </div>
          <Divider align="left"><i class="pi pi-th-large"/><b>{{ t('RelatedEntity') }}</b></Divider>
          <Button variant="text" outlined @click="displayEntrySelector = true">
            <template #icon>
              <span class="material-symbols-outlined">add_box</span>
            </template>
          </Button>
          <Button v-if="entries.length" variant="text" severity="danger"
                  outlined @click="clearEntries">
            <template #icon>
              <span class="material-symbols-outlined">delete_forever</span>
            </template>
          </Button>
          <div class="search-entities grid" v-if="entries">
            <div v-if="entryLoading" class="field">
              <Skeleton height="70px"/>
            </div>
            <div v-if="entries.length && !entryLoading" class="field flex flex-wrap">
              <div class="search-entities-block grid" v-for="(entry, index) in entries" :key="index">
                <div class="col-fixed">
                  <div class="entry-thumb">
                    <img role="presentation" :alt="entry.name" :src="entry.thumb"/>
                  </div>
                </div>
                <div class="col" style="width: 212px;">
                    <span class="data-table-field-text-overflow-hidden">
                      <a :href="`${API.ENTRY_DETAIL_PATH}/${entry.id}`" :title="entry.name">{{ entry.name }}</a>
                    </span>
                  <small style="color: gray" class="data-table-field-text-overflow-hidden">
                    {{ (entry as any).subName }}
                  </small>
                </div>
                <div class="col-fixed">
                  <Button size="small" icon="pi pi-trash" severity="danger" variant="text"
                          @click="removeEntries(index)"/>
                </div>
              </div>
            </div>
          </div>
        </BlockUI>
      </Panel>
    </div>

    <Popover ref="op">
      <ItemPopover :item="selectedItem"/>
    </Popover>
  </div>

  <Dialog :modal="true" v-model:visible="displayEntrySelector" :style="{width: '600px'}" :header="t('Add')">
    <EntrySelector :all="true" :entries="entries"/>
  </Dialog>
</template>

<style scoped lang="scss">
</style>