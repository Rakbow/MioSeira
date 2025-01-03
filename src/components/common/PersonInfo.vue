<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/user.ts";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper.ts";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo, META} from "@/config/Web_Const";
import {groupPersonnel, PersonnelGroup} from "@/logic/relationService";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";

const editor = defineAsyncComponent(() => import('@/components/common/RelationEditor.vue'));
const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const personnel = ref<PersonnelGroup[]>([]);
const editBlock = ref(false);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
  getPersonnel()
});

onMounted(() => {
});


const openEditDialog = () => {
  dialog.open(editor, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '900px',
      },
      modal: true,
      closable: true
    },
    data: {
      relatedGroup: META.RELATION_RELATED_GROUP.RELATED_PERSON,
      direction: META.RELATION_RELATED_DIRECTION.POSITIVE
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
    direction: META.RELATION_RELATED_DIRECTION.POSITIVE,
    relatedGroup: META.RELATION_RELATED_GROUP.RELATED_PERSON,
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id
  }
  const res = await axios.post(API.GET_RELATED_ENTITY, param);
  if (res.state === axios.SUCCESS)
    personnel.value = groupPersonnel(res.data);
  editBlock.value = false;
}

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
        <i class="pi pi-users"/>
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

        <div class="ml-2 mt-1" v-if="personnel.length !== 0">
          <table class="table-borderless">
            <tbody class="person-table">
            <tr v-for="item in personnel" :key="item.role.label">
              <td><span class="small-font" style="color: #788990;">{{ item.role.label }}</span></td>
              <td class="a_with_underline">
                <template v-for="(chunk, chunkIndex) in chunkArray(item.entities, 9)" :key="chunkIndex">
                  <div style="display: block;">
                    <template v-for="(person, index) in chunk" :key="person.value">
                      <router-link :to="'/db/person/' + person.value">
                        <span style="white-space: nowrap;">{{ person.label }}</span>
                      </router-link>
                      <span v-if="person.remark">&nbsp;({{ (person as any).remark }})</span>
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

.person-table td {
  padding-left: 6px;
  padding-right: 6px;
  font-size: 9pt;
}

.person-table strong {
  color: #788990;
}
</style>