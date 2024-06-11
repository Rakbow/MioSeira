<template>
  <Toast/>
  <BlockUI :blocked="editBlock">
    <DataTable ref="dt" :value="images" class="p-datatable-sm" :alwaysShowPaginator="images.length !== 0"
               lazy :totalRecords="totalRecords" :loading="loading"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               filterDisplay="row" v-model:filters="filters"
               paginator :rows="5" :first="first"
               scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]" showGridlines
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}">
      <template #empty>
        <span class="emptyInfo">
            {{ $t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ $t('CommonDataTableLoadingInfo') }}</span>
      </template>
      <Column style="width: 100px">
        <template #body="slotProps">
          <div class="edit-img-box">
            <img :src="slotProps.data.thumbUrl70" :alt="slotProps.data.name"
                 class="edit-image"/>
          </div>
        </template>
      </Column>
      <Column :header="$t('Type')" field="type" filterField="type"
              :showFilterMenu="false" :sortable="true" style="width: 5rem">
        <template #body="slotProps">
          <Tag :value="PublicHelper.value2Label(slotProps.data.type, imageTypeSet)"/>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Select v-model="filterModel.value" :options="imageTypeSet" @change="filterCallback()"
                  optionLabel="label" optionValue="value" Style="min-width: 100px"/>
        </template>
      </Column>
      <Column :header="$t('Info')" field="name">
        <template #body="slotProps">
          {{ `${slotProps.data.name}/${slotProps.data.nameZh}`}}<br>
          {{ `${slotProps.data.addedTime}`}}
        </template>
      </Column>
    </DataTable>
  </BlockUI>
</template>

<script setup lang="ts">
import {useToast} from 'primevue/usetoast';
import {inject, onMounted, ref} from "vue";
import {API} from '@/config/Web_Helper_Strs.ts';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {PublicHelper} from "@/toolkit/publicHelper.ts";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";

const dialogRef = inject("dialogRef");
const route = useRoute();
const {t} = useI18n();
const toast = useToast();
const entityType = ref();
const entityId = ref();
const editBlock = ref(false);
const images = ref<any>([]);
const totalRecords = ref(0);
const loading = ref(false);
const queryParams = ref({});
const first = ref(0);
const dt = ref();

const imageTypeSet = ref(
    [
      {label: '默认', value: 0},
      {label: '缩略图', value: 1},
      {label: '封面', value: 2}
    ]
);

onMounted(async () => {
  getEntityInfo();
  filters.value.entityType.value = entityType.value;
  filters.value.entityId.value = entityId.value;
  queryParams.value = {
    first: 0,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  };
  await getImages();
});

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = parseInt(route.params.id.toString());
}

const filters = ref({
  'entityType': {value: entityType.value},
  'entityId': {value: entityId.value},
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
  const res = await axios.post(API.GET_IMAGES, queryParams.value);
  if (res.state === axios.SUCCESS) {
    images.value = res.data.data;
    totalRecords.value = res.data.total
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  loading.value = false;
  first.value = queryParams.value.first;
}

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