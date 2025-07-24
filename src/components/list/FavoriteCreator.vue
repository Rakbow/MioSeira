<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {EntitySearchParam} from "@/service/entityService";
import {API, Axios} from "@/api";

const {t} = useI18n();
const param = ref(new EntitySearchParam());
const dialogRef = inject<any>('dialogRef');

onBeforeMount(async () => {
  param.value.initFilters({
    type: {value: dialogRef.value.data.type}
  });
})

onMounted(() => {
  param.value.query.size = 10;
  loadLists();
})

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1);
  loadLists();
};

const loadLists = async () => {
  param.value.load();
  const res = await Axios.post(API.LIST.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
}

//region create
const listTypeSet = ref([
  {label: 'Item', value: 0},
  {label: 'Entry', value: 1},
  {label: 'Episode', value: 4}
]);
const createView = ref(false);
const createDTO = ref({
  name: '',
  type: 0
});
const openCreator = () => {
  createDTO.value = {
    name: '',
    type: 0
  };
  createView.value = true;
};
const create = async () => {
  param.value.load();
  const res = await Axios.post(API.LIST.CREATE, createDTO.value);
  if (res.success()) {
    createView.value = false;
    await loadLists();
  }
  param.value.endLoad();
};
//endregion

//region add items
const addItemsDTO = ref({
  listId: 0,
  type: dialogRef.value.data.type,
  itemIds: dialogRef.value.data.ids
});
const addItems = async () => {
  param.value.load();
  addItemsDTO.value.listId = (param.value.selectedData as any).id;
  const res = await Axios.post(API.LIST.ADD_ITEMS, addItemsDTO.value);
  if (res.success()) dialogRef.value.close();
  param.value.endLoad();
};

//endregion
</script>

<template>
  <DataTable ref="dt" :value="param.result.data" class="entity-manager-datatable"
             lazy :loading="param.loading" size="small" paginator columnResizeMode="fit"
             filterDisplay="row" alwaysShowPaginator
             v-model:selection="param.selectedData"
             v-model:filters="param.query.filters" :rows="param.query.size"
             scrollable scrollHeight="flex" responsiveLayout="scroll">
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
        <RButton @click="openCreator" action="create"/>
      </BlockUI>
    </template>
    <Column class="entity-manager-datatable-select-column" selectionMode="single"/>
    <Column :header="t('Name')" field="name"/>
    <Column :header="t('Remark')" field="remark"/>
  </DataTable>
  <Dialog :modal="true" v-model:visible="createView" style="width: 30rem" :header="t('Add')"
          class="entity-editor">
    <BlockUI :blocked="param.blocking">
      <div class="grid">
        <FloatLabel variant="on">
          <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
          <InputText size="large" v-model="createDTO.name" class="static w-full"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('Type') }}</label>
          <Select size="large" v-model="createDTO.type" :options="listTypeSet"
                  optionLabel="label" optionValue="value"/>
        </FloatLabel>
      </div>
    </BlockUI>
    <template #footer>
      <div class="relative">
        <div class="bottom-0 right-0">
          <Button icon="pi pi-times" :label="t('Cancel')" @click="createView = false" :disabled="param.blocking"
                  class="p-button-text"/>
          <Button icon="pi pi-save" :label="t('Save')" @click="create" :disabled="param.blocking"/>
        </div>
      </div>
    </template>
  </Dialog>

  <div class="relative">
    <div class="bottom-0 right-0">
      <Button icon="pi pi-times" :label="t('Cancel')" @click="dialogRef.close()" :disabled="param.blocking"
              class="p-button-text"/>
      <Button icon="pi pi-save" :label="t('Save')" @click="addItems" :disabled="param.blocking || (param.selectedData as any).id === undefined"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>