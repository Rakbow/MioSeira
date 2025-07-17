<script setup lang="ts">
import "@/styles/entity-search.scss";
import "flag-icons/css/flag-icons.min.css";

import {API, Axios} from "@/api";
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";
import {PublicHelper} from "@/utils/publicHelper";

const EntryTypeSelector = defineAsyncComponent(() => import('@/components/entry/EntryTypeSelector.vue'));

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const param = ref<EntitySearchParam>(new EntitySearchParam());
const sortKey = ref({label: 'Item', icon: 'lists', field: 'items', order: -1});
const sortOptions = ref<any[]>([
  {label: 'Item', icon: 'lists', field: 'items', order: -1},
  {label: 'Date', icon: 'calendar_today', field: 'date', order: 1},
  {label: 'Date', icon: 'calendar_today', field: 'date', order: -1}
]);
onBeforeMount(() => {
  param.value.initFilters({
    type: {value: null},
    keyword: {value: ''}
  });
  param.value.query.size = 10;
});

onMounted(() => {
  initQueryParam();
  load();
})

const switchEntitySubType = (value: any) => {
  param.value.query.filters.type.value = value;
  load();
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
  param.value.query.filters.type.value = query.type ? parseInt(query.type?.toString()) : null;
}

const updateQueryParam = () => {
  const {query: {filters, sortField, sortOrder, page}} = param.value;
  const curQuery = {...route.query};

  curQuery.page = page.toString();

  ['type', 'keyword'].forEach(key => {
    if (filters[key]?.value || filters[key]?.value === 0) {
      curQuery[key] = filters[key].value;
    } else {
      delete curQuery[key];
    }
  });

  if (sortField && ['date'].includes(sortField)) {
    curQuery.sort = sortField;
    curQuery.order = sortOrder === 1 ? 'asc' : sortOrder === -1 ? 'desc' : null;
    sortKey.value = sortOptions.value.find(op => op.field === sortField && op.order === sortOrder);
  } else {
    delete curQuery.sort;
    delete curQuery.order;
    sortKey.value = sortOptions.value[0];
  }

  router.push({path: route.path, query: curQuery});
};

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1)
  load();
}

const load = async () => {
  updateQueryParam();
  param.value.loading = true;
  const res = await Axios.post(API.ENTRY.SEARCH, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data)
  }
  param.value.loading = false;
}

const search = () => {
  param.value.initPage();
  load();
}

const clearFilter = () => {
  param.value.initPage();
  resetFilter();
  load();
}

const resetFilter = () => {

  param.value.query.filters.keyword.value = '';
  sortKey.value = sortOptions.value[0];
  param.value.clearSort();
}

const onSortChange = (ev: any) => {
  if (!['date'].includes(ev.value.field)) return;
  param.value.query.sortField = ev.value.field;
  param.value.query.sortOrder = ev.value.order;
  load();
};
</script>

<template>
  <div class="entity-search">
    <div class="entity-search-main">
      <DataView :value="param.result.data" layout="list">
        <template #header>
          <div class="grid" style="width: 100%">
            <div class="col-12"
                 style="display: flex;justify-content: space-between;align-items: center;height: auto;width: 100%">
              <EntryTypeSelector v-model="param.query.filters.type.value"
                                 @update="switchEntitySubType" :disabled="param.loading" />
              <Select v-model="sortKey" :options="sortOptions" filled style="width: 13rem" scrollHeight="20rem"
                      @change="onSortChange" size="small" :disabled="param.loading">
                <template #value="{value}">
                  <div style="display: flex;align-items: center">
                    <RIcon :name="value.order === -1 ? 'south' : 'north'" :size="1.5"/>
                    <RIcon :name="value.icon" :size="1.5"/>
                    <span style="font-size: 1.2rem;margin-left: .5rem">{{ t(value.label) }}</span>
                  </div>
                </template>
                <template #option="{option}">
                  <RIcon :name="option.order === -1 ? 'south' : 'north'" :size="1.5"/>
                  <RIcon :name="option.icon" :size="1.5"/>
                  <span style="font-size: 1.2rem;margin-left: .5rem">{{ t(option.label) }}</span>
                </template>
              </Select>
            </div>
            <div class="col-fixed">
              <IconField>
                <InputIcon class="pi pi-search"/>
                <InputText size="large" :placeholder="t('Keyword')" v-model="param.query.filters.keyword.value"
                           style="width: 63rem" @keyup.enter="search" :disabled="param.loading"/>
                <InputIcon class="pi pi-spin pi-spinner" v-if="param.loading"/>
              </IconField>
            </div>
            <div class="col">
              <RButton size="small" action="clear" @click="clearFilter" :disabled="param.loading"/>
            </div>
          </div>
        </template>
        <template #empty>
            <span class="empty-search-result">
                {{ t('NoSearchResult') }}
            </span>
        </template>
        <template #list="{items}">
          <div class="entity-search-entry-list">
            <div v-if="param.loading" v-for="() in param.query.size" class="entity-search-entry-list-loading grid">
              <div class="col-fixed">
                <Skeleton size="3.5rem"/>
              </div>
              <div class="col" style="padding: .5rem 0 0 .25rem !important;width: 56rem;">
                <Skeleton width="30rem" height="1.2rem" style="margin: .3rem 0"/>
                <Skeleton width="20rem" height="1rem" style="margin: .3rem 0"/>
              </div>
              <div class="flex align-items-center justify-content-center" style="width: 4rem">
                <Skeleton size="2rem" height="1.5rem"/>
              </div>
            </div>
            <div v-if="!param.loading" v-for="entry in items" class="grid">
              <div class="entity-search-entry-list-thumb col-fixed">
                <a :href="`${$api.ENTRY.DETAIL_PATH}/${entry.id}`" class="entry-thumb-list">
                  <img role="presentation" :alt="entry.id" :src="entry.thumb"/>
                </a>
              </div>
              <div class="entity-search-entry-list-info col">
                <router-link :to="`${$api.ENTRY.DETAIL_PATH}/${entry.id}`" class="text-ellipsis-one"
                             style="width: 56rem"
                             :title="entry.name">{{ entry.name }}
                </router-link>

                <span style="width: 56rem;display: flex;align-items: center;white-space: nowrap;overflow: hidden;">
                  <span class="text-ellipsis-one" style="flex-shrink: 1;flex-grow: 1;font-size: 1rem;color: #999999"
                        :title="entry.subName">{{ entry.subName }}</span>
                  <span style="flex-shrink: 0;white-space: nowrap;margin-left: .8rem;">
                    <i v-if="entry.gender.value" :class="PublicHelper.getGenderIcon(entry.gender.value)"/>
                    <span v-if="entry.date" class="entity-search-entry-list-info-time"
                          style="display: inline">{{ entry.date }}</span>
                  </span>
                </span>
              </div>
              <div class="flex align-items-center justify-content-center" style="width: 4rem">
                <span class="material-symbols-outlined"
                      style="font-size: 2rem;font-weight: 700"
                      :style="`color: var(--r-entry-${entry.type.value})`">
                      {{ $const.ENTRY_TYPE_SET[entry.type.value - 1].icon }}
                    </span>
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
  </div>

</template>

<style scoped lang="scss">
</style>