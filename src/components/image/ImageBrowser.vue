<template>
  <BlockUI :blocked="param.block">
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
  <ImageViewer :images="images" v-model:activeIndex="activeIndex" v-model:visible="displayCustom" />
</template>

<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, onMounted, ref} from "vue";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/store/modules/option";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const ImageViewer = defineAsyncComponent(() => import('@/components/image/ImageViewer.vue'));

const {t} = useI18n();
const param = ref(new EditParam());
const images = ref<any>([]);
const totalRecords = ref(0);
const loading = ref(false);
const queryParams = ref({});
const first = ref(0);
const dt = ref();
const dialogRef = inject<any>('dialogRef');
const store = useOptionStore();

onBeforeMount(() => {
  store.fetchOptions();
})

onMounted(async () => {
  filters.value.entityType.value = dialogRef.value.data.type;
  filters.value.entityId.value = dialogRef.value.data.id;
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
  'entityType': {value: dialogRef.value.data.type},
  'entityId': {value: dialogRef.value.data.id},
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
  const res = await Axios.post(API.IMAGE.LIST, queryParams.value);
  if (res.success()) {
    images.value = res.data.data;
    totalRecords.value = res.data.total
  } else {
    bs!.toast.error(res.message);
  }
  loading.value = false;
  first.value = queryParams.value.first;
}

const activeIndex = ref(0)
const displayCustom = ref(false)
const imageClick = (index: number) => {
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