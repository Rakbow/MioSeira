<script setup>
import {onMounted, ref, inject} from "vue";
import {PublicHelper} from '@/utils/publicHelper';
import {AxiosHelper} from '@/utils/axiosHelper';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs';
import { useRoute } from 'vue-router';

const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const editPersonnel = ref([]);
const roleOption = ref([]);
// const emit = defineEmits(['update']);
const isUpdate = ref(false);
const route = useRoute();

onMounted(() => {
  editPersonnel.value = dialogRef.value.data.editPersonnel;
  roleOption.value = dialogRef.value.data.roleOption;
  getEntityInfo();
});

const entityType = ref();
const entityId = ref();
const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}
const editBlock = ref(false);
</script>

<template>
  <BlockUI :blocked="editBlock">
    <panel>
      <template #header>
        <i class="pi pi-user-plus mr-2" style="font-size: 2rem" />
        <b>{{$const.Add}}</b>
      </template>
      <div class="grid">
        <div class="col-3">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-tag" />
            </span>
            <span class="p-inputgroup-addon">
                <Checkbox v-model="item.main" :binary="true" :trueValue="1" :falseValue="0" />
            </span>
            <Dropdown v-model="item.role" :options="roleOption" optionLabel="label" filter
                        optionValue="value" :placeholder="$const.Role" />
          </div>
        </div>
      </div>
    </panel>


  </BlockUI>
</template>

<style scoped>

</style>