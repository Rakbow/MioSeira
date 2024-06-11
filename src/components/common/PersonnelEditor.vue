<script setup lang="ts">
import {onMounted, ref, inject, getCurrentInstance, defineAsyncComponent} from "vue";
import {PublicHelper} from '@/toolkit/publicHelper.ts';
import {AxiosHelper as axios} from '@/toolkit/axiosHelper.ts';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {META} from '@/config/Web_Const.ts';
import { useRoute } from 'vue-router';
import _isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import InfoEditor from "@/components/entityEditor/PersonInfoEditor.vue";
const entrySelector = defineAsyncComponent(() => import('@/components/common/EntrySelector.vue'));

const {t} = useI18n();
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
  const res = await axios.post(API.GET_ENTITY_OPTION, {type: -1});
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
      label: t('Delete'),
      icon: 'pi pi-fw pi-user-minus',
      command: () => deleteItem(selectedItem.value)
    }
];
const deleteItem = (item) => {
  let tmpItem = editPersonnel.value.find((i) => i.person.value === item.person.value && i.role.value === item.role.value);
  if(!_isUndefined(tmpItem)) {
    tmpItem.action = META.ACTION.REAL_DELETE;
  }
  toast.add({severity: 'error', summary: t('MessageDeleted'), detail: '', life: 3000});
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
  const res = await axios.post(API.MANAGE_PERSONNEL, param);
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
  const res = await axios.post(API.SEARCH_PERSON, param);
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
  toast.add({severity: 'success', summary: t('MessageAdded'), detail: '', life: 3000});
  item.value.main = false;
  item.value.person = {};
}

const openSelector = () => {
  dialog.open(entrySelector, {
    props: {
      header: 'Entry Selector',
      style: {
        width: '600px',
      },
      breakpoints:{
        '960px': '70vw',
        '640px': '60vw'
      },
      modal: true,
      closable: true
    },
    onClose: async (options) => {
      // if (options.data !== undefined) {
      //   if (options.data.isUpdate) {
      //     await getItems();
      //   }
      // }
    }
  });
}

</script>

<template>
  <BlockUI :blocked="editBlock">
    <panel>
      <template #header>
        <i class="pi pi-user-plus mr-2" style="font-size: 2rem" />
        <b>{{$t('Add')}}</b>
      </template>
      <div class="grid">
        <div class="col-5">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-tag" />
            </InputGroupAddon>
            <InputGroupAddon>
              <Checkbox v-model="item.main" :binary="true" :trueValue="1" :falseValue="0" />
            </InputGroupAddon>
            <Select v-model="item.role" :options="roleOption" optionLabel="label" filter :placeholder="$t('Role')" >
              <template #option="slotProps">
                <div class="flex align-options-center">
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template>
            </Select>
          </InputGroup>
        </div>
        <div class="col-5">
          <Button label="test" @click="openSelector"/>
<!--          <AutoComplete v-model="item.person" optionLabel="name" :suggestions="personSet"-->
<!--                        @complete="searchPerson" style="min-width: 270px">-->
<!--            <template #chip="slotProps">-->
<!--              <div class="flex align-options-center">-->
<!--&lt;!&ndash;                <img :src="'https://' + slotProps.option.cover" style="height: 30px"  alt="cover"/>&ndash;&gt;-->
<!--                <div>{{ `${slotProps.value.name}/${slotProps.option.nameZh}` }}</div>-->
<!--              </div>-->
<!--            </template>-->
<!--          </AutoComplete>-->
        </div>
        <div class="col-2">
          <Button icon="pi pi-plus-circle" rounded @click="addItem" />
        </div>
      </div>
    </panel>
    <panel>
      <template #header>
        <i class="pi pi-user-edit mr-2" style="font-size: 2rem" />
        <b>{{$t('Edit')}}</b>
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
          <Column field="role" :header="$t('Role')">
            <template #body="slotProps">
              {{slotProps.data.role.label}}
            </template>
          </Column>
          <Column field="person" :header="$t('Person')">
            <template #body="slotProps">
              {{slotProps.data.person.label}}
            </template>
          </Column>
          <Column field="action" :header="$t('Action')">
            <template #body="slotProps">
              <i v-if="slotProps.data.action === META.ACTION.INSERT" class="pi pi-true-icon pi-check-circle"></i>
              <i v-if="slotProps.data.action === META.ACTION.REAL_DELETE" class="pi pi-false-icon pi-times-circle"></i>
            </template>
          </Column>
        </DataTable>
        <ContextMenu :model="menuModel" ref="cm" />
      </div>
      <div v-else>
        <span class="emptyInfo">{{ $t('NoPerson') }}</span>
      </div>
    </panel>
    <div class="text-end mt-3 mb-2">
      <Button :label="$t('Clear')" icon="pi pi-trash" class="p-button-danger mr-4"
                @click="clear" :disabled="editBlock" />
      <Button :label="$t('Cancel')" icon="pi pi-times" class="mr-4"
                @click="cancelEdit" :disabled="editBlock" />
      <Button :label="$t('Update')" icon="pi pi-save" class="p-button-success mr-4"
                @click="submit" :disabled="editBlock" />
    </div>
  </BlockUI>
</template>

<style scoped>

</style>