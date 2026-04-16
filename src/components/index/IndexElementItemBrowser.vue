<script setup lang="ts">
import "@/styles/index-element.scss";
import "flag-icons/css/flag-icons.min.css";

import {API, Axios} from "@/api";
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/store/modules/option";
import {bs} from '@/service/baseService';
import {EntitySearchParam} from "@/service/entityService";

const props = defineProps({
  indexId: {
    type: Number,
    required: false
  }
});

const ItemPopover = defineAsyncComponent(() => import('@/components/index/IndexElementItemPopover.vue'));
const selector = defineAsyncComponent(() => import('@/components/entry/EntrySelector.vue'));

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useOptionStore();
const {proxy} = getCurrentInstance()!;

const isGroup = ref(false);
const sortKey = ref(proxy!.$const.INDEX.ELEMENT.ITEM_SORT_OPTIONS[0]);
const sortOptions = ref<any[]>([
  {
    label: 'SORT BY',
    items: proxy!.$const.INDEX.ELEMENT.ITEM_SORT_OPTIONS
  },
  {
    label: 'GROUP BY',
    items: proxy!.$const.INDEX.ELEMENT.ITEM_GROUP_OPTIONS
  }
]);
const param = ref(new EntitySearchParam());

//region data view and paginator
const layout = ref('list');
const dataviewOptions = ref(['grid', 'list']);
const entries = ref<any[]>([]);
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
    indexId: {value: props.indexId}
  });
  param.value.query.size = 54;
  param.value.loading = true;
});

onMounted(async () => {
  await initQueryParam();
  await loadEntries();
  await loadItems();
})

