<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useRoute, useRouter} from "vue-router";
import {useDialog} from "primevue/usedialog";
import {META} from "@/config/Web_Const";
import {API} from '@/config/Web_Helper_Strs';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/entryService";
import "flag-icons/css/flag-icons.min.css";
import {EntityManageParam, useEntityStore} from '@/logic/entityService';
import {PublicHelper} from "@/toolkit/publicHelper";
import {PColumn} from "@/logic/frame";

const dt = ref();
const {t} = useI18n();
const dialog = useDialog();
const store = useEntityStore();
const route = useRoute();
const router = useRouter();
const param = ref(new EntityManageParam());
const entryType = ref();

onBeforeMount(async () => {
  entryType.value = META.ENTRY_TYPE_SET[store.entryCurrent === 0 ? 0 : store.entryCurrent - 1];
  param.value.initFilters({
    type: {value: store.entryCurrent},
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

const switchEntryType = (ev: any) => {
  if (ev.value === null)
    entryType.value = META.ENTRY_TYPE_SET[0];
  store.entryCurrent = parseInt(entryType.value.value);
  param.value.query.filters.type.value = store.entryCurrent;
  param.value.clearSort();
  param.value.initPage(0, dt.value.rows);
  load();
}

const initQueryParam = async () => {
  const { query } = route;
  const page = parseInt(query.page?.toString() ?? '1');

  if (query.sort) {
    param.value.query.sortField = query.sort.toString();
    if (query.order) {
      param.value.query.sortOrder = query.order.toString() === 'desc' ? -1 : 1;
    }
  }

  param.value.countPage(page, dt.value.rows);
  param.value.query.filters.keyword.value = query.keyword?.toString() ?? '';
}

const updateQueryParam = () => {
  const { query: { filters, sortField, sortOrder, first }} = param.value;
  const curQuery = {...route.query};

  curQuery.page = ((first / dt.value.rows) + 1).toString();

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
//endregion

const onPage = (ev: any) => {
  param.value.initPage(ev.first, ev.rows);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage(0, dt.value.rows);
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};
const onFilter = () => {
  param.value.initPage(0, dt.value.rows);
  load();
};

const onToggle = (val: PColumn[]) => {
  param.value.selectedColumns = param.value.columns.filter(col => val.includes(col));
};
const load = async () => {
  updateQueryParam();
  param.value.load();
  const res = await axios.post(API.ENTRY_GET_LIST, param.value.query);
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
//endregion

const exportCSV = () => {
  dt.value.exportCSV();
};

</script>

<template>
  <DataTable ref="dt" :value="param.data" class="entity-manager-datatable" :alwaysShowPaginator="param.data.length != 0"
             lazy v-model:filters="param.query.filters" :totalRecords="param.total" :loading="param.loading"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             paginator :rows="param.query.rows" :first="param.query.first" stripedRows size="small"
             v-model:selection="param.selectedData" dataKey="id" removableSort showGridlines
             scrollable scrollHeight="flex" :rowsPerPageOptions="[15,30,50]"
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;" responsiveLayout="scroll">
    <template #paginatorfirstpagelinkicon>
      <MaterialIcon name="first_page" />
    </template>
    <template #paginatorprevpagelinkicon>
      <MaterialIcon name="chevron_left" />
    </template>
    <template #paginatornextpagelinkicon>
      <MaterialIcon name="chevron_right" />
    </template>
    <template #paginatorlastpagelinkicon>
      <MaterialIcon name="last_page" />
    </template>
    <template #header>
      <BlockUI :blocked="param.blocking">
        <SelectButton size="small" v-model="entryType" :options="META.ENTRY_TYPE_SET"
                      @change="switchEntryType($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="{option}">
            <MaterialIcon :name="option.icon" :title="t(option.label)"/>
          </template>
        </SelectButton>
        <Button variant="text" severity="danger" :disabled="!param.selectedData.length"
                outlined @click="confirmDeleteSelected">
          <template #icon>
            <MaterialIcon name="delete_forever" />
          </template>
        </Button>
        <Button variant="text" severity="help" :disabled="param.data.length"
                outlined @click="exportCSV">
          <template #icon>
            <MaterialIcon name="file_export" />
          </template>
        </Button>
        <MultiSelect :model-value="param.selectedColumns" :options="param.columns" optionLabel="header"
                     @update:modelValue="onToggle" class="text-end" size="small"
                     :placeholder="t('SelectedDisplayColumns')"/>
      </BlockUI>
    </template>
    <template #empty>
        <span>{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <span>{{ t('CommonDataTableLoadingInfo') }}</span>
    </template>

    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <Button variant="text" outlined size="small" @click="loadEditor(data, dialog)">
          <template #icon>
            <MaterialIcon name="edit_square" />
          </template>
        </Button>
      </template>
    </Column>
    <Column class="text-center" style="width: 2.5rem">
      <template #body="prop">
        <img v-if="prop.data.thumb" :alt="prop.data.name" :src="`${API.STATIC_DOMAIN}${prop.data.thumb}`"
             style="max-width: 2.5rem;max-height: 2.5rem;width: auto;height: auto" />
        <img v-else :alt="prop.data.name" :src="API.COMMON_EMPTY_THUMB_IMAGE" style="width: 2.5rem" />
      </template>
    </Column>

    <Column :header="t('Name')" filterField="keyword" :showFilterMenu="false" :showClearButton="true"
            exportHeader="name" :sortable="true">
      <template #body="{data}">
        <a :href="`${API.ENTRY_DETAIL_PATH}/${data.id}`" :title="data.name">
          {{ data!.name }}
        </a>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" size="large" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('NameEn')" field="nameEn" :sortable="true" style="width: 25rem">
      <template #body="{data}">
        <div :title="data.nameEn" style="width: 25rem" class="text-ellipsis">
          {{ data!.nameEn }}
        </div>
      </template>
    </Column>
    <Column :header="t('NameZh')" field="nameZh" :sortable="true" style="width: 25rem">
      <template #body="{data}">
        <div :title="data.nameZh" style="width: 25rem" class="text-ellipsis">
          {{ data!.nameZh }}
        </div>
      </template>
    </Column>
    <Column :header="t('Date')" :sortable="true" field="date"
            v-if="![META.ENTRY_TYPE.CLASSIFICATION, META.ENTRY_TYPE.MATERIAL].includes(store.entryCurrent)"
            :style="`width: ${
              [META.ENTRY_TYPE.PRODUCT, META.ENTRY_TYPE.PERSON].includes(store.entryCurrent) ? '7.5' :
              store.entryCurrent === META.ENTRY_TYPE.CHARACTER ? '15' : '16'
            }rem`"/>
    <Column :header="t('Type')" :sortable="true" field="subType"
            v-if="store.entryCurrent === META.ENTRY_TYPE.PRODUCT" style="width: 6rem" class="text-center">
      <template #body="{data}">
        <Tag v-if="data.subType.value" :value="data.subType.label"/>
      </template>
    </Column>
    <Column :header="t('Gender')" :sortable="true" field="gender" class="text-center"
            v-if="[META.ENTRY_TYPE.PERSON, META.ENTRY_TYPE.CHARACTER].includes(store.entryCurrent)" style="width: 5rem">
      <template #body="{data}">
        <i style="font-size: 1.4rem" :class="PublicHelper.getGenderIcon(data.gender.value)" />
      </template>
    </Column>
    <Column :header="t('Item')" field="items" :sortable="true" style="width: 5rem" class="text-center" />

    <Column v-for="(col, index) of param.selectedColumns" :field="col.field"
            :header="col.header" :key="col.field + '_' + index" :sortable="true"/>
  </DataTable>
</template>

<style lang="scss" scoped>
</style>