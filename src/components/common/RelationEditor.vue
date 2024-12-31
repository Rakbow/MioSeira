<script setup lang="ts">
import {onMounted, ref, inject, defineAsyncComponent, defineProps, onBeforeMount} from "vue";
import {PublicHelper} from '@/toolkit/publicHelper.ts';
import {AxiosHelper as axios} from '@/toolkit/axiosHelper.ts';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {EntityInfo} from '@/config/Web_Const.ts';
import { useRoute } from 'vue-router';
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {useOptionsStore} from "@/store/entityOptions";
const EntrySelector = defineAsyncComponent(() => import('@/components/common/EntrySelector.vue'));

const opStore = useOptionsStore();
const {t} = useI18n();
const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const entityInfo = ref<EntityInfo>();
const isUpdate = ref(false);
const route = useRoute();
const relations = ref([]);
const editBlock = ref(false);
const filters = ref({
  'entityType': {value: entityInfo.value?.type},
  'entityId': {value: entityInfo.value?.id},
  'relatedGroup': {value: -1},
  'direction': {value: 1}
});
const roleSet = ref([]);
const dt = ref();
const first = ref(0);
const totalRecords = ref(0);
const queryParams = ref({});
const selectedItems = ref([]);
const loading = ref(false);
const displayAddDialog = ref(false);
const displayEditDialog = ref(false);
const displayDeleteDialog = ref(false);
const confirmDeleteSelected = () => {
  displayDeleteDialog.value = true;
}

onBeforeMount(() => {
  filters.value.direction.value = dialogRef.value.data.direction;
  filters.value.relatedGroup.value = dialogRef.value.data.relatedGroup;
  roleSet.value = (opStore.options as any).roleSet;
})

onMounted(async () => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
  await opStore.fetchOptions();
  isUpdate.value = false;
  loading.value = true;
  filters.value.entityType.value = entityInfo.value?.type;
  filters.value.entityId.value = entityInfo.value?.id;
  queryParams.value = {
    first: 0,
    rows: dt.value.rows,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  };
  await getRelation();
  loading.value = false;
});

const getRelation = async () => {
  loading.value = true;
  editBlock.value = true;
  const res = await axios.post(API.GET_RELATION, queryParams.value);
  if(res.state === axios.SUCCESS) {
    if(res.data.data === null)
      relations.value = [];
    else
      relations.value = res.data.data;
    totalRecords.value = res.data.total
  }
  first.value = queryParams.value.first;
  editBlock.value = false;
  loading.value = false;
}

const itemAdd = ref({
  role: {},
  reverseRole: {},
  entities: []
});
const itemEdit = ref({});

const selectedItem = ref(null);
const cancelEdit = () => {
  dialogRef.value.close(
    {
      isUpdate: isUpdate.value
    }
  );
};

const displayEntrySelector = ref(false);
const openEntrySelector = () => {
  displayEntrySelector.value = true;
}
const removeRelatedEntry = (index) => {
  itemAdd.value.entities.splice(index, 1);
}
const clearRelatedEntry = () => {
  itemAdd.value.entities = [];
}

const openAddDialog = () => {
  displayAddDialog.value = true;
  itemAdd.value = {
    role: roleSet.value[0],
    reverseRole: roleSet.value[0],
    entities: []
  }
}

const openEditDialog = (value) => {
  displayEditDialog.value = true;
  itemEdit.value = value;
}

const addRelation = async () => {
  editBlock.value = true;
  let param = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    relatedEntityType: itemAdd.value.entities[0].type,
    roleId: itemAdd.value.role.value,
    reverseRoleId: itemAdd.value.reverseRole.value,
    relatedEntityIds: itemAdd.value.entities.map(i => i.id)
  }
  const res = await axios.post(API.ADD_RELATION, param);
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    displayAddDialog.value = false;
    await getRelation();
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
    remark:itemEdit.value.remark
  }
  const res = await axios.post(API.UPDATE_RELATION, param);
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    displayEditDialog.value = false;
    await getRelation();
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
  const res = await axios.delete(API.DELETE_RELATION, param);
  if (res.state === axios.SUCCESS) {
    isUpdate.value = true;
    displayDeleteDialog.value = false;
    await getRelation();
    toast.add({severity: 'success', summary: res.message, detail: '', life: 3000});
  } else {
    toast.add({severity: 'error', summary: res.message, detail: '', life: 3000});
  }
  editBlock.value = false;
}

const onPage = (ev) => {
  queryParams.value = ev;
  getRelation();
};
const onSort = (ev) => {
  queryParams.value = ev;
  getRelation();
};
const onFilter = () => {
  queryParams.value.filters = filters.value;
  getRelation();
};

</script>

