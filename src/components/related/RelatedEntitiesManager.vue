<script setup lang="ts">
import {onMounted, ref, inject, defineAsyncComponent, onBeforeMount} from "vue";
import {PublicHelper} from '@/toolkit/publicHelper';
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {useToast} from "primevue/usetoast";
import {Attribute, EntityInfo, META, QueryParams} from '@/config/Web_Const';
import {useRoute} from 'vue-router';
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {useEntityStore} from "@/logic/entityService";
import {DialogServiceMethods} from "primevue/dialogservice";

const EntrySelector = defineAsyncComponent(() => import('@/components/selector/EntrySelector.vue'));

const store = useEntityStore();
const {t} = useI18n();
const toast = useToast();
const dialogRef = inject("dialogRef");
const entityInfo = ref<EntityInfo>();
const isUpdate = ref(false);
const route = useRoute();
const relations = ref([]);
const editBlock = ref(false);
const filters = ref({
  entityType: {value: null},
  entityId: {value: null},
  relatedGroup: {value: null}
});
const dt = ref();
const first = ref(0);
const totalRecords = ref(0);
const queryParams = ref<QueryParams>(new QueryParams());
const selectedItems = ref([]);
const loading = ref(false);
const displayAddDialog = ref(false);
const displayEditDialog = ref(false);
const displayDeleteDialog = ref(false);
const entryType = ref();
const relatedGroup = ref();
const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

onBeforeMount(async () => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
  await store.fetchOptions();
})

onMounted(async () => {
  initQueryParam();
  relatedGroup.value = META.RELATED_GROUP_SET[dialogRef.value.data.relatedGroup - 1];
  await getRelations();
});

const initQueryParam = () => {
  queryParams.value = {
    first: 0,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: {
      entityType: {value: entityInfo.value?.type},
      entityId: {value: entityInfo.value?.id},
      relatedGroup: {value: dialogRef.value.data.relatedGroup}
    }
  };
}

const switchRelatedGroup = (ev: Event) => {
  if (ev.value === null) {
    entryType.value = null;
    queryParams.value.filters.relatedGroup.value = null;
  } else {
    entryType.value = parseInt(relatedGroup.value.value);
    queryParams.value.filters.relatedGroup.value = entryType.value;
  }
  getRelations();
}

const itemAdd = ref({
  role: new Attribute(),
  reverseRole: new Attribute(),
  entities: <any>[]
});
const itemEdit = ref<any>({});
const displayEntrySelector = ref(false);
const openEntrySelector = () => {
  displayEntrySelector.value = true;
}
const removeRelatedEntry = (index: number) => {
  itemAdd.value.entities.splice(index, 1);
}
const clearRelatedEntry = () => {
  itemAdd.value.entities = [];
}

const openAddDialog = () => {
  displayAddDialog.value = true;
  itemAdd.value = {
    role: store.options.roleSet[0],
    reverseRole: store.options.roleSet[0],
    entities: []
  }
}

const openEditDialog = (value: any) => {
  displayEditDialog.value = true;
  itemEdit.value = value;
}

const getRelations = async () => {
  loading.value = true;
  editBlock.value = true;
  const res = await axios.post(API.RELATION_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    if (res.data.data === null)
      relations.value = [];
    else
      relations.value = res.data.data;
    totalRecords.value = res.data.total
  }
  first.value = queryParams.value.first;
  editBlock.value = false;
  loading.value = false;
}

const addRelation = async () => {
  editBlock.value = true;
  let param = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    relatedGroup: queryParams.value.filters.relatedGroup.value,
    roleId: itemAdd.value.role.value,
    reverseRoleId: itemAdd.value.reverseRole.value,
    relatedEntries: itemAdd.value.entities.map(i => ({id: i.id, remark: i.remark}))
  }
  const res = await axios.post(API.RELATION_CREATE, param);
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    displayAddDialog.value = false;
    await getRelations();
    toast.add({severity: 'success', summary: res.message, detail: '', life: 3000});
  } else {
    toast.add({severity: 'error', summary: res.message, detail: '', life: 3000});
  }
  editBlock.value = false;
}

