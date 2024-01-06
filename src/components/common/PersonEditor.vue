<script setup>
import {onMounted, ref, inject, getCurrentInstance} from "vue";
import {PublicHelper} from '@/utils/publicHelper';
import {AxiosHelper as axios, AxiosHelper} from '@/utils/axiosHelper';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs';
import {META} from '@/config/Web_Const';
import { useRoute } from 'vue-router';
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;

const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const editPersonnel = ref([]);

// const emit = defineEmits(['update']);
const isUpdate = ref(false);
const route = useRoute();

const roleOption = ref([]);

onMounted(() => {
  editPersonnel.value = dialogRef.value.data.personnel;
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

const initOption= async () => {
  if(roleOption.value.length !== 0) return;
  const res = await axios.post($api.GET_META_DATA);
  roleOption.value = res.data.roleSet;
}

const item = ref({
  main: false,
  role: {},
  person: {}
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
  let tmpItem = editPersonnel.value.find((i) => i.person.value === item.person.value && i.role.value === item.role.value);
  if(!_isUndefined(tmpItem)) {
    tmpItem.action = META.ACTION.REAL_DELETE;
  }
  toast.add({severity: 'error', summary: $const.MessageDeleted, detail: '', life: 3000});
  selectedItem.value = null;
};

const clear = () => {
  editPersonnel.value = [];
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
    personnel: editPersonnel.value
  }
  const res = await axios.post($api.MANAGE_PERSONNEL, param);
  if(res.message !== '') {
    if(res.state === axios.SUCCESS) {
      isUpdate.value = true;
      cancelEdit();
      toast.add({severity: 'success', summary: res.message, detail: '', life: 3000});
    }else {
      toast.add({severity: 'error', summary: res.message, detail: '', life: 3000});
    }
  }
};

const personSet = ref([]);
const searchPerson = async (event) => {
  if(_isEmpty(event.query)) return;
  let param = {
    keyword: event.query,
    first: 0,
    row: 100
  }
  const res = await axios.post($api.SEARCH_PERSON, param);
  personSet.value = res.data.data;
}
const addItem = () => {
  let newItem = {
    id: 0,
    main: item.value.main,
    role: {
      label: item.value.role.label,
      value: item.value.role.value
    },
    person: {
      label: `${item.value.person.name} / ${item.value.person.nameZh}`,
      value: item.value.person.id
    },
    action: META.ACTION.INSERT
  }
  editPersonnel.value.push(newItem);
  toast.add({severity: 'success', summary: $const.MessageAdded, detail: '', life: 3000});
  item.value.main = false;
  item.value.person = {};
}
</script>

<template>
  <BlockUI :blocked="editBlock">
    <panel>
      <template #header>
        <i class="pi pi-user-plus mr-2" style="font-size: 2rem" />
        <b>{{$const.Add}}</b>
      </template>
      <div class="grid">
        <div class="col-5">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-tag" />
            </span>
            <span class="p-inputgroup-addon">
                <Checkbox v-model="item.main" :binary="true" :trueValue="1" :falseValue="0" />
            </span>
            <Dropdown v-model="item.role" :options="roleOption" optionLabel="label" filter :placeholder="$const.Role" >
              <template #option="slotProps">
                <div class="flex align-options-center">
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="col-5">
          <AutoComplete v-model="item.person" optionLabel="name" :suggestions="personSet"
                        @complete="searchPerson" inputStyle="min-width: 270px">
            <template #option="slotProps">
              <div class="flex align-options-center">
                <img :src="slotProps.option.cover" style="width: 50px" />
                <div>{{ `${slotProps.option.name}/${slotProps.option.nameZh}` }}</div>
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="col-2">
          <Button icon="pi pi-plus-circle" rounded @click="addItem" />
        </div>
      </div>
    </panel>
    <panel>
      <template #header>
        <i class="pi pi-user-edit mr-2" style="font-size: 2rem" />
        <b>{{$const.Edit}}</b>
      </template>
      <div v-if="editPersonnel">
        <DataTable dataKey="id" :value="editPersonnel" responsiveLayout="scroll"
                   class="p-datatable-sm" stripedRows @rowContextmenu="rowMenu"
                   contextMenu v-model:contextMenuSelection="selectedItem">
          <Column field="main" header-style="width: 3%">
            <template #body="slotProps">
              <i v-if="slotProps.data.main" class="pi false-icon pi-star-fill"></i>
            </template>
          </Column>
          <Column field="role" :header="$const.Role">
            <template #body="slotProps">
              {{slotProps.data.role.label}}
            </template>
          </Column>
          <Column field="person" :header="$const.Person">
            <template #body="slotProps">
              {{slotProps.data.person.label}}
            </template>
          </Column>
          <Column field="action" :header="$const.Action">
            <template #body="slotProps">
              <i v-if="slotProps.data.action === META.ACTION.INSERT" class="pi pi-true-icon pi-check-circle"></i>
              <i v-if="slotProps.data.action === META.ACTION.REAL_DELETE" class="pi pi-false-icon pi-times-circle"></i>
            </template>
          </Column>
        </DataTable>
        <ContextMenu :model="menuModel" ref="cm" />
      </div>
      <div v-else>
        <span class="emptyInfo">{{$const.NoPerson}}</span>
      </div>
    </panel>
    <div class="text-end mt-3 mb-2">
      <Button :label="$const.Clear" icon="pi pi-trash" class="p-button-danger mr-4"
                @click="clear" :disabled="editBlock" />
      <Button :label="$const.Cancel" icon="pi pi-times" class="mr-4"
                @click="cancelEdit" :disabled="editBlock" />
      <Button :label="$const.Update" icon="pi pi-save" class="p-button-success mr-4"
                @click="submit" :disabled="editBlock" />
    </div>
  </BlockUI>
</template>

<style scoped>

</style>