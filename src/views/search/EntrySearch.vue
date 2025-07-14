<script setup lang="ts">
import "@/styles/entity-search.scss";
import "flag-icons/css/flag-icons.min.css";

import {API, Axios} from "@/api";
import {getCurrentInstance, onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";
import {PublicHelper} from "@/utils/publicHelper";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance()!;

//region data view and paginator
const layout = ref('list');
const dataviewOptions = ref(['list']);
//endregion
const entryType = ref();
const param = ref<EntitySearchParam>(new EntitySearchParam());

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

const switchItemType = () => {
  if (entryType.value === null) {
    param.value.query.filters.type.value = null;
  } else {
    param.value.query.filters.type.value = parseInt(entryType.value.value);
  }
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

  if (param.value.query.filters.type.value) {
    entryType.value = proxy!.$const.ENTRY_TYPE_SET.find(i => i.value === param.value.query.filters.type.value.toString())
  } else {
    entryType.value = proxy!.$const.ENTRY_TYPE_SET[0]
  }
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

  if (sortField) {
    curQuery.sort = sortField;
    curQuery.order = sortOrder === 1 ? 'asc' : sortOrder === -1 ? 'desc' : null;
  } else {
    delete curQuery.sort;
    delete curQuery.order;
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
}
</script>

<template>
  <div class="entity-search">
    <div class="entity-search-main">
      <DataView :value="param.result.data" :layout="layout">
        <template #header>
          <div class="flex">
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
        <template #list="{items}">
          <div class="entity-search-entry-list">
            <div v-if="param.loading" v-for="() in param.query.size" class="entity-search-entry-list-loading grid">
              <div class="col-fixed">
                <Skeleton size="3.5rem"/>
              </div>
              <div class="col" style="padding: .5rem 0 0 .25rem !important;width: 54rem;">
                <Skeleton width="30rem" height="1.2rem" style="margin: .3rem 0"/>
                <Skeleton width="20rem" height="1rem" style="margin: .3rem 0"/>
              </div>
              <div class="flex align-items-center relative" style="width: 6.5rem">
                <Skeleton width="3rem" height="1.5rem"/>
                <Skeleton size="2rem" height="1.5rem" style="right: 1rem !important;position: absolute"/>
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
                             style="width: 54rem"
                             :title="entry.name">{{ entry.name }}
                </router-link>

                <span style="width: 54rem;display: flex;align-items: center;white-space: nowrap;overflow: hidden;">
                  <span class="text-ellipsis-one" style="flex-shrink: 1;flex-grow: 1;font-size: 1rem;color: #999999"
                        :title="entry.subName">{{ entry.subName }}</span>
                  <span style="flex-shrink: 0;white-space: nowrap;margin-left: 8px;">
                    <i v-if="entry.gender.value" :class="PublicHelper.getGenderIcon(entry.gender.value)"/>
                    <span v-if="entry.date" class="entity-search-entry-list-info-time"
                          style="display: inline">{{ entry.date }}</span>
                  </span>
                </span>
              </div>
              <div class="flex align-items-center relative" style="width: 6.5rem">
                <span style="color: gray;font-size: 1rem">{{ t($const.ENTRY_TYPE_SET[entry.type.value].label) }}</span>
                <span class="material-symbols-outlined"
                      style="font-size: 2rem;right: 1rem !important;position: absolute;font-weight: 700"
                      :style="`color: var(--r-entry-${entry.type.value})`">
                      {{ $const.ENTRY_TYPE_SET[entry.type.value].icon }}
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
    <div class="entity-search-side entity-editor">
      <Card>
        <template #content>
          <BlockUI :blocked="param.loading">
            <div class="field">
              <SelectButton class="w-full justify justify-content-center" size="small" v-model="entryType"
                            :options="$const.ENTRY_TYPE_SET"
                            @change="switchItemType"
                            optionLabel="value" dataKey="value" ariaLabelledby="custom" :optionDisabled="'disabled'">
                <template #option="{option}">
                  <RIcon :name="option.icon" v-tooltip.bottom="{value: t(option.label)}"/>
                </template>
              </SelectButton>
            </div>
            <FloatLabel class="field" variant="on">
              <label>{{ t('Keyword') }}</label>
              <InputText size="large" v-model="param.query.filters.keyword.value" class="static w-full"/>
            </FloatLabel>
          </BlockUI>
        </template>
        <template #footer>
          <BlockUI :blocked="param.loading">
            <div class="relative">
              <div class="bottom-0 right-0">
                <RButton @click="search" icon="search"/>
                <RButton @click="clearFilter" icon="filter_alt_off" severity="danger"/>
              </div>
            </div>
          </BlockUI>
        </template>
      </Card>
    </div>
  </div>

</template>

<style scoped lang="scss">
</style>