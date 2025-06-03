<script setup lang="ts">
import {computed, defineAsyncComponent, onBeforeMount, onMounted, ref} from 'vue';
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo, META} from "@/config/Web_Const";
import {groupPersonnel, PersonnelGroup} from "@/logic/relationService";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
const Edit = defineAsyncComponent(() => import('@/components/common/EntityEditButton.vue'));
const editor = defineAsyncComponent(() => import('@/components/related/RelationEditor.vue'));

const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialog = useDialog();
const personnel = ref<PersonnelGroup[]>([]);
const loading = ref(false);

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
  loading.value = true;
  let param = {
    direction: META.RELATION_RELATED_DIRECTION.POSITIVE,
    relatedGroup: META.RELATION_RELATED_GROUP.RELATED_PERSON,
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id
  }
  const res = await axios.post(API.GET_RELATED_ENTITY, param);
  if (res.state === axios.SUCCESS)
    personnel.value = groupPersonnel(res.data);
  loading.value = false;
}

const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

const maxRows = ref(10);// 最大显示行数
const isCollapsed = ref(true);// 折叠状态
// 可见行
const visibleRows = computed(() => {
  return isCollapsed.value ? personnel.value.slice(0, maxRows.value) : personnel.value;
});
// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

</script>

<template>
  <BlockUI :blocked="loading" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-users"/>
        <b>{{ $t('Persons') }}</b>
      </template>
      <div class="relative">
        <Edit :func="openEditDialog" icon="edit_note" />
        <div class="person-table" v-if="personnel.length">
          <table>
            <tbody class="person-table">
            <tr v-for="item in visibleRows" :key="item.role.label">
              <td><span>{{ item.role.label }}</span></td>
              <td>
                <template v-for="(chunk, chunkIndex) in chunkArray(item.entities, 10)" :key="chunkIndex">
                  <div style="display: block;">
                    <template v-for="(person, index) in chunk" :key="person.value">
                      <router-link :to="`${API.PERSON_DETAIL}/${person.value}`">
                        <span>{{ person.label }}</span>
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
          <Button v-if="personnel.length > maxRows" @click="toggleCollapse"
                  class="p-button-link" size="small" style="font-size: 11px">
            <span v-if="isCollapsed">{{$t('Expand')}}&nbsp;<i class="pi pi-sort-down-fill" style="font-size: 11px" /></span>
            <span v-else>{{$t('Collapse')}}&nbsp;<i class="pi pi-sort-up-fill" style="font-size: 11px" /></span>
          </Button>
          <!--          <DataTable ref="dt" :value="personnel" class="person-table-tmp"-->
          <!--                     :alwaysShowPaginator="!personnel.length"-->
          <!--                     paginator :rows="50" size="small" tableStyle="background-color: #788990"-->
          <!--                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink-->
          <!--                                 LastPageLink CurrentPageReport RowsPerPageDropdown"-->
          <!--                     currentPageReportTemplate="{first} to {last} of {totalRecords}">-->
          <!--            <Column :header="$t('Role')" style="vertical-align: top;padding: 3px 6px">-->
          <!--              <template #body="slotProps">-->
          <!--                <span class="small-font" style="color: #788990">{{ slotProps.data.role.label }}</span>-->
          <!--              </template>-->
          <!--            </Column>-->
          <!--            <Column style="font-size: 11px;padding: 3px 6px">-->
          <!--              <template #body="slotProps">-->
          <!--                <template v-for="(chunk, chunkIndex) in chunkArray(slotProps.data.entities, 10)" :key="chunkIndex">-->
          <!--                  <div style="display: block">-->
          <!--                    <template v-for="(person, index) in chunk" :key="person.value">-->
          <!--                      <router-link :to="'/db/person/' + person.value">-->
          <!--                        <span style="white-space: nowrap;">{{ person.label }}</span>-->
          <!--                      </router-link>-->
          <!--                      <span v-if="person.remark">&nbsp;({{ (person as any).remark }})</span>-->
          <!--                      <span v-if="index < chunk.length - 1">, </span>-->
          <!--                    </template>-->
          <!--                  </div>-->
          <!--                </template>-->
          <!--              </template>-->
          <!--            </Column>-->
          <!--          </DataTable>-->
        </div>
        <div v-else>
          <span class="emptyInfo"><em>{{ $t('NoPerson') }}</em></span>
        </div>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<style scoped lang="scss">
@use '@/assets/general' as g;

.person-table {
  margin-left: .5rem;
  margin-top: .25rem;
  td {
    padding-left: 6px;
    padding-right: 6px;
    font-size: 11px;
    vertical-align: top;
    > span {
      color: g.$label;
      white-space: nowrap;
      @extend .small-font
    }
  }
}
</style>