watch(layout, (newValue) => {
  if (newValue === 'grid') {
    param.value.query.size = 54;
  } else {
    param.value.query.size = 50;
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
  param.value.initPage();
  loadItems();
}

const initQueryParam = async () => {
  const {query} = route;
  if (query.sort) {
    let sortField = query.sort.toString();
    if (proxy!.$const.INDEX.ELEMENT.ITEM_SORT_KEY_SET.includes(sortField)) {
      param.value.query.sortField = sortField;
      if (query.order) {
        let sortOrder = query.order.toString();
        switch (sortOrder) {
          case 'asc':
            param.value.query.sortOrder = 1;
            break;
          case 'desc':
            param.value.query.sortOrder = -1;
            break;
        }
      }
    }
  }
  if (query.group) {
    let groupField = query.group.toString();
    if (proxy!.$const.INDEX.ELEMENT.ITEM_GROUP_KEY_SET.includes(groupField)) {
      param.value.query.groupField = groupField;
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
    param.value.query.groupField = null;
  }

  if (param.value.query.filters.type.value) {
    entitySubType.value = proxy!.$const.ITEM_TYPE_SET.find(i => i.value === param.value.query.filters.type.value.toString())
  } else {
    entitySubType.value = null;
  }
}

const updateQueryParam = async () => {
  const {query: {filters, sortField, sortOrder, groupField, page}} = param.value;
  const curQuery = {...route.query};

  // 只在非第一页时添加page参数
  if (page > 1) {
    curQuery.p = page.toString();
  } else {
    delete curQuery.p;
  }

  proxy!.$const.ITEM_FILTER_KEY_SET.forEach(key => {
    if (filters[key]?.value || filters[key]?.value === 0) {
      curQuery[key] = filters[key].value;
    } else {
      delete curQuery[key];
    }
  });
  if (sortField && proxy!.$const.INDEX.ELEMENT.ITEM_SORT_KEY_SET.includes(sortField)) {
    delete curQuery.group;
    curQuery.sort = sortField;
    switch (parseInt(sortOrder!.toString())) {
      case 1:
        curQuery.order = 'asc';
        break;
      case -1:
        curQuery.order = 'desc';
        break;
      default:
        delete curQuery.order;
    }
    sortKey.value = sortOptions.value.flatMap(group => group.items)
        .find(op => op.field === sortField && op.order === sortOrder);
  } else if (groupField && proxy!.$const.INDEX.ELEMENT.ITEM_GROUP_KEY_SET.includes(groupField)) {
    delete curQuery.sort;
    delete curQuery.order;
    curQuery.group = groupField;
    sortKey.value = sortOptions.value.flatMap(group => group.items).find(op => op.field === groupField);
  } else {
    delete curQuery.sort;
    delete curQuery.order;
    let option = proxy!.$const.INDEX.ELEMENT.ITEM_SORT_OPTIONS[0];
    sortKey.value = option;
    curQuery.sort = option.field;
    curQuery.order = option.order.toString();

    param.value.query.sortField = curQuery.sort!.toString();
    param.value.query.sortOrder = parseInt(curQuery.order!.toString());
  }

  if (Array.isArray(param.value.query.filters.entries.value) && param.value.query.filters.entries.value.length) {
    curQuery.entries = param.value.query.filters.entries.value.join(',');
    delete curQuery.group;
  } else {
    delete curQuery.entries;
  }

  isGroup.value = !!groupField;

  const currentQueryStr = JSON.stringify(route.query);
  const newQueryStr = JSON.stringify(curQuery);
  if (currentQueryStr !== newQueryStr) {
    await router.push({path: route.path, query: curQuery});
  }
};

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1)
  loadItems();
};

const loadItems = async () => {
  param.value.query.filters.entries.value = entries.value.map(e => e.id)
  await updateQueryParam();
  param.value.loading = true;
  const res = await Axios.post(API.INDEX.GET_ITEMS_TMP, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.loading = false;
}

const loadEntries = async () => {
  if (!param.value.query.filters.entries.value.length) return;
  param.value.loading2 = true;
  const res = await Axios.post(API.ENTRY.MINI, param.value.query.filters.entries.value);
  if (res.success()) entries.value = res.data;
  param.value.loading2 = false;
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
    indexId: {value: param.value.query.filters.indexId.value}
  };
  if (entitySubType.value) {
    param.value.query.filters.type.value = parseInt(entitySubType.value.value);
  }
  sortKey.value = proxy!.$const.INDEX.ELEMENT.ITEM_SORT_OPTIONS[0];
  param.value.clearSort();
}

const onSortChange = (ev: any) => {
  if (proxy!.$const.INDEX.ELEMENT.ITEM_SORT_KEY_SET.includes(ev.value.field)) {
    param.value.query.sortField = ev.value.field;
    param.value.query.sortOrder = ev.value.order;

    param.value.query.groupField = null;
  } else if (proxy!.$const.INDEX.ELEMENT.ITEM_GROUP_KEY_SET.includes(ev.value.field)) {
    param.value.query.groupField = ev.value.field;

    param.value.query.sortField = null;
    param.value.query.sortOrder = 0;
  }
  param.value.query.page = 1;
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
      all: true,
      listId: props.indexId
    }
  })
}

const openLocalPath = async (id: number) => {
  await Axios.post(API.ENTITY.ENTITY_LOCAL_PATH, {
    entityType: proxy!.$const.ENTITY.ITEM,
    entitySubType: proxy!.$const.ITEM_TYPE.ALBUM,
    entityId: id
  });
}

const changeLocalCompletedFlag = async (item: any) => {
  const res = await Axios.post(API.ENTITY.ENTITY_LOCAL_COMPLETED_FLAG_CHANGE, {
    entityType: proxy!.$const.ENTITY.ITEM,
    entityId: item.id,
    flag: item.completedFlag ? 0 : 1
  });
  if (res.success()) {
    item.completedFlag = true;
    await loadItems();
  }
}

const getGroupLabel = (item: any) => {
  if (isGroup.value) {
    return item.entryId;
  } else {
    if (param.value.query.sortField === 'releaseDate' && item.releaseDate) {
      return item.releaseDate.substring(0, 7).replace('/', '-'); // Year-Month
    }
  }
  return null;
};

