<template>
  <Toast/>
  <BlockUI :blocked="editBlock">
    <DataTable ref="dt" :value="images" :alwaysShowPaginator="images.length !== 0"
               lazy :totalRecords="totalRecords" :loading="loading"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" v-model:filters="filters"
               paginator :rows="5" :first="first"
               scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]" size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;">
      <template #empty>
        <span class="emptyInfo">
            {{ t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ t('CommonDataTableLoadingInfo') }}</span>
      </template>
      <Column style="width: 100px">
        <template #body="slotProps">
          <div class="edit-img-box">
            <img :src="slotProps.data.thumb" :alt="slotProps.data.name"
                 class="entry-thumb image-click" @click="imageClick(slotProps.index)" />
          </div>
        </template>
      </Column>
      <Column :header="t('Type')" field="type" filterField="type"
              :showFilterMenu="false" :sortable="true" style="width: 5rem;">
        <template #body="slotProps">
          <div style="display: flex;justify-content: center;">
            <Tag :value="slotProps.data.type.label"/>
          </div>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Select v-model="filterModel.value" :options="store.options.imageTypeSet" @change="filterCallback()"
                  optionLabel="label" optionValue="value" Style="min-width: 100px"/>
        </template>
      </Column>
      <Column :header="t('Info')" field="name">
        <template #body="slotProps">
          {{ slotProps.data.name }}<br>
          {{ slotProps.data.addedTime }}
        </template>
      </Column>
    </DataTable>
  </BlockUI>
  <ImageGalleria :images="images" v-model:activeIndex="activeIndex" v-model:visible="displayCustom" />
</template>

<script setup lang="ts">
import {useToast} from 'primevue/usetoast';
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {API} from '@/config/Web_Helper_Strs';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo} from "@/config/Web_Const";
import {useEntityStore} from "@/logic/entityService";

const ImageGalleria = defineAsyncComponent(() => import('@/components/image/ImageGalleria.vue'));

const route = useRoute();
const {t} = useI18n();
const toast = useToast();
const editBlock = ref(false);
const images = ref<any>([]);
const totalRecords = ref(0);
const loading = ref(false);
const queryParams = ref({});
const first = ref(0);
const dt = ref();
const entityInfo = ref<EntityInfo>();
const store = useEntityStore();

onBeforeMount(() => {
  store.fetchOptions();
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted(async () => {
  filters.value.entityType.value = entityInfo.value?.type;
  filters.value.entityId.value = entityInfo.value?.id;
  queryParams.value = {
    first: 0,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  };
  await getImages();
});

const filters = ref({
  'entityType': {value: entityInfo.value?.type},
  'entityId': {value: entityInfo.value?.id},
  'type': {value: -2}
});

const onPage = (ev) => {
  queryParams.value = ev;
  getImages();
};
const onSort = (ev) => {
  queryParams.value = ev;
  getImages();
};
const onFilter = () => {
  if(filters.value.type.value === null)
    filters.value.type.value = -2;
  queryParams.value.filters = filters.value;
  getImages();
};

const getImages = async () => {
  loading.value = true;
  const res = await axios.post(API.IMAGE_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    images.value = res.data.data;
    totalRecords.value = res.data.total
  } else {
    toast.add(new PToast().error(res.message));
  }
  loading.value = false;
  first.value = queryParams.value.first;
}

const activeIndex = ref(0)
const displayCustom = ref(false)
const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
</script>

<style lang="scss" scoped>

.edit-img-box {
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000; /* 方便查看边框 */
}

</style>