<template>
  <BlockUI :blocked="editBlock">
    <DataTable ref="dt" :value="relations" class="p-datatable-sm" :loading="loading"
               :alwaysShowPaginator="relations.length !== 0"
               lazy v-model:filters="filters" :totalRecords="totalRecords" paginator :rows="50" :first="first"
               @page="onPage($event)" @sort="onSort($event)" @filter="onFilter"
               v-model:selection="selectedItems" stripedRows size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}"
               scrollable scrollHeight="400px" responsiveLayout="scroll">
      <template #header>
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
            {{ $t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ $t('CommonDataTableLoadingInfo') }}</span>
      </template>
      <Column selectionMode="multiple" style="flex: 0 0 3rem" exportable/>
      <Column>
        <template #body="slotProps">
          <i style="cursor: pointer" class="pi pi-pencil" @click="openEditDialog(slotProps.data)"/>
        </template>
      </Column>
      <Column :header="$t('Group')" field="relatedGroup" style="flex: 0 0 10rem">
        <template #body="slotProps">
          {{ slotProps.data.relatedGroup.label }}
        </template>
      </Column>
      <Column :header="$t('Role')" field="role" style="flex: 0 0 10rem">
        <template #body="slotProps">
          {{ slotProps.data.role.label }}
        </template>
      </Column>
      <Column :header="$t('ReverseRole')" field="reverseRole" style="flex: 0 0 10rem">
        <template #body="slotProps">
          {{ slotProps.data.reverseRole.label }}
        </template>
      </Column>
      <Column :header="$t('RelatedEntity')" field="role" style="flex: 0 0 10rem">
        <template #body="slotProps">
          <router-link class="common-link" :to="`/db/${slotProps.data.relatedTypeName}/${slotProps.data.target.value}`">
            {{ slotProps.data.target.label }}
          </router-link>
        </template>
      </Column>
      <Column :header="$t('Remark')" field="remark" />
    </DataTable>
  </BlockUI>
  <Dialog :modal="true" v-model:visible="displayAddDialog" :style="{width: '600px'}" :header="$t('Add')"
          class="p-fluid">
    <template #header>
      <i class="pi pi-user-plus mr-2" style="font-size: 2rem" />
      <b>{{$t('Add')}}</b>
    </template>
    <div class="grid">
      <div class="col-6">
        <label class="ml-1">{{ $t('Role') }}</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-tag" />
          </InputGroupAddon>
          <Select size="small" v-model="itemAdd.role" :options="roleSet" optionLabel="label" filter>
            <template #option="slotProps">
              <div class="flex align-options-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
        </InputGroup>
      </div>
      <div class="col-6">
        <label class="ml-1">{{ $t('ReverseRole') }}</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-tag" />
          </InputGroupAddon>
          <Select size="small" v-model="itemAdd.reverseRole" :options="roleSet" optionLabel="label" filter>
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
          <div v-for="(entry, index) in slotProps.items" :key="index" class="p-3">
            <div class="grid" style="border: 1px solid gray;border-radius: 5px;">
              <div class="col-fixed p-1" style="width: 60px">
                <div class="entry-thumb-50">
                  <img role="presentation" :alt="entry.name" :src="entry.cover"/>
                </div>
              </div>
              <div class="col p-1" style="width: 120px">
                    <span class="mt-1 block data-table-field-text-overflow-hidden text-sm">
                      {{ entry.name }}
                    </span>
                <small style="color: gray" class="mt-1 block data-table-field-text-overflow-hidden">
                  {{ (entry as any).subName }}
                </small>
              </div>
              <Divider type="dashed" class="mt-0 mb-0"/>
              <div class="col p-1"></div>
              <div class="col-fixed p-1">
                <Button size="small" icon="pi pi-trash" severity="danger" variant="text"
                        @click="removeRelatedEntry(index)" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>



<!--    <div class="formgrid grid">-->
<!--      <div class="field col-10">-->
<!--        <AutoComplete v-model="itemAdd.entities" separator="," multiple :typeahead="false">-->
<!--          <template #chip="slotProps">-->
<!--            <i class="pi pi-user" />-->
<!--            <span>{{slotProps.value.name}}</span>-->
<!--          </template>-->
<!--        </AutoComplete>-->
<!--      </div>-->
<!--      <div class="field col">-->
<!--        <Button :label="$t('Add')" @click="openSelector"/>-->
<!--      </div>-->
<!--    </div>-->
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text" @click="displayAddDialog = false"
              :disabled="editBlock"/>
      <Button :label="$t('Save')" icon="pi pi-check" class="p-button-text" @click="addRelation"
              :disabled="editBlock"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayDeleteDialog" :header="$t('Delete')"
          :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
      <span>{{ $t('ConfirmDeleteImage') }}</span>
    </div>
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayDeleteDialog = false"/>
      <Button :label="$t('Delete')" icon="pi pi-check" class="p-button-text"
              @click="deleteRelation"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayEditDialog" :header="$t('Edit')" class="p-fluid">
    <div class="grid">
      <div class="entry-thumb-box col"><img class="entry-thumb" :src="itemEdit.cover"
                                            :alt="itemEdit.target.label"/></div>
      <div class="col-8">
        <div class="text-lg font-light">{{ itemEdit.target.label }}</div>
      </div>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <label>{{ $t('Role') }}</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-tag" />
          </InputGroupAddon>
          <Select v-model="itemEdit.role" :options="opStore.options.roleSet" optionLabel="label" filter :placeholder="$t('Role')">
            <template #option="slotProps">
              <div class="flex align-options-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
        </InputGroup>
      </div>
      <div class="field col">
        <label>{{ $t('ReverseRole') }}</label>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-tag" />
          </InputGroupAddon>
          <Select v-model="itemEdit.reverseRole" :options="opStore.options.roleSet" optionLabel="label" filter :placeholder="$t('Role')">
            <template #option="slotProps">
              <div class="flex align-options-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Select>
        </InputGroup>
      </div>
    </div>
    <div class="field">
      <label>{{ $t('Remark') }}</label>
      <Textarea v-model="itemEdit.remark" rows="3" cols="20" :autoResize="true"/>
    </div>
    <template #footer>
      <Button :label="$t('Cancel')" icon="pi pi-times" class="p-button-text"
              @click="displayEditDialog = false"/>
      <Button :label="$t('Save')" icon="pi pi-check" class="p-button-text"
              @click="updateRelation"/>
    </template>
  </Dialog>
  <Dialog :modal="true" v-model:visible="displayEntrySelector" :style="{width: '600px'}" :header="$t('Add')">
    <EntrySelector :type="filters.relatedGroup.value" :entries="itemAdd.entities" />
  </Dialog>
</template>

<style scoped lang="scss">
@use '@/assets/entity-global';
</style>