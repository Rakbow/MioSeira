<script setup lang="ts">
import {defineAsyncComponent, defineProps, onBeforeMount, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/user.ts";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper.ts";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo} from "@/config/Web_Const";
import {groupPersonnel, PersonnelGroup} from "@/logic/personService";

const editor = defineAsyncComponent(() => import('@/components/common/PersonnelEditor.vue'));
const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const personnel = ref<PersonnelGroup[]>([]);
const editBlock = ref(false);

onBeforeMount(() => {
  personnel.value = groupPersonnel(props.personnel)
});

onMounted(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});
const props = defineProps({
  personnel: {
    type: Array,
    required: true,
  } as []
});


const openEditDialog = () => {
  // dialog.open(editor, {
  //   props: {
  //     header: t('Person'),
  //     style: {
  //       width: '60vw',
  //     },
  //     breakpoints: {
  //       '960px': '60vw',
  //       '640px': '40vw'
  //     },
  //     modal: true,
  //     closable: false
  //   },
  //   data: {
  //     personnel: personnel.value!.editPersonnel
  //   },
  //   onClose: (options) => {
  //     if (options.data !== undefined) {
  //       if (options.data.isUpdate) {
  //         getPersonnel();
  //       }
  //     }
  //   }
  // });
}

// const getPersonnel = async () => {
//   editBlock.value = true;
//   let param = {
//     entityType: entityType.value,
//     entityId: entityId.value
//   }
//   const res = await axios.post(API.GET_PERSONNEL, param);
//   if(res.state === axios.SUCCESS)
//     personnel.value = res.data;
//   editBlock.value = false;
// }

const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

</script>

<template>
  <BlockUI :blocked="editBlock" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-users"></i>
        <b>{{ $t('Persons') }}</b>
      </template>
      <div class="relative">
        <div v-if="userStore.user">
          <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                  @click="openEditDialog" style="right: 0"
                  v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}">
            <template #icon>
              <span class="material-symbols-outlined">edit_note</span>
            </template>
          </Button>
        </div>

        <div class="grid ml-4 mt-1" v-if="personnel.length !== 0">
          <table class="table-borderless table-sm">
            <tbody class="person-table">
            <tr v-for="item in personnel" :key="item.role.label">
              <td style="width:250px"><strong>{{ item.role.label }}</strong></td>
              <td class="a_with_underline">
                <template v-for="(chunk, chunkIndex) in chunkArray(item.persons, 5)" :key="chunkIndex">
                  <div style="display: block;">
                    <template v-for="(person, index) in chunk" :key="person.value">
                      <router-link :to="'/db/person/' + person.value">
                        <span style="white-space: nowrap;">{{ person.label }}</span>
                      </router-link>
                      <span v-if="index < chunk.length - 1">, </span>
                    </template>
                  </div>
                </template>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <span class="emptyInfo"><em>{{ $t('NoPerson') }}</em></span>
        </div>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<style scoped lang="scss">

@import "@/assets/entity-detail";

.person-table td {
  padding-bottom: 0;
  padding-top: 1px;
}

.person-table strong {
  color: #788990;
}
</style>