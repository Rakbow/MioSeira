<script setup lang="ts">
import {defineAsyncComponent, getCurrentInstance, inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {useOptionStore} from "@/store/modules/option";
import {EntitySearchParam} from "@/service/entityService";
import {bs} from '@/service/baseService';
import router from "@/router";

const EntrySelector = defineAsyncComponent(() => import('@/components/entry/EntrySelector.vue'));

const { proxy } = getCurrentInstance()!;
const store = useOptionStore();
const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const param = ref(new EntitySearchParam());
const dt = ref();
const entryType = ref(proxy!.$const.ENTRY_TYPE.PRODUCT);
const curEntryType = ref<any>(null);
const isUpdate = ref(false);

onBeforeMount(() => {
  store.fetchOptions();
  param.value.initFilters({
    entityType: {value: dialogRef.value.data.entityType},
    entityId: {value: dialogRef.value.data.entityId},
    targetEntityType: {value: dialogRef.value.data.type},
    targetEntitySubTypes: {value: []}
  });
  if (dialogRef.value.data.subTypes.length) {
    entryType.value = dialogRef.value.data.subTypes[0];
    param.value.query.filters.targetEntitySubTypes.value = [entryType.value];
    curEntryType.value = proxy!.$const.ENTRY_TYPE_SET[entryType.value - 1];
  }
})

onMounted(() => {
  param.value.query.size = 10;
  load();
});

const jumpToEntryDetail = (data: any) => {
  dialogRef.value.close();
  router.push(`${proxy!.$api.ENTRY.DETAIL_PATH}/${data.id}`);
};

const switchEntryType = (ev: any) => {
  if (ev.value === null) {
    entryType.value = proxy!.$const.ENTRY_TYPE.PRODUCT;
    param.value.query.filters.targetEntitySubTypes.value = [];
  } else {
    entryType.value = parseInt(curEntryType.value.value);
    param.value.query.filters.targetEntitySubTypes.value = [entryType.value];
  }
  load();
}


const displayEntrySelector = ref(false);
const openEntrySelector = () => {
  displayEntrySelector.value = true;
}
const removeRelatedEntry = (index: number) => {
  createdDTO.value.entities.splice(index, 1);
}
const clearRelatedEntry = () => {
  createdDTO.value.entities = [];
}

//region create
const createDialog = ref(false);
const createdDTO = ref({
  entityType: dialogRef.value.data.entityType,
  entitySubType: dialogRef.value.data.entitySubType,
  entityId: dialogRef.value.data.entityId,
  relatedEntityType: proxy!.$const.ENTITY.ENTRY,
  relatedEntitySubType: entryType.value,
  roleId: 0,
  relatedRoleId: 0,
  entities: <any>[],
  relatedEntries: <any>[]
});
const openCreate = () => {
  createdDTO.value.roleId = 0;
  createdDTO.value.relatedRoleId = 0;
  createdDTO.value.entities = <any>[];
  createdDTO.value.relatedEntries = [];
  createdDTO.value.relatedEntitySubType = entryType.value;
  createDialog.value = true;
}
const create = async () => {
  param.value.block();
  createdDTO.value.relatedEntries = (createdDTO.value.entities as any[]).map(i => ({id: i.id, remark: i.remark}));
  const res = await Axios.post(API.RELATION.CREATE, createdDTO.value);
  if (res.success()) {
    isUpdate.value = true;
    createDialog.value = false;
    await load();
    bs!.toast.success(res.message);
  } else {
    bs!.toast.error(res.message);
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
  const res = await Axios.post(API.RELATION.UPDATE, {
    id: updateDTO.value.id,
    roleId: updateDTO.value.role.value,
    relatedRoleId: updateDTO.value.target.role.value,
    remark: updateDTO.value.remark,
    direction: updateDTO.value.direction
  });
  if (res.success()) {
    isUpdate.value = true;
    updateDialog.value = false;
    await load();
    bs!.toast.success(res.message);
  } else {
    bs!.toast.error(res.message);
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
  const res = await Axios.delete(API.RELATION.DELETE, {ids: param.value.selectedData.map(i => i.id)});
  if (res.success()) {
    isUpdate.value = true;
    bs!.toast.success(res.message);
    await load();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.endBlock();
}
//endregion

//region query
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
  const res = await Axios.post(API.RELATION.LIST, param.value.query);
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
               lazy paginator alwaysShowPaginator :rows="param.query.size" @sort="onSort($event)"
               v-model:selection="param.selectedData" stripedRows size="small"
               scrollable scrollHeight="40rem" responsiveLayout="scroll">
      <template #footer>
        <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                    :total="param.result.total" @page="onPage($event)" :time="param.result.time"/>
      </template>
      <template #empty>
        <span class="entity-manager-datatable-empty-icon"><img alt="no-result" src="@/assets/no-results.svg"/></span>
        <span class="entity-manager-datatable-empty-text">{{ t('CommonDataTableEmptyInfo') }}</span>
      </template>
      <template #loading>
        <RIcon class="pi-spin" name="autorenew" size="10rem"/>
      </template>
      <template #header>
        <SelectButton size="small" v-model="curEntryType" :options="$const.ENTRY_TYPE_SET"
                      @change="switchEntryType($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="{option}">
            <RIcon :name="option!.icon" size="2" v-tooltip.bottom="{value: t(option.label), class: 'short-tooltip'}"/>
          </template>
        </SelectButton>

        <RButton @click="openCreate" action="create" :disabled="param.blocking"/>
        <RButton @click="openDelete" action="delete" :disabled="!param.selectedData || !param.selectedData.length || param.blocking"/>
      </template>

      <Column class="entity-manager-datatable-select-column" selectionMode="multiple"/>
      <Column class="entity-manager-datatable-edit-column">
        <template #body="{data}">
          <RButton size="small" @click="openUpdate(data)" action="update" />
        </template>
      </Column>
      <Column :header="t('Group')" field="target.subType.label" style="width: 5rem"/>
      <Column :header="t('Role')" field="target.role.label" style="width: 10rem"/>
      <Column :header="t('ReverseRole')" field="role.label" style="width: 10rem"/>
      <Column :header="t('RelatedEntity')">
        <template #body="{data}">
          <router-link :title="data.target.name" :to="`${$api.ENTRY.DETAIL_PATH}/${data.target.entityId}`">
            {{ data!.target.name }}
          </router-link>
        </template>
      </Column>
      <Column :header="t('Remark')" field="remark" style="width: 10rem"/>
    </DataTable>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="createDialog" :style="{width: '55rem'}" :header="t('Add')">
    <BlockUI :blocked="param.blocking" class="entity-editor">
      <div class="grid mt-3">
        <FloatLabel variant="on">
          <label>{{ t('Role') }}</label>
          <Select v-model="createdDTO.roleId" :options="store.options.roleSet" :filter="true"
                  size="large" optionLabel="label" optionValue="value"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('ReverseRole') }}</label>
          <Select v-model="createdDTO.relatedRoleId" :options="store.options.roleSet" :filter="true"
                  size="large" optionLabel="label" optionValue="value"/>
        </FloatLabel>
      </div>
      <DataView :value="createdDTO.entities" layout="grid">
        <template #empty>
          <span class="empty-search-result"/>
        </template>
        <template #header>
          <RButton @click="openEntrySelector" action="create"/>
          <RButton @click="clearRelatedEntry" action="delete" v-if="!createdDTO.entities.length"/>
        </template>
        <template #grid="{items}">
          <div class="related-create-entity" v-for="(entry, index) in items" :key="index">
            <div class="related-create-entity-thumb">
              <img role="presentation" :alt="entry.name" :src="entry.thumb"/>
            </div>
            <div class="related-create-entity-info">
              <span :title="entry.name">{{ entry.name }}</span><br>
              <small :title="entry.subName">{{ (entry as any).subName }}</small>
            </div>
            <Divider type="dashed"/>
            <div class="related-create-entity-action">
              <InputText size="small" v-model="entry.remark"/>
            </div>
            <div class="fixed-col">
              <Button size="small" icon="pi pi-trash" severity="danger" variant="text"
                      @click="removeRelatedEntry(index)"/>
            </div>
          </div>
        </template>
      </DataView>
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
      <div class="related-create-entity">
        <div class="related-create-entity-thumb">
          <img role="presentation" :alt="updateDTO.target.name" :src="updateDTO.target.thumb"/>
        </div>
        <div class="related-create-entity-info">
          <span :title="updateDTO.target.name">{{ updateDTO.target.name }}</span><br>
          <small :title="updateDTO.target.subName">{{ updateDTO.target.subName }}</small>
        </div>
      </div>
      <div class="grid mt-3">
        <FloatLabel variant="on">
          <label>{{ t('Role') }}</label>
          <Select v-model="updateDTO.role.value" :options="store.options.roleSet" :filter="true"
                  size="large" optionLabel="label" optionValue="value"/>
        </FloatLabel>
        <FloatLabel variant="on">
          <label>{{ t('ReverseRole') }}</label>
          <Select v-model="updateDTO.target.role.value" :options="store.options.roleSet" :filter="true"
                  size="large" optionLabel="label" optionValue="value"/>
        </FloatLabel>
      </div>
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
  <Dialog :modal="true" v-model:visible="displayEntrySelector" :style="{width: '600px'}" :header="t('Add')">
    <EntrySelector :type="entryType" :entries="createdDTO.entities"/>
  </Dialog>
</template>

<style scoped lang="scss">
</style>