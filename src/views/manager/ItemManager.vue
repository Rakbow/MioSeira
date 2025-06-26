<script setup lang="ts">
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useRoute, useRouter} from "vue-router";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/itemService";
import "flag-icons/css/flag-icons.min.css";
import 'material-icons'
import {EntityManageParam, useEntityStore} from '@/logic/entityService';
import {PublicHelper} from "@/toolkit/publicHelper";
import {PColumn} from "@/logic/frame";

const {t} = useI18n();
const dt = ref();
const dialog = useDialog();
const store = useEntityStore();
const route = useRoute();
const router = useRouter();
const param = ref(new EntityManageParam());

const basicColumnCount = ref(0);
const otherColumnCount = ref(0);

const itemType = ref();

onBeforeMount(async () => {
  itemType.value = META.ITEM_TYPE_SET[store.itemCurrent === 0 ? 0 : store.itemCurrent - 1];
  param.value.query.initFilters({
    type: {value: store.itemCurrent},
    keyword: {value: ''}
  });
  param.value.initColumns([
    new PColumn('remark', t('Remark')),
    new PColumn('addedTime', t('AddedTime')),
    new PColumn('editedTime', t('EditedTime'))
  ])
})

onMounted(() => {
  initQueryParam();
  load();
})

watch(
    itemType, (val) => {
      if (val.value === '1') {
        basicColumnCount.value = 7;
      } else if (val.value === '2') {
        basicColumnCount.value = 7;
      } else if (val.value === '5') {
        basicColumnCount.value = 7;
      } else if (val.value === '6') {
        basicColumnCount.value = 7;
      }
    },
    {deep: true}
)

const switchItemType = (ev: any) => {
  if (ev.value === null)
    itemType.value = META.ITEM_TYPE_SET[0];
  store.itemCurrent = parseInt(itemType.value.value);
  param.value.query.filters.type.value = store.itemCurrent;
  param.value.query.clearSort();
  param.value.query.initPage(dt.value.rows);
  load();
}

const initQueryParam = async () => {
  let page: number = PublicHelper.isNotUndefined(route.query.page) ? parseInt(route.query.page!.toString()) : 1;

  param.value.query.first = (page - 1) * dt.value.rows;
  param.value.query.rows = dt.value.rows;
  param.value.query.filters.keyword.value = PublicHelper.isNotUndefined(route.query.keyword) ? route.query.keyword : '';
}

const updateQueryParam = () => {
  const currentQueryParams = {...route.query};

  currentQueryParams.page = (param.value.query.first / dt.value.rows + 1).toString();
  currentQueryParams.size = dt.value.rows;

  if (PublicHelper.isNotEmpty(param.value.query.filters.type.value)) {
    currentQueryParams.type = param.value.query.filters.type.value;
  } else {
    delete currentQueryParams.type;
  }

  if (PublicHelper.isNotEmpty(param.value.query.filters.keyword.value)) {
    currentQueryParams.keyword = param.value.query.filters.keyword.value;
  } else {
    delete currentQueryParams.keyword;
  }

  router.push({path: route.path, query: currentQueryParams});
};

const onPage = (ev: any) => {
  param.value.query.first = ev.first;
  param.value.query.rows = ev.rows;
  load();
};
const onSort = (ev: any) => {
  param.value.query.initPage(dt.value.rows);
  param.value.query.sortField = ev.sortField;
  param.value.query.sortOrder = ev.sortOrder;
  load();
};
const onFilter = () => {
  param.value.query.initPage(dt.value.rows);
  load();
};

const onToggle = (val: PColumn[]) => {
  param.value.selectedColumns = param.value.columns.filter(col => val.includes(col));
};

const load = async () => {
  param.value.first = param.value.query.first;
  updateQueryParam();
  param.value.load();
  const res = await axios.post(API.ITEM_LIST, param.value.query);
  if (res.state === axios.SUCCESS) {
    param.value.data = res.data.data;
    param.value.total = res.data.total
  }
  param.value.endLoad();
}

//region item CRUD
const displayDeleteDialog = ref(false);

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const openCreateTab = () => {
  window.open(API.ITEM_CREATE_PATH, '_blank');
}

