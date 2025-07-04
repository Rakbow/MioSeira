<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, onMounted, ref} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {useToast} from "primevue/usetoast";
import {META} from '@/config/Web_Const';
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {EntityManageParam, useEntityStore} from "@/logic/entityService";
import {PToast} from "@/logic/frame";
import {useConfirm} from "primevue";

const EntrySelector = defineAsyncComponent(() => import('@/components/selector/EntrySelector.vue'));

const store = useEntityStore();
const {t} = useI18n();
const toast = useToast();
const confirm = useConfirm();
const dialogRef = inject<any>("dialogRef");
const param = ref(new EntityManageParam());
const isUpdate = ref(false);
const dt = ref();
const entryType = ref(META.ENTRY_TYPE.PRODUCT);
const curEntryType = ref<any>(null);


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
    curEntryType.value = META.ENTRY_TYPE_SET[entryType.value - 1];
  }
})

onMounted(() => {
  param.value.initPage(0, 10);
  load();
});

const switchEntryType = (ev: any) => {
  if (ev.value === null) {
    entryType.value = META.ENTRY_TYPE.PRODUCT;
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
  relatedEntityType: META.ENTITY.ENTRY,
  relatedEntitySubType: entryType.value,
  roleId: 0,
  relatedRoleId: 0,
  entities: <any>[],
  relatedEntries: <any>[]
});
const openCreate = () => {
  createdDTO.value.roleId = 0;
  createdDTO.value.relatedRoleId = 0;
  createdDTO.value.entities = [];
  createdDTO.value.relatedEntries = [];
  createdDTO.value.relatedEntitySubType = entryType.value;
  createDialog.value = true;
  console.log(entryType.value)
}
const create = async () => {
  param.value.block();
  createdDTO.value.relatedEntries = createdDTO.value.entities.map(i => ({id: i.id, remark: i.remark}));
  const res = await axios.post(API.RELATION_CREATE, createdDTO.value);
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    createDialog.value = false;
    await load();
    toast.add(new PToast().success(res.message));
  } else {
    toast.add(new PToast().error(res.message));
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
  const res = await axios.post(API.RELATION_UPDATE, {
    id: updateDTO.value.id,
    roleId: updateDTO.value.role.value,
    relatedRoleId: updateDTO.value.target.role.value,
    remark: updateDTO.value.remark,
    direction: updateDTO.value.direction
  });
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    updateDialog.value = false;
    await load();
    toast.add(new PToast().success(res.message));
  } else {
    toast.add(new PToast().error(res.message));
  }
  param.value.endBlock();
}
//endregion

//region delete
const openDelete = () => {
  confirm.require({
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
  const res = await axios.delete(API.RELATION_DELETE, {ids: param.value.selectedData.map(i => i.id)});
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    toast.add(new PToast().success(res.message));
    await load();
  } else {
    toast.add(new PToast().error(res.message));
  }
  param.value.endBlock();
}
//endregion

//region query
const onPage = (ev: any) => {
  param.value.initPage(ev.first, ev.rows);
  load();
};
const onSort = (ev: any) => {
  param.value.initPage(0, dt.value.rows);
  param.value.initSort(ev.sortField, ev.sortOrder);
  load();
};

const load = async () => {
  param.value.load();
  const res = await axios.post(API.RELATION_LIST, param.value.query);
  if (res.state === axios.SUCCESS) {
    param.value.data = res.data.data;
    param.value.total = res.data.total
  }
  param.value.endLoad();
}
//endregion

</script>

<template>
  <BlockUI :blocked="param.blocking">
    <DataTable ref="dt" :value="param.data" :loading="param.loading"
               :alwaysShowPaginator="param.data.length !== 0"
               lazy :totalRecords="param.total" paginator
               :rows="param.query.rows" :first="param.query.first"
               @page="onPage($event)" @sort="onSort($event)"
               v-model:selection="param.selectedData" stripedRows size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;"
               scrollable scrollHeight="40rem" responsiveLayout="scroll">
      <template #header>
        <SelectButton size="small" v-model="curEntryType" :options="META.ENTRY_TYPE_SET"
                      @change="switchEntryType($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="{option}">
            <span class="material-symbols-outlined" style="font-size: 2rem"
                  v-tooltip.bottom="{value: t(option.label), class: 'short-tooltip'}">
              {{ option!.icon }}
            </span>
          </template>
        </SelectButton>

        <Button size="small" variant="text" outlined @click="openCreate" :disabled="param.blocking">
          <template #icon>
            <span class="material-symbols-outlined">add_box</span>
          </template>
        </Button>
        <Button variant="text" severity="danger"
                :disabled="!param.selectedData || !param.selectedData.length || param.blocking"
                outlined @click="openDelete">
          <template #icon>
            <span class="material-symbols-outlined">delete_forever</span>
          </template>
        </Button>
      </template>
      <template #empty>
        <span class="emptyInfo">
            {{ t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ t('CommonDataTableLoadingInfo') }}</span>
      </template>
      <Column selectionMode="multiple" style="width: 3rem" exportable/>
      <Column style="width: 3rem">
        <template #body="{data}">
          <Button variant="text" outlined size="small" @click="openUpdate(data)" style="padding: 0">
            <template #icon>
              <span style="font-size: 1.5rem" class="material-symbols-outlined">edit_square</span>
            </template>
          </Button>
        </template>
      </Column>
      <Column :header="t('Group')" field="target.subType.label" style="width: 4rem"/>
      <Column :header="t('Role')" field="target.role.label" style="width: 10rem"/>
      <Column :header="t('ReverseRole')" field="role.label" style="width: 10rem"/>
      <Column :header="t('RelatedEntity')">
        <template #body="{data}">
          <router-link class="common-link" :title="data.target.name"
                       :to="`${API.ENTRY_DETAIL_PATH}/${data.target.entityId}`">
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
          <Button variant="text" outlined @click="openEntrySelector">
            <template #icon>
              <span class="material-symbols-outlined">add_box</span>
            </template>
          </Button>
          <Button v-if="createdDTO.entities.length" variant="text" severity="danger"
                  outlined @click="clearRelatedEntry">
            <template #icon>
              <span class="material-symbols-outlined">delete_forever</span>
            </template>
          </Button>
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