const isNewGroup = (item: any, prevItem: any) => {
  const label = getGroupLabel(item);
  if (!label) return false;
  if (!prevItem) return true;
  return label !== getGroupLabel(prevItem);
};
</script>

<template>
  <div class="index-element">
    <div class="index-element-main">
      <DataView :value="param.loading ? Array.from({ length: param.query.size }) : param.result.data" :layout="layout">
        <template #header>
          <div class="content-space-between">
            <SelectButton size="large" :options="$const.ITEM_TYPE_SET" :disabled="param.loading"
                          v-model="entitySubType" @change="switchEntitySubType"
                          optionLabel="value" ariaLabelledby="custom" :optionDisabled="'disabled'">
              <template #option="{option}">
                <RIcon :name="option.icon" :size="1.8"/>
                {{ t(option.label) }}
              </template>
            </SelectButton>

            <div style="align-items: center;display: flex;gap: 1rem">
              <Select v-model="sortKey" :options="sortOptions" filled @change="onSortChange"
                      optionGroupLabel="label" optionGroupChildren="items"
                      style="width: 13rem" scrollHeight="20rem" size="small">
                <template #optiongroup="{option}">
                  <div class="text-center">{{ option.label }}</div>
                </template>
                <template #value="{value}">
                  <div style="display: flex;align-items: center">
                    <RIcon v-if="value.order === -1 || value.order === 1" :name="value.order === -1 ? 'south' : 'north'"
                           :size="1.5"/>
                    <RIcon :name="value.icon" :size="1.5"/>
                    <span style="font-size: 1.2rem;margin-left: .5rem">{{ t(value.label) }}</span>
                  </div>
                </template>
                <template #option="{option}">
                  <RIcon v-if="option.order === -1 || option.order === 1"
                         :name="option.order === -1 ? 'south' : 'north'" :size="1.5"/>
                  <RIcon :name="option.icon" :size="1.5"/>
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
            <span v-if="!param.loading" class="empty-search-result">
                {{ t('NoSearchResult') }}
            </span>
        </template>
        <template #grid="{items}">
          <div class="index-element-item-grid-group">
            <div v-if="param.loading" v-for="() in param.query.size">
              <div class="index-element-item-grid-loading">
                <Skeleton/>
              </div>
            </div>
            <template v-else>
              <template v-for="(item, index) in (items as any[])" :key="item.id">
                <div v-if="isNewGroup(item, (items as any[])[index - 1])"
                     :class="isGroup ? 'index-element-item-grid-group-entry' : 'index-element-item-grid-group-date'">
                  <div v-if="isGroup" class="flex align-items-center">
                    <div class="index-element-item-grid-group-entry-thumb">
                      <a :href="`${$api.ENTRY.DETAIL_PATH}/${item.entryId}`" class="entry-thumb-list">
                        <img :alt="item.entryId" :src="item.entryThumb"/>
                      </a>
                    </div>
                    <div class="index-element-item-grid-group-entry-info">
                      <router-link class="text-ellipsis-one" :to="`${$api.ENTRY.DETAIL_PATH}/${item.entryId}`" :title="item.entryName">
                        {{ item.entryName }}
                      </router-link>
                      <span :title="item.entrySubName" class="text-ellipsis-one">{{ item.entrySubName }}</span>
                    </div>
                  </div>
                  <div v-else>
                    {{ getGroupLabel(item) }}
                  </div>
                </div>

                <router-link :to="`${$api.ITEM.DETAIL_PATH}/${item.id}`"
                             @pointerover="startHover($event, item)"
                             @pointerleave="endHover"
                             :class="`item-thumb-grid item-thumb-grid-${item.type.value}-${item.subType.value}`">
                  <img role="presentation" :alt="item.id" :src="item.thumb"/>
                </router-link>

              </template>
            </template>
          </div>
        </template>
        <template #list="{items}">
          <div class="index-element-item-list">
            <div v-if="param.loading" v-for="() in param.query.size" class="index-element-item-list-loading grid">
              <div class="col-fixed">
                <Skeleton size="3.7rem"/>
              </div>
              <div class="col" style="padding: 1rem 1.5rem 0 .25rem !important;">
                <Skeleton width="30rem" height="1.2rem"/>
                <Skeleton width="20rem" height="1.7rem"/>
              </div>
            </div>

            <template v-if="!param.loading">
              <template v-for="(item, index) in (items as any[])" :key="index">
                <div v-if="isNewGroup(item, (items as any[])[index - 1])" :class="isGroup ?
                'index-element-item-list-group-entry' : 'index-element-item-list-group-date'">
                  <div v-if="isGroup" class="flex align-items-center">


                    <div class="index-element-item-list-group-entry-thumb">
                      <a :href="`${$api.ENTRY.DETAIL_PATH}/${item.entryId}`" class="entry-thumb-list">
                        <img role="presentation" :alt="item.entryId" :src="item.entryThumb"/>
                      </a>
                    </div>
                    <div class="index-element-item-list-group-entry-info">
                      <router-link class="text-ellipsis-one" :to="`${$api.ENTRY.DETAIL_PATH}/${item.entryId}`" :title="item.entryName">
                        {{ item.entryName }}
                      </router-link>
                      <div style="display: flex; align-items: center">
                        <span class="text-ellipsis-one" style="flex: 1 1 auto; min-width: 0"
                              :title="item.entrySubName">{{ item.entrySubName }}</span>
                      </div>
                    </div>


                  </div>
                  <div v-else style="display: flex; align-items: center;">
                    {{ getGroupLabel(item) }}
                  </div>
                </div>
                <div class="grid relative">
                  <div v-permission style="position: absolute;top: 0;right: 1.6rem">
                    <RButton v-if="item.type.value === $const.ITEM_TYPE.ALBUM"
                             @click="changeLocalCompletedFlag(item)"
                             :severity="item.completedFlag ? 'success': 'danger'"
                             :icon="item.completedFlag ? 'folder_check' : 'folder_off'"
                             size="small" :tip="item.completedFlag ? 'LocalFileCompleted' : 'LocalFileNonCompleted'"/>&nbsp;
                    <RButton v-if="item.type.value === $const.ITEM_TYPE.ALBUM" icon="folder" size="small"
                             @click="openLocalPath(item.id)" severity="warn" tip="LocalFile"/>
                  </div>
                  <div class="index-element-item-list-thumb col-fixed">
                    <router-link :to="`${$api.ITEM.DETAIL_PATH}/${item.id}`" class="item-thumb-list"
                                 style="width: 3.5rem;height: 3.5rem">
                      <img role="presentation" :alt="item.id" :src="item.thumb" style="width: 3.5rem;height: 3.5rem"/>
                    </router-link>
                  </div>
                  <div class="index-element-item-list-info col">
                    <div class="text-ellipsis-one" style="max-width: 52rem">
                      <router-link :to="`${$api.ITEM.DETAIL_PATH}/${item.id}`"
                                   :title="item.name">{{ item.name }}
                      </router-link>
                    </div>
                    <div class="relative">
                      <Tag v-if="![$const.ITEM_TYPE.ALBUM, $const.ITEM_TYPE.VIDEO].includes(item.type.value)"
                           :value="item.subType.label"
                           :style="`color: var(--r-item-${item.type.value}-${item.subType.value})`"/>
                      <Tag v-else :value="item.type.label"
                           :style="`color: var(--r-item-${item.type.value}-${item.subType.value})`"/>
                      <span class="index-element-item-list-info-time" v-if="item.releaseDate">{{ item.releaseDate }}&nbsp;&nbsp;</span>
                      <span class="index-element-item-list-info-sub" v-if="item.barcode">
                        <span v-if="item.catalogId">{{ item.catalogId }}</span>
                      </span>
                      <i v-if="item.remark" style="margin-left: 2rem">{{ item.remark }}</i>
                    </div>
                  </div>
                </div>
              </template>
            </template>
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
    <Card class="index-element-side entity-editor">
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