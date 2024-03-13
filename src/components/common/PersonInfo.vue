<script setup>
import {defineAsyncComponent, defineProps, getCurrentInstance, onBeforeMount, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/utils/publicHelper";
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {useRoute} from "vue-router";


const editor = defineAsyncComponent(() => import('@/components/common/PersonnelEditor.vue'));
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;

onBeforeMount(() => {
  personnel.value = props.personnel;
});

onMounted(() => {
  getEntityInfo();
});
const props = defineProps({
  personnel: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const entityType = ref();
const entityId = ref();
const personnel = ref({});
const editBlock = ref(false);

const openEditDialog = () => {
  dialog.open(editor, {
    props: {
      header: $const.Person,
      style: {
        width: '60vw',
      },
      breakpoints: {
        '960px': '60vw',
        '640px': '40vw'
      },
      modal: true,
      closable: false
    },
    data: {
      personnel: personnel.value.editPersonnel
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          getPersonnel();
        }
      }
    }
  });
}

const getPersonnel = async () => {
  editBlock.value = true;
  let param = {
    entityType: entityType.value,
    entityId: entityId.value
  }
  const res = await axios.post($api.GET_PERSONNEL, param);
  if(res.state === axios.SUCCESS)
    personnel.value = res.data;
  editBlock.value = false;
}

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}

</script>

<template>
  <BlockUI :blocked="editBlock">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-users"></i>
        <b>{{ $const.Persons }}</b>
      </template>
      <div class="relative">
        <div v-if="userStore.user">
          <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                  @click="openEditDialog" style="right: 5%"
                  v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}">
            <template #icon>
              <span class="material-symbols-outlined">edit_note</span>
            </template>
          </Button>
        </div>

        <div class="grid ml-4" v-if="personnel.personnel.length !== 0">
          <table class="table-borderless table-sm">
            <tbody class="detail-item-artists-table">
            <tr v-for="item in personnel.personnel">
              <td style="width:250px"><strong>{{ item.role.label }}</strong></td>
              <td v-for="(person, index) in item.persons" style="display:inline" class="a_with_underline">
                <router-link :to="'/db/person/' + person.value">
                  <span style="white-space: nowrap;">{{ person.label }}</span>
                </router-link>
                <span v-if="index < item.persons.length - 1">,</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <span class="emptyInfo"><em>{{ $const.NoPerson }}</em></span>
        </div>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<style scoped>

</style>