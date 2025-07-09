<template>
  <DataTable ref="dt" :value="param.data" class="entity-manager-datatable"
             lazy :totalRecords="param.total" :loading="param.loading" size="small" paginator columnResizeMode="fit"
             @page="onPage($event)" @sort="onSort($event)" @filter="onFilter" filterDisplay="row"
             v-model:filters="param.query.filters" :rows="param.query.rows" :first="param.query.first"
             v-model:selection="param.selectedData" dataKey="id" removableSort
             scrollable scrollHeight="flex" :rowsPerPageOptions="[15,30,50]" showGridlines
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
             currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;"
             responsiveLayout="scroll">
    <template #paginatorfirstpagelinkicon>
      <RIcon name="first_page"/>
    </template>
    <template #paginatorprevpagelinkicon>
      <RIcon name="chevron_left"/>
    </template>
    <template #paginatornextpagelinkicon>
      <RIcon name="chevron_right"/>
    </template>
    <template #paginatorlastpagelinkicon>
      <RIcon name="last_page"/>
    </template>
    <template #empty>
      <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
      <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
    </template>
    <template #loading>
      <RIcon class="pi-spin" name="autorenew" size="10rem"/>
    </template>
    <template #header>
      <BlockUI :blocked="param.blocking">
        <RButton @click="openCreator" icon="note_add" tip="Upload"/>
        <RButton @click="openDelete" icon="scan_delete" severity="danger"
                 tip="Delete" :disabled="!param.selectedData.length"/>
      </BlockUI>
    </template>
    <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
    <Column class="entity-manager-datatable-edit-column">
      <template #body="{data}">
        <RButton @click="loadEditor($const.ENTITY.FILE, data)" action="update" size="small"/>
      </template>
    </Column>

    <Column style="width: 3rem">
      <template #body="{data}">
        <div v-html="getIcon(data.name).svg"/>
      </template>
    </Column>

    <Column :header="t('Name')" field="name" filterField="keyword" :showFilterMenu="false" :showClearButton="true"
            exportHeader="name" :sortable="true" style="width: 30rem">
      <template #body="{data}">
        <span :title="data.name" class="text-ellipsis" style="width: 30rem">
          {{ data!.name }}
        </span>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <InputText style="width: 70%" type="text" v-model="filterModel.value"
                   @keydown.enter="filterCallback()"/>
      </template>
    </Column>
    <Column :header="t('Size')" field="size" :sortable="true" style="width: 9rem" />
    <Column :header="t('Remark')" field="remark" style="width: 14rem" />
  </DataTable>
</template>

<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, onMounted, ref} from "vue";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {EntityManageParam, loadEditor} from "@/service/entityService";
import {getIcon} from "material-file-icons";
import {bs} from "@/service/baseService";

const creator = defineAsyncComponent(() => import('@/components/file/FileCreator.vue'));

const {t} = useI18n();
const dt = ref();
const param = ref(new EntityManageParam());
const dialogRef = inject<any>('dialogRef');

onBeforeMount(async () => {
  param.value.initFilters({
    keyword: {value: ''},
    entityType: {value: dialogRef.value.data.type},
    entityId: {value: dialogRef.value.data.id}
  });
})

onMounted(() => {
  load();
})

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

const load = async () => {
  param.value.load();
  const res = await Axios.post(API.FILE.LIST, param.value.query);
  if (res.success()) {
    param.value.data = res.data.data;
    param.value.total = res.data.total
  }
  param.value.endLoad();
}

const openCreator = () => {
  bs!.dialog.open(creator, {
    props: {
      header: t('Upload'),
      style: {
        width: '80rem'
      },
      modal: true,
      closable: true
    },
    data: {
      type: dialogRef.value.data.type,
      id: dialogRef.value.data.id,
    },
    onClose: (options: any) => {
      if (options.data) {
        if (options.data.isUpdate) {
          load();
        }
      }
    }
  });
}

const openDelete = () => {
  bs!.confirm.require({
    group: 'templating',
    header: t('Delete'),
    message: t('ConfirmDeleteSelected'),
    icon: 'pi pi-trash',
    rejectProps: {
      label: t('Cancel'),
      icon: 'pi pi-times',
      severity: 'secondary',
      outlined: true,
      size: 'large'
    },
    acceptProps: {
      label: t('Delete'),
      severity: 'danger',
      icon: 'pi pi-check',
      size: 'large'
    },
    accept: () => {
      remove();
    }
  });
};

const remove = async () => {
  param.value.block();
  const res = await Axios.delete(API.FILE.RELATED_DELETE, param.value.selectedData.map(d => d.relatedId));
  if (res.success()) {
    param.value.selectedData = [];
    await load();
    bs!.toast.success(res.message);
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endBlock();
}
</script>

<style scoped>

</style>