<script setup lang="ts">
import "@/styles/entity-browser.scss";
import "flag-icons/css/flag-icons.min.css";

import {API, Axios} from "@/api";
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";
import {PublicHelper} from "@/utils/publicHelper";
import {loadEditor} from "@/service/indexService";

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
  param.value.loading = true;
});

onMounted(() => {
  initQueryParam();
  load();
})

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
  try {
    const res = await Axios.post(API.INDEX.SEARCH, param.value.query);
    if (res.success()) {
      param.value.loadResult(res.data)
    }
  } finally {
    param.value.loading = false;
  }
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
  <div class="entity-browser">
    <div class="entity-browser-main">
      <DataView :value="param.loading ? Array.from({ length: param.query.size }) : param.result.data" layout="list">
        <template #header>
          <div class="grid" style="width: 100%">
            <div class="col-12 content-space-between">
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
            <span v-if="!param.loading" class="empty-search-result">
                {{ t('NoSearchResult') }}
            </span>
        </template>
        <template #list="{items}">
          <div class="entity-browser-index-list">
            <div v-if="param.loading" v-for="() in param.query.size" class="entity-browser-index-list-loading grid">
              <div class="col-fixed">
                <Skeleton size="5rem"/>
              </div>
              <div class="col" style="padding: .5rem 0 0 .25rem !important;width: 56rem;">
                <Skeleton width="30rem" height="1.5rem" style="margin: .3rem 0"/>
                <Skeleton width="50rem" height="1.2rem" style="margin: .3rem 0"/>
                <Skeleton width="20rem" height="1.1rem" style="margin: .3rem 0"/>
              </div>
              <div class="flex align-items-center justify-content-center" style="width: 4rem">
                <Skeleton size="2rem" height="1.5rem"/>
              </div>
            </div>
            <div v-else v-for="i in items" class="grid">
              <div class="entity-browser-index-list-thumb col-fixed">
                <a :href="`${$api.INDEX.DETAIL_PATH}/${i.id}`">
                  <img :alt="i.id" :src="i.cover"/>
                </a>
              </div>
              <div class="entity-browser-index-list-info col">
                <router-link :to="`${$api.INDEX.DETAIL_PATH}/${i.id}`" class="text-ellipsis-one"
                             style="width: 56rem" :title="i.name">{{ i.name }}
                </router-link>
                <span class="text-ellipsis-one" style="flex-shrink: 1;font-size: 1.1rem;flex-grow: 1;color: #B0C4DE"
                      :title="i.remark">{{ i.remark }}&nbsp;</span>
                <span style="flex-shrink: 0;font-size: 1rem;white-space: nowrap">
                  <span style="color: #2ea6ff">{{ i.createdBy }}</span>
                  <span style="color: #808080">•{{ t('CreatedAt') }}&nbsp;</span>
                  <span style="color: #999999">{{ PublicHelper.timeStamp2Date(i.createdAt) }}</span>
                  <span style="color: #808080">•{{ t('UpdatedAt') }}&nbsp;</span>
                  <span style="color: #999999">{{ PublicHelper.timeStamp2Date(i.updatedAt) }}</span>
                </span>
              </div>
              <RButton v-permission @click="loadEditor(i)" action="update"/>
            </div>
          </div>
        </template>
        <template #footer>
          <RPaginator v-model:page="param.query.page" v-model:size="param.query.size" v-model:blocked="param.loading"
                      alwaysShow :total="param.result.total" @page="onPage($event)" :time="param.result.time"/>
        </template>
      </DataView>
    </div>
  </div>

</template>

<style scoped lang="scss">
</style>