//endregion

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<template>
  <DataTable ref="dt" :value="param.data" class="p-datatable-sm small-font" :alwaysShowPaginator="param.data.length !== 0"
             lazy v-model:filters="param.query.filters" :totalRecords="param.total" :loading="param.loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator :rows="10" :first="param.first" stripedRows size="small" showGridlines
             v-model:selection="param.selectedData" dataKey="id" removableSort
             scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="{first} to {last} of {totalRecords}" responsiveLayout="scroll">
    <template #header>
      <BlockUI :blocked="param.block" class="relative">
        <SelectButton size="small" v-model="itemType" :options="META.ITEM_TYPE_SET" @change="switchItemType($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="slotProps">
            <span class="material-symbols-outlined" style="font-size: 20px">{{ slotProps.option.icon }}</span>
          </template>
        </SelectButton>

        <Button variant="text" outlined @click="openCreateTab">
          <template #icon>
            <span class="material-symbols-outlined">add_box</span>
          </template>
        </Button>
        <Button variant="text" severity="danger" :disabled="!param.selectedData.length"
                outlined @click="confirmDeleteSelected">
          <template #icon>
            <span class="material-symbols-outlined">delete_forever</span>
          </template>
        </Button>
        <Button variant="text" severity="help" :disabled="param.selectedData.length"
                outlined @click="exportCSV">
          <template #icon>
            <span class="material-symbols-outlined">open_in_new</span>
          </template>
        </Button>

        <MultiSelect :model-value="param.selectedColumns" :options="param.columns" optionLabel="header"
                     @update:modelValue="onToggle" :placeholder="t('SelectedDisplayColumns')"
                     size="small"
                     style="width: 200px;right: 0;position: absolute;top: 50%;transform: translateY(-50%);"/>
      </BlockUI>
    </template>
    <template #empty>
        <span class="emptyInfo">
            {{ t('CommonDataTableEmptyInfo') }}
        </span>
    </template>
    <template #loading>
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <span>{{ t('CommonDataTableLoadingInfo') }}</span>
    </template>

    <ColumnGroup type="header">
      <Row>
        <Column :colspan="2" :rowspan="2"/>
        <Column :header="t('Item')" :rowspan="2">
          <template #header>
            <i class="pi pi-th-large"/>
          </template>
        </Column>
        <Column :header="t('BasicInfo')" :colspan="7">
          <template #header>
            <i class="pi pi-list"/>
          </template>
        </Column>
        <Column :header="t('Attachment')" :colspan="2">
          <template #header>
            <i class="pi pi-file"/>
          </template>
        </Column>
      </Row>
      <Row>
        <Column :header="t('Type')" :sortable="true" field="subType" style="width: 80px"
                v-if="![META.ITEM_TYPE.ALBUM, META.ITEM_TYPE.DISC].includes(store.itemCurrent)"/>
        <Column :header="t('CatalogId')" :sortable="true" field="catalogId" style="width: 115px"
                v-if="![META.ITEM_TYPE.BOOK, META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
        <Column :header="t('Barcode')" :sortable="true" field="barcode" style="width: 100px"/>
        <Column :header="t('ReleaseDate')" :sortable="true" field="releaseDate" style="width: 80px"/>
        <Column :header="t('Price')" :sortable="true" field="price" style="width: 80px"/>
        <Column :header="t('Region')" :sortable="true" field="region" style="width: 60px"/>
        <Column :header="t('ReleaseType')" :sortable="true" field="releaseType" style="width: 80px"/>
        <Column :header="t('Bonus')" :sortable="true" field="bonus" style="width: 60px"
                v-if="![META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
        <Column :header="t('Scale')" :sortable="true" field="scale" style="width: 60px"
                v-if="[META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
        <Column :header="t('Image')" style="width: 40px"/>
        <Column :header="t('File')" style="width: 40px"/>
      </Row>
    </ColumnGroup>

    <Column selectionMode="multiple" style="width: 35px" exportable/>
    <Column style="width: 45px">
      <template #body="slotProps">
        <Button variant="text" outlined size="small" @click="loadEditor(slotProps.data, dialog)">
          <template #icon>
            <span style="font-size: 15px" class="material-symbols-outlined">edit_square</span>
          </template>
        </Button>
      </template>
    </Column>

    <Column field="name" filterField="keyword" :showFilterMenu="false" showClearButton
            exportHeader="name" :sortable="true" style="flex: 0 0 5rem">
      <template #body="{data}">
        <a :href="`${API.ITEM_DETAIL_PATH}/${data.id}`">
          <div :title="data.name"
               style="width: 300px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
            {{ data!.name }}
          </div>
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 90%" size="small" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column v-if="![META.ITEM_TYPE.ALBUM, META.ITEM_TYPE.DISC].includes(store.itemCurrent)" bodyClass="text-center" :bodyStyle="{padding: 0}">
      <template #body="{data}">
        <Tag :value="data.subType.label" style="padding: 0 .5rem;font-size: 11px;font-weight: normal"/>
      </template>
    </Column>
    <Column field="catalogId"
            v-if="![META.ITEM_TYPE.BOOK, META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
    <Column field="barcode"/>
    <Column field="releaseDate"/>
    <Column field="price">
      <template #body="{data}">
        {{ data!.price ? `${data!.price} ${data!.currency}` : '' }}
      </template>
    </Column>
    <Column bodyClass="text-center">
      <template #body="slotProps">
        <span :class="`fi fi-${slotProps.data.region}`"/>
      </template>
    </Column>
    <Column>
      <template #body="{data}">
        <Tag :value="data.releaseType.label" style="padding: 0 .5rem;font-size: 11px;font-weight: normal"/>
      </template>
    </Column>
    <Column dataType="boolean" bodyClass="text-center"
            v-if="![META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(store.itemCurrent)">
      <template #body="{data}">
        <i class="pi pi-check-circle" v-if="data.bonus"></i>
      </template>
    </Column>
    <Column field="scale" v-if="[META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
    <Column field="imageCount"/>
    <Column field="fileCount"/>
    <Column v-for="(col, index) of param.selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style lang="scss" scoped>
@use "@/assets/entity-manager";
</style>