<script setup>
import {onMounted, ref, inject, getCurrentInstance} from "vue";
import {PublicHelper} from '@/utils/publicHelper';
import {AxiosHelper as axios} from '@/utils/axiosHelper';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {META} from '@/config/Web_Const';
import {useRoute} from 'vue-router';
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";

const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;

const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const editRelatedItems = ref([]);

// const emit = defineEmits(['update']);
const isUpdate = ref(false);
const route = useRoute();

const relationTypeOption = ref([]);
const entityTypeOption = ref([]);

onMounted(() => {
  editRelatedItems.value = JSON.parse(JSON.stringify(dialogRef.value.data.relatedItems));
  getEntityInfo();
  initOption();
  isUpdate.value = false;
});

const entityType = ref();
const entityId = ref();
const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}
const editBlock = ref(false);

const initOption = async () => {
  if (relationTypeOption.value.length !== 0) return;
  const res = await axios.post($api.GET_ENTITY_OPTION, {entityType: -1});
  relationTypeOption.value = res.data.relationTypeSet;
  entityTypeOption.value = res.data.entityTypeSet;
}

const item = ref({
  id: 0,
  entityType: {},
  entity: {},
  type: {},
  action: META.ACTION.NO_ACTION
});

const selectedItem = ref(null);
const cm = ref();
const rowMenu = (ev) => {
  cm.value.show(ev.originalEvent);
};
const menuModel = [
  {
    label: $const.Delete,
    icon: 'pi pi-fw pi-user-minus',
    command: () => deleteItem(selectedItem.value)
  }
];
const deleteItem = (item) => {
  let tmpItem = editRelatedItems.value.find((i) => i.entityType.value === item.entityType.value && i.entityId === item.entityId);
  if (!_isUndefined(tmpItem)) {
    tmpItem.action = META.ACTION.REAL_DELETE;
  }
  toast.add({severity: 'error', summary: $const.MessageDeleted, detail: '', life: 3000});
  selectedItem.value = null;
};

const clear = () => {
  editRelatedItems.value = [];
};
const cancelEdit = () => {
  dialogRef.value.close(
      {
        isUpdate: isUpdate.value
      }
  );
};
const submit = async () => {
  let param = {
    entityId: entityId.value,
    entityType: entityType.value,
    relations: editRelatedItems.value
  }
  const res = await axios.post($api.MANAGE_RELATION, param);
  if (res.message !== '') {
    if (res.state === axios.SUCCESS) {
      isUpdate.value = true;
      cancelEdit();
      toast.add({severity: 'success', summary: res.message, detail: '', life: 3000});
    } else {
      toast.add({severity: 'error', summary: res.message, detail: '', life: 3000});
    }
  }
};

const itemSet = ref([]);
const searchItem = async (event) => {
  if (_isEmpty(event.query)) return;
  let param = {
    entityType: item.value.entityType.value,
    param: {
      keyword: event.query,
      first: 0,
      row: 20
    }
  }
  const res = await axios.post($api.GENERAL_SEARCH, param);
  itemSet.value = res.data.data;
}
const addItem = () => {
  let newItem = {
    id: 0,
    entityType: item.value.entityType,
    entityId: item.value.entity.id,
    relationType: item.value.type,
    action: META.ACTION.INSERT,

    cover: item.value.entity.cover,
    name: item.value.entity.name,
    nameZh: item.value.entity.nameZh
  }
  editRelatedItems.value.push(newItem);
  toast.add({severity: 'success', summary: $const.MessageAdded, detail: '', life: 3000});
  item.value = {
    id: 0,
    entityType: {},
    entity: {},
    type: {},
    action: META.ACTION.NO_ACTION
  };
}
</script>

<template>
  <BlockUI :blocked="editBlock">
    <panel>
      <template #header>
        <i class="pi pi-user-plus mr-2" style="font-size: 2rem"/>
        <b>{{ $const.Add }}</b>
      </template>
      <div class="grid">
        <div class="col-3">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-tag"/>
            </span>
            <Dropdown v-model="item.type" :options="relationTypeOption" optionLabel="label" filter
                      :placeholder="$const.RelatedType">
              <template #option="slotProps">
                <div class="flex align-options-center">
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="col-2">
          <Dropdown v-model="item.entityType" :options="entityTypeOption" optionLabel="label" filter
                    :placeholder="$const.Type">
            <template #option="slotProps">
              <div class="flex align-options-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Dropdown>
        </div>
        <div class="col-5">
          <AutoComplete v-model="item.entity" optionLabel="name" :suggestions="itemSet"
                        @complete="searchItem" inputStyle="min-width: 270px">
            <template #option="slotProps">
              <div class="flex align-options-center">
<!--                <img :src="slotProps.option.cover" style="width: 50px" alt="cover"/>-->
                <div>{{ `${slotProps.option.name}/${slotProps.option.nameZh}(${slotProps.option.type.label})` }}</div>
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="col-2">
          <Button icon="pi pi-plus-circle" rounded @click="addItem"/>
        </div>
      </div>
    </panel>
    <panel>
      <template #header>
        <i class="pi pi-user-edit mr-2" style="font-size: 2rem"/>
        <b>{{ $const.Edit }}</b>
      </template>
      <div v-if="editRelatedItems">
        <DataTable dataKey="id" :value="editRelatedItems" responsiveLayout="scroll"
                   class="p-datatable-sm" stripedRows @rowContextmenu="rowMenu"
                   contextMenu v-model:contextMenuSelection="selectedItem">
          <Column :header="$const.RelatedType">
            <template #body="slotProps">
              {{ slotProps.data.relationType.label }}
            </template>
          </Column>
          <Column :header="$const.Type">
            <template #body="slotProps">
              {{ slotProps.data.entityType.label }}
            </template>
          </Column>
          <Column :header="$const.Entity">
            <template #body="slotProps">
              <img :src="slotProps.data.cover" :alt="slotProps.data.name"
                   class="edit-image" />
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column :header="$const.Action">
            <template #body="slotProps">
              <i v-if="slotProps.data.action === META.ACTION.INSERT" class="pi pi-true-icon pi-check-circle"></i>
              <i v-if="slotProps.data.action === META.ACTION.REAL_DELETE" class="pi pi-false-icon pi-times-circle"></i>
            </template>
          </Column>
        </DataTable>
        <ContextMenu :model="menuModel" ref="cm"/>
      </div>
      <div v-else>
        <span class="emptyInfo">{{ $const.NoInfo }}</span>
      </div>
    </panel>
    <div class="text-end mt-3 mb-2">
      <Button :label="$const.Clear" icon="pi pi-trash" class="p-button-danger mr-4"
              @click="clear" :disabled="editBlock"/>
      <Button :label="$const.Cancel" icon="pi pi-times" class="mr-4"
              @click="cancelEdit" :disabled="editBlock"/>
      <Button :label="$const.Update" icon="pi pi-save" class="p-button-success mr-4"
              @click="submit" :disabled="editBlock"/>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>