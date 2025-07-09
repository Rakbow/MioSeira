<script setup lang="ts">
import {defineAsyncComponent, inject, onMounted, ref} from "vue";
import {API, Axios} from "@/api";
import {useRoute} from "vue-router";
import {loadEditor} from "@/service/entityService";
import {useI18n} from "vue-i18n";
import {bs} from '@/service/baseService';

const fileUploader = defineAsyncComponent(() => import('@/components/file/FileCreator.vue'));

const {t} = useI18n();
const records = ref(0);
const entity = inject<Entity>('entity')!;
const loading = ref(false);
const route = useRoute();
const first = ref();
const files = ref([]);
const queryParams = ref();
const dt = ref();

onMounted((() => {
  initQueryParam();
  getRelatedFiles();
}))

const initPageSize = () => {
  queryParams.value.first = 0;
  queryParams.value.rows = dt.value.rows;
}

const onPage = (ev: any) => {
  queryParams.value = ev;
  getRelatedFiles();
};
const onSort = (ev: any) => {
  initPageSize();
  queryParams.value = ev;
  getRelatedFiles();
};

const initQueryParam = async () => {
  queryParams.value = {
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    filters: {
      'entityType': {value: 0},
      'entityId': {value: 0}
    }
  };
}

const getRelatedFiles = async () => {
  queryParams.value.filters.entityType.value = entity!.type;
  queryParams.value.filters.entityId.value = entity!.id;
  loading.value = true;
  const res = await Axios.post(API.FILE_LIST, queryParams.value);
  if (res.success()) {
    files.value = res.data.data;
    records.value = res.data.total
  }
  loading.value = false;
  first.value = queryParams.value.first;
}

const openFilesUpload = () => {
  bs!.dialog.open(fileUploader, {
    props: {
      header: t('Upload'),
      style: {
        width: '40vw',
        minWidth: '40vw'
      },
      breakpoints: {
        '960px': '40vw',
        '640px': '40vw'
      },
      modal: true,
      closable: true
    },
    onClose: (options: any) => {
      if (options.data) {
        if (options.data.isUpdate) {
          getRelatedFiles();
        }
      }
    }
  });
}

//endregion
</script>

<template>
  <BlockUI :blocked="loading" class="entity-fieldset related-file-table">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-file"/>
        <b>{{ t('RelatedFiles') }}</b>
        <RButton @click="openFilesUpload" icon="note_add" tooltip="Upload" class="absolute" style="right: 0" />
      </template>
      <DataTable v-if="files.length" ref="dt" :value="files"
                 lazy :totalRecords="records" :loading="loading" @page="onPage($event)" @sort="onSort($event)"
                 :alwaysShowPaginator="files.length > 10" paginator :rows="10" :first="first"
                 stripedRows size="small" dataKey="id" removableSort
                 scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
                 currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;" responsiveLayout="scroll">
        <template #loading>
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <span>{{ t('CommonDataTableLoadingInfo') }}</span>
        </template>

        <Column style="width: 3rem">
          <template #body="{data}">
            <Button variant="text" outlined size="small" @click="loadEditor($const.ENTITY.FILE, data)">
              <template #icon>
                <RIcon size="1.5" name="edit_square" />
              </template>
            </Button>
          </template>
        </Column>
        <Column :header="t('Name')" field="name" :showFilterMenu="false" :sortable="true"/>
        <Column :header="t('Size')" field="size" :showFilterMenu="false" :sortable="true" style="width: 150px" />
      </DataTable>
      <div v-else>
        <span class="empty-search-result"><em>{{ t('NoFile') }}</em></span>
      </div>

    </Fieldset>
  </BlockUI>
</template>

<style scoped lang="scss">
:deep(.p-datatable) {
  .p-datatable-tbody > tr > td {
    padding: 1px;
  }
  .p-datatable-table-container {
    border-radius: 10px;
  }
}
</style>