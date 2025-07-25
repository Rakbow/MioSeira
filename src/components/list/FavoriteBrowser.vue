<template>
  <div class="entity-detail-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-list"/>
        <b>{{ t('List') }}</b>
      </template>

      <DataTable ref="dt" :value="param.result.data" class="entity-manager-datatable"
                 lazy :loading="param.loading" size="small" paginator columnResizeMode="fit"
                 @sort="onSort($event)" alwaysShowPaginator
                 v-model:filters="param.query.filters" :rows="param.query.size"
                 v-model:selection="param.selectedData" removableSort
                 rowGroupMode="rowspan" groupRowsBy="parent.name">
        <template #paginatorcontainer>
          <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                      :total="param.result.total" @page="onPage($event)" :time="param.result.time"/>
        </template>
        <template #empty>
          <span>{{ t('NoSearchResult') }}</span>
        </template>
        <template #loading>
          <RIcon class="pi-spin" name="autorenew" size="10rem"/>
        </template>
        <template #header>
          <BlockUI :blocked="param.blocking">
            <RButton @click="openDelete" icon="scan_delete" severity="danger"
                     tip="Delete" :disabled="!param.selectedData.length"/>
          </BlockUI>
        </template>
        <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
        <Column :header="t('Name')">
          <template #body="{data}">
            <a :href="`/db/${path}/${data.target.entityId}`">
          <span :title="data.target.name">
            {{ data.target.name }}
          </span>
            </a>
          </template>
        </Column>
        <Column :header="t('Duration')" field="target.subInfo"/>
        <Column field="parent.name" :header="t('Entity.Album')" style="width: 30rem" :bodyStyle="{position: 'relative'}">
          <template #body="{data}">
            <a :title="data.parent.name"
               :href="`/db/${$api.ITEM.DETAIL_PATH}/${data.parent.id}`"
               style="width: 28rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;
           position: absolute;margin-top: 1rem;top: 0">
              {{ data!.parent.name }}
            </a>
          </template>
        </Column>
        <Column :header="t('Remark')" field="remark"/>
      </DataTable>

    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, inject, onBeforeMount, onMounted, ref} from "vue";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";
import {bs} from "@/service/baseService";

const {t} = useI18n();
const dt = ref();
const param = ref(new EntitySearchParam());
const list = inject<any>('list');
const path = ref();
const {proxy} = getCurrentInstance()!;

onBeforeMount(async () => {
  param.value.initFilters({
    listId: {value: list.listId},
    type: {value: list.type}
  });
  setPath();
})

const setPath = () => {
  if(list.type === proxy!.$const.ENTITY.ITEM) {
    path.value = 'item';
  }else if (list.type === proxy!.$const.ENTITY.ENTRY) {
    path.value = 'entry';
  }else if (list.type === proxy!.$const.ENTITY.EPISODE) {
    path.value = 'ep';
  }
}

onMounted(() => {
  param.value.query.size = 10;
  load();
})

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage();
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};

const load = async () => {
  param.value.load();
  const res = await Axios.post(API.LIST.GET_ITEMS, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
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
  const res = await Axios.delete(API.LIST.DELETE, param.value.selectedData.map(d => d.id));
  if (res.success()) {
    param.value.selectedData = [];
    await load();
  }
  param.value.endBlock();
}
</script>

<style scoped>

</style>