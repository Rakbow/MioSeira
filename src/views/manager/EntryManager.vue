<script setup lang="ts">
import {getCurrentInstance, onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/service/entryService";
import "flag-icons/css/flag-icons.min.css";
import {EntityManageParam} from '@/service/entityService';
import {useOptionStore} from "@/store/modules/option";
import {PublicHelper} from "@/toolkit/publicHelper";
import {PColumn} from "@/service/frame";

const dt = ref();
const {t} = useI18n();
const store = useOptionStore();
const route = useRoute();
const router = useRouter();
const param = ref(new EntityManageParam());
const entryType = ref();
const { proxy } = getCurrentInstance()!;

onBeforeMount(async () => {
  entryType.value = proxy!.$const.ENTRY_TYPE_SET[store.entryCurrent === 0 ? 0 : store.entryCurrent - 1];
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
    entryType.value = proxy!.$const.ENTRY_TYPE_SET[0];
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
  const res = await Axios.post(API.ENTRY_GET_LIST, param.value.query);
  if (res.success()) {
    param.value.data = res.data.data;
    param.value.total = res.data.total;
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
  <DataTable ref="dt" :value="param.data" class="entity-manager-datatable"
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
        <SelectButton size="small" v-model="entryType" :options="$const.ENTRY_TYPE_SET"
                      @change="switchEntryType($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="{option}">
            <MaterialIcon :name="option.icon" :title="t(option.label)"/>
          </template>
        </SelectButton>
        <Button variant="text" severity="danger" :disabled="!param.selectedData.length"
                outlined @click="confirmDeleteSelected">
          <template #icon>
            <MaterialIcon name="disabled_by_default" />
          </template>
        </Button>
        <Button variant="text" severity="help" :disabled="param.data.length === 0"
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
      <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
      <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <MaterialIcon class="pi-spin" name="autorenew" size="10rem"/>
    </template>

    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <Button variant="text" outlined size="small" @click="loadEditor(data)">
          <template #icon>
            <MaterialIcon name="edit_square" />
          </template>
        </Button>
      </template>
    </Column>
    <Column class="text-center" style="width: 2.5rem">
      <template #body="{data}">
        <img v-if="data.thumb" :alt="data.name" :src="`${$api.STATIC_DOMAIN}${data.thumb}`"
             style="max-width: 2.5rem;max-height: 2.5rem;width: auto;height: auto" />
        <img v-else :alt="data.name" :src="API.COMMON_EMPTY_THUMB_IMAGE" style="width: 2.5rem" />
      </template>
    </Column>

    <Column :header="t('Name')" filterField="keyword" :showFilterMenu="false" :showClearButton="true"
            exportHeader="name" :sortable="true">
      <template #body="{data}">
        <a :href="`${$api.ENTRY_DETAIL_PATH}/${data.id}`" :title="data.name">
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
            v-if="![$const.ENTRY_TYPE.CLASSIFICATION, $const.ENTRY_TYPE.MATERIAL].includes(store.entryCurrent)"
            :style="`width: ${
              [$const.ENTRY_TYPE.PRODUCT, $const.ENTRY_TYPE.PERSON].includes(store.entryCurrent) ? '7.5' :
              store.entryCurrent === $const.ENTRY_TYPE.CHARACTER ? '15' : '16'
            }rem`"/>
    <Column :header="t('Type')" :sortable="true" field="subType"
            v-if="store.entryCurrent === $const.ENTRY_TYPE.PRODUCT" style="width: 6rem" class="text-center">
      <template #body="{data}">
        <Tag v-if="data.subType.value" :value="data.subType.label"/>
      </template>
    </Column>
    <Column :header="t('Gender')" :sortable="true" field="gender" class="text-center"
            v-if="[$const.ENTRY_TYPE.PERSON, $const.ENTRY_TYPE.CHARACTER].includes(store.entryCurrent)" style="width: 5rem">
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