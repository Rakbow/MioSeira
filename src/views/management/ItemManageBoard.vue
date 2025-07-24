<script setup lang="ts">
import {getCurrentInstance, onBeforeMount, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/service/itemService";
import "flag-icons/css/flag-icons.min.css";
import {EntitySearchParam} from '@/service/entityService';
import {useOptionStore} from "@/store/modules/option";
import {PColumn} from "@/service/frame";

const {t} = useI18n();
const dt = ref();
const store = useOptionStore();
const route = useRoute();
const router = useRouter();
const param = ref(new EntitySearchParam());
const {proxy} = getCurrentInstance()!;
const basicColumnCount = ref(0);
const itemType = ref();

onBeforeMount(async () => {
  itemType.value = proxy!.$const.ITEM_TYPE_SET[store.itemCurrent === 0 ? 0 : store.itemCurrent - 1];
  param.value.initFilters({
    type: {value: store.itemCurrent},
    keyword: {value: ''}
  });
  param.value.initColumns([
    new PColumn('remark', t('Remark'))
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
    itemType.value = proxy!.$const.ITEM_TYPE_SET[0];
  store.itemCurrent = parseInt(itemType.value.value);
  param.value.query.filters.type.value = store.itemCurrent;
  param.value.clearSort();
  param.value.initPage();
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
}

const updateQueryParam = () => {
  const {query: {filters, sortField, sortOrder, page}} = param.value;
  const curQuery = {...route.query};

  curQuery.page = page.toString();

  ['type', 'keyword'].forEach(key => {
    if (filters[key]?.value) {
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
  param.value.initPage(ev.page + 1);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage();
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};
const onFilter = () => {
  param.value.initPage();
  load();
};

const onToggle = (val: PColumn[]) => {
  param.value.selectedColumns = param.value.columns.filter(col => val.includes(col));
};

const load = async () => {
  updateQueryParam();
  param.value.load();
  const res = await Axios.post(API.ITEM.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
}

//region item CRUD
const displayDeleteDialog = ref(false);

const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

const openCreateTab = () => {
  window.open(API.ITEM.CREATE_PATH, '_blank');
}

//endregion

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<template>
  <DataTable ref="dt" :value="param.result.data" class="entity-manager-datatable"
             lazy v-model:filters="param.query.filters" :loading="param.loading"
             @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             stripedRows size="small" showGridlines paginator alwaysShowPaginator
             v-model:selection="param.selectedData" dataKey="id" removableSort
             v-model:rows="param.query.size"
             scrollable scrollHeight="flex" responsiveLayout="scroll">
    <template #empty>
      <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
      <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <RIcon class="pi-spin" name="autorenew" size="10rem"/>
    </template>
    <template #paginatorcontainer>
      <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                  :total="param.result.total" @page="onPage($event)" :time="param.result.time"
                  :sizeOptions="[15, 30 ,50]" @update:rows="param.query.size = $event"/>
    </template>
    <template #header>
      <SelectButton size="small" v-model="itemType" :options="$const.ITEM_TYPE_SET" @change="switchItemType($event)"
                    optionLabel="value" dataKey="value" ariaLabelledby="custom" :optionDisabled="'disabled'">
        <template #option="{option}">
          <RIcon :name="option!.icon" :size="1.6"/>
          <span style="font-size: 1.2rem">{{ t(option!.label) }}</span>
        </template>
      </SelectButton>
      <RButton @click="openCreateTab" action="create"/>
      <RButton @click="confirmDeleteSelected" action="delete"
               :disabled="!param.selectedData.length"/>
      <RButton @click="exportCSV" action="export"
               severity="help" :disabled="!param.result.total"/>
      <MultiSelect :model-value="param.selectedColumns" :options="param.columns" optionLabel="header"
                   @update:modelValue="onToggle" :placeholder="t('SelectedDisplayColumns')" size="large"/>
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
        <Column :header="t('Type')" :sortable="true" field="subType" style="width: 9rem"
                v-if="![$const.ITEM_TYPE.ALBUM, $const.ITEM_TYPE.DISC].includes(store.itemCurrent)"/>
        <Column :header="t('CatalogId')" :sortable="true" field="catalogId" style="width: 11rem"
                v-if="![$const.ITEM_TYPE.BOOK, $const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
        <Column :header="t('Barcode')" :sortable="true" field="barcode" style="width: 9rem"/>
        <Column :header="t('ReleaseDate')" :sortable="true" field="releaseDate" style="width: 10.6rem"/>
        <Column :header="t('Price')" :sortable="true" field="price" style="width: 8rem"/>
        <Column :header="t('Region')" :sortable="true" field="region" style="width: 5rem"/>
        <Column :header="t('ReleaseType')" :sortable="true" field="releaseType" style="width: 12rem"/>
        <Column :header="t('Bonus')" :sortable="true" field="bonus" style="width: 5rem"
                v-if="![$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
        <Column :header="t('Scale')" :sortable="true" field="scale" style="width: 5rem"
                v-if="[$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
        <Column :header="t('Image')" style="width: 3.5rem"/>
        <Column :header="t('File')" style="width: 3.5rem"/>
      </Row>
    </ColumnGroup>

    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <RButton @click="loadEditor(data)" size="small" action="update"/>
      </template>
    </Column>

    <Column field="name" filterField="keyword" :showFilterMenu="false" showClearButton
            exportHeader="name" :sortable="true">
      <template #body="{data}">
        <a :href="`${$api.ITEM.DETAIL_PATH}/${data.id}`" :title="data.name"
           class="text-ellipsis" style="width: 30rem">
          {{ data!.name }}
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 90%" size="large" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column v-if="![$const.ITEM_TYPE.ALBUM, $const.ITEM_TYPE.DISC].includes(store.itemCurrent)" bodyClass="text-center"
            :bodyStyle="{padding: 0}">
      <template #body="{data}">
        <Tag :value="data.subType.label"
             :style="`color: var(--r-item-${data.type}-${data.subType.value})`"/>
      </template>
    </Column>
    <Column field="catalogId"
            v-if="![$const.ITEM_TYPE.BOOK, $const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
    <Column field="barcode"/>
    <Column field="releaseDate"/>
    <Column field="price">
      <template #body="{data}">
        {{ data!.price ? `${data!.price} ${data!.currency}` : '' }}
      </template>
    </Column>
    <Column bodyClass="text-center">
      <template #body="{data}">
        <span :class="`fi fi-${data.region}`"/>
      </template>
    </Column>
    <Column bodyClass="text-center">
      <template #body="{data}">
        <Tag :value="data.releaseType.label"/>
      </template>
    </Column>
    <Column dataType="boolean" bodyClass="text-center"
            v-if="![$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(store.itemCurrent)">
      <template #body="{data}">
        <i class="pi pi-check-circle" v-if="data.bonus"/>
      </template>
    </Column>
    <Column field="scale" v-if="[$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(store.itemCurrent)"/>
    <Column field="imageCount" class="text-center"/>
    <Column field="fileCount" class="text-center"/>
    <Column v-for="(col, index) of param.selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style lang="scss" scoped>
</style>