<script setup lang="ts">
import {getCurrentInstance, inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {useOptionStore} from "@/store/modules/option";
import {EntitySearchParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const { proxy } = getCurrentInstance()!;
const store = useOptionStore();
const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const param = ref(new EntitySearchParam());
const dt = ref();
const isUpdate = ref(false);

onBeforeMount(() => {
  store.fetchOptions();
  param.value.initFilters({
    entityType: {value: dialogRef.value.data.entityType},
    entityId: {value: dialogRef.value.data.entityId}
  });
})

onMounted(() => {
  param.value.query.size = 10;
  load();
});

//region create
const createDialog = ref(false);
const createdDTO = ref({
  entityType: dialogRef.value.data.entityType,
  entityId: dialogRef.value.data.entityId,
  type: proxy!.$const.RESOURCE_TYPE.CLOUD,
  path: '',
  remark: ''
});
const openCreate = () => {
  createdDTO.value.path = '';
  createdDTO.value.remark = '';
  createDialog.value = true;
}
const create = async () => {
  param.value.block();
  const res = await Axios.post(API.RESOURCE.CREATE, createdDTO.value);
  if (res.success()) {
    isUpdate.value = true;
    createDialog.value = false;
    await load();
  }
  param.value.endBlock();
}
//endregion

//region update
const updateDTO = ref<any>({});
const updateDialog = ref(false);
const openUpdate = (value: any) => {
  updateDialog.value = true;
  updateDTO.value = JSON.parse(JSON.stringify(value));
}
const update = async () => {
  param.value.block();
  const res = await Axios.post(API.RESOURCE.UPDATE, {
    id: updateDTO.value.id,
    path: updateDTO.value.path,
    remark: updateDTO.value.remark
  });
  if (res.success()) {
    isUpdate.value = true;
    updateDialog.value = false;
    await load();
  }
  param.value.endBlock();
}
//endregion

//region delete
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
  const res = await Axios.delete(API.RESOURCE.DELETE, {
    ids: param.value.selectedData.map(i => i.id)
  });
  param.value.selectedData = [];
  if (res.success()) {
    isUpdate.value = true;
    await load();
  }
  param.value.endBlock();
}
//endregion

//region query
const load = async () => {
  param.value.load();
  const res = await Axios.post(API.RESOURCE.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
}
//endregion
</script>

<template>
  <BlockUI :blocked="param.blocking">
    <DataTable ref="dt" :value="param.result.data" :loading="param.loading" class="entity-manager-datatable"
               v-model:selection="param.selectedData" stripedRows size="small"
               scrollable scrollHeight="40rem" responsiveLayout="scroll">
      <template #empty>
        <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
      </template>
      <template #loading>
        <RIcon class="pi-spin" name="autorenew" size="10rem"/>
      </template>
      <template #header>
        <RButton @click="openCreate" action="create" :disabled="param.blocking"/>
        <RButton @click="openDelete" action="delete" :disabled="!param.selectedData || !param.selectedData.length || param.blocking"/>
      </template>

      <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
      <Column class="entity-manager-datatable-edit-column">
        <template #body="{data}">
          <RButton size="small" @click="openUpdate(data)" action="update" v-if="data.type === 'CLOUD'" />
        </template>
      </Column>
      <Column :header="t('Type')" field="type" style="width: 5rem">
        <template #body="{data}">
          <span v-if="data.type === 'LOCAL'">本地</span>
          <span v-else>网络</span>
        </template>
      </Column>
      <Column :header="t('Link')" field="path" style="width: 37rem">
        <template #body="{data}">
          <a v-if="data.type === 'CLOUD'" :href="`https://${data.path}`" target="_blank">{{data.path}}</a>
          <span v-else>{{data.path}}</span>
        </template>
      </Column>
      <Column :header="t('Remark')" field="remark"/>
    </DataTable>
  </BlockUI>

  <Dialog :modal="true" v-model:visible="createDialog" :style="{width: '55rem'}" :header="t('Add')">
    <BlockUI :blocked="param.blocking" class="entity-editor">
      <FloatLabel class="field" variant="on">
        <label>{{ t('Link') }}</label>
        <InputText size="large" v-model="createdDTO.path"/>
      </FloatLabel>
      <FloatLabel class="field" variant="on">
        <label>{{ t('Remark') }}</label>
        <InputText size="large" v-model="createdDTO.remark"/>
      </FloatLabel>
    </BlockUI>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text" @click="createDialog = false"
              :disabled="param.blocking"/>
      <Button :label="t('Save')" icon="pi pi-check" @click="create"
              :disabled="param.blocking"/>
    </template>
  </Dialog>

  <Dialog :modal="true" v-model:visible="updateDialog" :header="t('Edit')">
    <BlockUI :blocked="param.blocking" class="entity-editor">
      <FloatLabel class="field" variant="on">
        <label>{{ t('Link') }}</label>
        <InputText size="large" v-model="updateDTO.path"/>
      </FloatLabel>
      <FloatLabel variant="on">
        <label>{{ t('Remark') }}</label>
        <InputText size="large" v-model="updateDTO.remark"/>
      </FloatLabel>
    </BlockUI>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="updateDialog = false" :disabled="param.blocking"/>
      <Button :label="t('Save')" icon="pi pi-check" class="p-button-text"
              @click="update" :disabled="param.blocking"/>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
</style>