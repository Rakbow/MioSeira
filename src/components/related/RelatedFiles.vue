<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {EntityInfo, META} from "@/config/Web_Const";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {loadEditor} from "@/logic/entityService";
import {useDialog} from "primevue/usedialog";
import {useI18n} from "vue-i18n";
const Edit = defineAsyncComponent(() => import('@/components/common/EntityEditButton.vue'));
const fileUploader = defineAsyncComponent(() => import('@/components/file/FileCreator.vue'));

const {t} = useI18n();
const records = ref(0);
const entityInfo = ref<EntityInfo>();
const loading = ref(false);
const route = useRoute();
const first = ref();
const files = ref([]);
const queryParams = ref();
const dt = ref();
const dialog = useDialog();

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted((() => {
  initQueryParam();
  getRelatedFiles();
}))

const initPageSize = () => {
  queryParams.value.first = 0;
  queryParams.value.rows = dt.value.rows;
}

const onPage = (ev) => {
  queryParams.value = ev;
  getRelatedFiles();
};
const onSort = (ev) => {
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
  queryParams.value.filters.entityType.value = entityInfo.value?.type;
  queryParams.value.filters.entityId.value = entityInfo.value?.id;
  loading.value = true;
  const res = await axios.post(API.GET_FILE_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    files.value = res.data.data;
    records.value = res.data.total
  }
  loading.value = false;
  first.value = queryParams.value.first;
}

const openFilesUpload = () => {
  dialog.open(fileUploader, {
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
    onClose: (options) => {
      if (options.data !== undefined) {
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
  <BlockUI :blocked="loading" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-file"/>
        <b>{{ $t('RelatedFiles') }}</b>
        <Edit :func="openFilesUpload" icon="note_add" label="Upload" />
      </template>
      <DataTable v-if="files.length" ref="dt" :value="files" class="small-font mt-3"
                 lazy :totalRecords="records" :loading="loading" @page="onPage($event)" @sort="onSort($event)"
                 :alwaysShowPaginator="files.length > 10" paginator :rows="10" :first="first"
                 stripedRows size="small" dataKey="id" removableSort
                 scrollable scrollHeight="flex" :rowsPerPageOptions="[10,25,50]"
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
                 currentPageReportTemplate="{first} to {last} of {totalRecords}" responsiveLayout="scroll">
        <template #loading>
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <span>{{ $t('CommonDataTableLoadingInfo') }}</span>
        </template>

        <Column style="width: 45px">
          <template #body="slotProps">
            <Button class="p-button-link" size="small" icon="pi pi-pencil"
                    @click="loadEditor(META.ENTITY.FILE, slotProps.data, dialog)"/>
          </template>
        </Column>
        <Column :header="$t('Name')" field="name" :showFilterMenu="false" :sortable="true"/>
        <Column :header="$t('Size')" field="size" :showFilterMenu="false" :sortable="true" style="width: 150px" />
      </DataTable>
      <div v-else>
        <span class="empty-search-result"><em>{{ $t('NoFile') }}</em></span>
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