const updateRelation = async () => {
  editBlock.value = true;
  let param = {
    id: itemEdit.value.id,
    roleId: itemEdit.value.role.value,
    reverseRoleId: itemEdit.value.reverseRole.value,
    remark: itemEdit.value.remark
  }
  const res = await axios.post(API.RELATION_UPDATE, param);
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    displayEditDialog.value = false;
    await getRelations();
    toast.add({severity: 'success', summary: res.message, detail: '', life: 3000});
  } else {
    toast.add({severity: 'error', summary: res.message, detail: '', life: 3000});
  }
  editBlock.value = false;
}

const deleteRelation = async () => {
  editBlock.value = true;
  let param = {
    ids: selectedItems.value.map(i => i.id)
  }
  const res = await axios.delete(API.RELATION_DELETE, param);
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    displayDeleteDialog.value = false;
    await getRelations();
    toast.add({severity: 'success', summary: res.message, detail: '', life: 3000});
  } else {
    toast.add({severity: 'error', summary: res.message, detail: '', life: 3000});
  }
  editBlock.value = false;
}

const onPage = (ev) => {
  queryParams.value = ev;
  getRelations();
};
const onSort = (ev) => {
  queryParams.value = ev;
  getRelations();
};
const onFilter = () => {
  queryParams.value.filters = filters.value;
  getRelations();
};

</script>

