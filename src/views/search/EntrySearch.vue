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
import {useOptionsStore} from "@/store/entityOptions";
import {ItemQueryParams} from "@/logic/itemService";
import {EntryQueryParams} from "@/logic/entryService";
import {PublicHelper} from "@/toolkit/publicHelper";
import {META} from "@/config/Web_Const";

const {t} = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const options = ref<any>({});
const optionsStore = useOptionsStore();

//region data view and paginator
const first = ref(0);
const layout = ref('list');
const dataviewOptions = ref(['list']);
const loading = ref(false);
//endregion

const queryParams = new EntryQueryParams();
const searchResult = ref({
  total: 0,
  time: 0,
  data: []
});

onBeforeMount(async () => {
  await optionsStore.fetchOptions();
  options.value = optionsStore.options;
});

onMounted(() => {
  initQueryParam();
  getEntities();
  first.value = (queryParams.page - 1) * queryParams.size;
})

const entryType = ref();
const switchItemType = () => {
  if (entryType.value === null) {
    queryParams.type = null;
    return
  }
  queryParams.type = parseInt(entryType.value.value);
}

const initQueryParam = async () => {
  queryParams.type = getNumberValue(route.query.type);
  queryParams.keywords = route.query.keywords ? route.query.keywords.split(',') : []
  queryParams.keyword = queryParams.keywords.join(',')
  queryParams.page = getNumberValue(route.query.page, 1);

  if (queryParams.type !== null) {
    entryType.value = META.ENTRY_TYPE_SET.find(i => i.value === queryParams.type?.toString())
  } else {
    entryType.value = META.ENTRY_TYPE_SET[0]
  }
  // queryParams.size = getNumberValue(route.query.size, 60);
}

const getStringValue = (value: string | null | LocationQueryValue[] | undefined): string | null => {
  return typeof value === 'string' ? value : null;
};

const getNumberValue = (value: string | null | LocationQueryValue[] | undefined, defaultValue: number | null = null): number | null => {
  return typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : defaultValue;
};

const updateQueryParam = () => {
  // 获取当前查询参数对象
  const currentQueryParams = {...route.query};

  // 修改查询参数的值
  if (queryParams.page !== null) {
    currentQueryParams.page = queryParams.page;
  } else {
    delete currentQueryParams.page
  }
  if (queryParams.keywords !== null) {
    currentQueryParams.keywords = queryParams.keywords.join(',');
  } else {
    delete currentQueryParams.keyword
  }
  if (queryParams.type !== null) {
    currentQueryParams.type = queryParams.type;
  } else {
    delete currentQueryParams.type
  }

  // 使用 router.push 更新 URL
  router.push({path: route.path, query: currentQueryParams});
};

const onPage = (ev) => {
  queryParams.page = ev.page + 1;
  getEntities();
}

const getEntities = async () => {
  queryParams.keywords = PublicHelper.splitAndTrim(queryParams.keyword);
  updateQueryParam();
  loading.value = true;
  const res = await axios.post(API.ENTRY_SEARCH, queryParams);
  if (res.state === axios.SUCCESS) {
    if (res.data.data === null)
      searchResult.value.data = [];
    else
      searchResult.value.data = res.data.data;
    searchResult.value.total = res.data.total;
    searchResult.value.time = res.data.searchTime;
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  loading.value = false;
}

const search = () => {
  resetPage();
  getEntities();
}

const clearFilter = () => {
  resetPage();
  resetFilter();
  getEntities();

}

const resetPage = () => {
  queryParams.page = 1;
  first.value = 0;
}

const resetFilter = () => {
  queryParams.keyword = '';
  queryParams.keywords = [];
}
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
                {{ $t('NoSearchResult') }}
            </span>
        </template>
        <template #list="slotProps">
          <div class="entry-search-list">
            <div v-if="loading" v-for="(index_1) in 60" :key="index_1">
              <Skeleton height="50px"/>
            </div>
            <div v-if="!loading" v-for="(entry, index) in slotProps.items" :key="index" class="grid">
              <div class="entry-search-list-thumb col-fixed">
                <a :href="`${API.ENTRY_DETAIL}/${entry.id}`"
                   class="entry-thumb">
                  <img role="presentation" :alt="entry.id" :src="(entry as any).thumb"/>
                </a>
              </div>
              <div class="entry-search-list-info col">
                <a :href="`${API.ENTRY_DETAIL}/${entry.id}`" class="text-overflow-hidden-one"
                   :title="entry.name">{{ entry.name }}</a>
                <span class="text-overflow-hidden-one"
                   :title="entry.subName">{{ entry.subName }}</span>
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
                {{ searchResult.total }} entries
              </template>
            </Paginator>
          </BlockUI>
        </template>
      </DataView>
    </div>
    <div class="entity-search-side-col">
      <Panel>
        <BlockUI :blocked="loading">
          <div class="field">
            <SelectButton class="w-full justify justify-content-center" size="small" v-model="entryType"
                          :options="META.ENTRY_TYPE_SET"
                          @change="switchItemType"
                          optionLabel="value" dataKey="value" ariaLabelledby="custom" optionDisabled="disabled">
              <template #option="slotProps">
                <span class="material-symbols-outlined">{{ slotProps.option.icon }}</span>
              </template>
            </SelectButton>
          </div>
          <div class="field">
            <FloatLabel variant="on">
              <label>{{ $t('Keyword') }}</label>
              <InputText size="small" v-model="queryParams.keyword" class="static w-full"/>
            </FloatLabel>
          </div>
        </BlockUI>
        <template #footer>
          <BlockUI :blocked="loading">
            <div class="relative">
              <div class="bottom-0 right-0">
                <Button size="small" icon="pi pi-search" @click="search"/>
                <Button size="small" icon="pi pi-filter-slash" variant="text" @click="clearFilter"
                        severity="danger"/>
              </div>
            </div>
          </BlockUI>
        </template>
      </Panel>
    </div>
  </div>

</template>

<style scoped lang="scss">
</style>