<template>
  <BlockUI :blocked="editBlock">
    <DataTable ref="dt" :value="relations" class="p-datatable-sm" :loading="loading"
               :alwaysShowPaginator="relations.length !== 0"
               lazy v-model:filters="filters" :totalRecords="totalRecords" paginator :rows="10" :first="first"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               v-model:selection="selectedItems" stripedRows size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}"
               scrollable scrollHeight="400px" responsiveLayout="scroll">
      <template #header>
        <SelectButton size="small" v-model="relatedGroup" :options="META.ENTRY_TYPE_SET"
                      @change="switchRelatedGroup($event)"
                      optionLabel="value" dataKey="value" ariaLabelledby="custom">
          <template #option="slotProps">
            <span class="material-symbols-outlined" style="font-size: 20px"
                  v-tooltip.bottom="{value: t(slotProps.option.label), class: 'short-tooltip'}">
              {{ slotProps.option.icon }}
            </span>
          </template>
        </SelectButton>

        <Button size="small" variant="text" outlined @click="openAddDialog" :disabled="editBlock">
          <template #icon>
            <span class="material-symbols-outlined">add_box</span>
          </template>
        </Button>
        <Button variant="text" severity="danger" :disabled="!selectedItems || !selectedItems.length || editBlock"
                outlined @click="confirmDeleteSelected">
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
      <Column selectionMode="multiple" style="flex: 0 0 3rem" exportable/>
      <Column>
        <template #body="slotProps">
          <i style="cursor: pointer" class="pi pi-pencil" @click="openEditDialog(slotProps.data)"/>
        </template>
      </Column>
      <Column :header="t('Group')" field="relatedGroup" style="flex: 0 0 10rem">
        <template #body="slotProps">
          {{ slotProps.data.relatedGroup.label }}
        </template>
      </Column>
      <Column :header="t('Role')" field="role" style="flex: 0 0 10rem">
        <template #body="slotProps">
          {{ slotProps.data.role.label }}
        </template>
      </Column>
      <Column :header="t('ReverseRole')" field="reverseRole" style="flex: 0 0 10rem">
        <template #body="slotProps">
          {{ slotProps.data.reverseRole.label }}
        </template>
      </Column>
      <Column :header="t('RelatedEntity')" field="role" style="flex: 0 0 10rem">
        <template #body="slotProps">
          <router-link class="common-link" :to="`/db/${META.ENTITY_TYPE_SET[slotProps.data.targetType]}/${slotProps.data.target.value}`">
            {{ slotProps.data.target.label }}
          </router-link>
        </template>
      </Column>
      <Column :header="t('Remark')" field="remark"/>
    </DataTable>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="displayAddDialog" :style="{width: '600px'}" :header="t('Add')"
          class="p-fluid">
    <template #header>
      <i class="pi pi-user-plus mr-2" style="font-size: 2rem"/>
      <b>{{ t('Add') }}</b>
    </template>
    <div class="grid">
      <div class="col-6">
        <label class="ml-1">{{ t('Role') }}</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-tag"/>
          </InputGroupAddon>
          <Select size="small" v-model="itemAdd.role" :options="store.options.roleSet" optionLabel="label" filter>
            <template #option="slotProps">
              <div class="flex align-options-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
        </InputGroup>
      </div>
      <div class="col-6">
        <label class="ml-1">{{ t('ReverseRole') }}</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-tag"/>
          </InputGroupAddon>
          <Select size="small" v-model="itemAdd.reverseRole" :options="store.options.roleSet" optionLabel="label" filter>
            <template #option="slotProps">
              <div class="flex align-options-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
        </InputGroup>
      </div>
    </div>
    <DataView :value="itemAdd.entities" layout="grid">
      <template #empty>
        <span class="empty-search-result"/>
      </template>
      <template #header>
        <Button variant="text" outlined @click="openEntrySelector">
          <template #icon>
            <span class="material-symbols-outlined">add_box</span>
          </template>
        </Button>
        <Button v-if="itemAdd.entities.length" variant="text" severity="danger"
                outlined @click="clearRelatedEntry">
          <template #icon>
            <span class="material-symbols-outlined">delete_forever</span>
          </template>
        </Button>
      </template>
      <template #grid="slotProps">
        <div class="flex flex-wrap">
          <div v-for="(entry, index) in slotProps.items" :key="index" class="p-3" style="width: 220px">
            <div class="grid" style="border: 1px solid gray;border-radius: 5px;">
              <div class="col-fixed p-1" style="width: 45px">
                <div class="entry-thumb">
                  <img role="presentation" :alt="entry.name" :src="entry.thumb"/>
                </div>
              </div>
              <div class="col p-1">
                <span class="text-sm">{{ entry.name }}</span><br>
                <small style="color: gray" class="text-xs">
                  <span>{{ entry.subName }}</span>
                </small>
              </div>
              <Divider type="dashed" class="mt-0 mb-0"/>
              <div class="col p-1" style="max-width: 160px;">
                <InputText size="small" v-model="entry.remark"/>
              </div>
              <div class="col-fixed p-1">
                <Button size="small" icon="pi pi-trash" severity="danger" variant="text"
                        @click="removeRelatedEntry(index)"/>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text" @click="displayAddDialog = false"
              :disabled="editBlock"/>
      <Button :label="t('Save')" icon="pi pi-check" class="p-button-text" @click="addRelation"
              :disabled="editBlock"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayDeleteDialog" :header="t('Delete')" :style="{width: '400px'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
      <span>{{ t('ConfirmDeleteImage') }}</span>
    </div>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayDeleteDialog = false"/>
      <Button :label="t('Delete')" icon="pi pi-check" class="p-button-text"
              @click="deleteRelation"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayEditDialog" :header="t('Edit')" class="p-fluid">
    <div class="flex flex-wrap">
      <div class="p-3" style="width: 220px">
        <div class="grid" style="border: 1px solid gray;border-radius: 5px;">
          <div class="col-fixed p-1" style="width: 45px">
            <div class="entry-thumb">
              <img role="presentation" :alt="itemEdit.name" :src="itemEdit.thumb"/>
            </div>
          </div>
          <div class="col p-1">
            <span class="text-sm">{{ itemEdit.target.label }}</span><br>
            <small style="color: gray" class="text-xs"></small>
          </div>
        </div>
      </div>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Role') }}</label>
        <Select v-model="itemEdit.role" :options="store.options.roleSet"
                size="small" optionLabel="label" filter class="static w-full">
          <template #option="slotProps">
            <div class="flex align-options-center">
              <div>{{ slotProps.option.label }}</div>
            </div>
          </template>
        </Select>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Role') }}</label>
        <Select v-model="itemEdit.reverseRole" :options="store.options.roleSet"
                size="small" optionLabel="label" filter class="static w-full">
          <template #option="slotProps">
            <div class="flex align-options-center">
              <div>{{ slotProps.option.label }}</div>
            </div>
          </template>
        </Select>
      </FloatLabel>
    </div>
    <div class="field">
      <FloatLabel variant="on">
        <label>{{ t('Remark') }}</label>
        <InputText size="small" v-model="itemEdit.remark" class="static w-full"/>
      </FloatLabel>
    </div>
    <template #footer>
      <Button :label="t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayEditDialog = false"/>
      <Button :label="t('Save')" icon="pi pi-check" class="p-button-text"
              @click="updateRelation"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayEntrySelector" :style="{width: '600px'}" :header="t('Add')">
    <EntrySelector :type="entryType" :entries="itemAdd.entities"/>
  </Dialog>
</template>

<style scoped lang="scss">
@use '@/assets/entity-global.scss';
</style>