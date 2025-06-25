<script setup lang="ts">
import {computed, defineAsyncComponent, onBeforeMount, onMounted, ref} from 'vue';
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo, META, QueryParams} from "@/config/Web_Const";
import {groupPersonnel, PersonnelGroup} from "@/logic/relationService";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
const Edit = defineAsyncComponent(() => import('@/components/common/EntityEditButton.vue'));
const manager = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesManager.vue'));

const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialog = useDialog();
const personnel = ref<PersonnelGroup[]>([]);
const loading = ref(false);
const queryParams = ref<QueryParams>(new QueryParams());

onMounted(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
  initQueryParam();
  getPersonnel()
});

const initQueryParam = () => {
  queryParams.value = {
    first: 0,
    rows: 0,
    sortField: null,
    sortOrder: null,
    filters: {
      entityType: {value: entityInfo.value?.type},
      entityId: {value: entityInfo.value?.id},
      relatedGroup: {value: META.RELATION_RELATED_GROUP.PERSON}
    }
  };
}

const openEditDialog = () => {
  dialog.open(manager, {
    props: {
      header: `${t('RelatedEntry')}-${t('Edit')}`,
      style: {
        width: '900px',
      },
      modal: true,
      closable: true
    },
    data: {
      relatedGroup: META.RELATION_RELATED_GROUP.PERSON
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
  const res = await axios.post(API.RELATION_LIST, queryParams.value);
  if (res.state === axios.SUCCESS)
    personnel.value = groupPersonnel(res.data.data);
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
        <b>{{ t('Persons') }}</b>
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
                      <router-link :to="`${API.ENTRY_DETAIL_PATH}/${person.value}`">
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
            <span v-if="isCollapsed">{{t('Expand')}}&nbsp;<i class="pi pi-sort-down-fill" style="font-size: 11px" /></span>
            <span v-else>{{t('Collapse')}}&nbsp;<i class="pi pi-sort-up-fill" style="font-size: 11px" /></span>
          </Button>
        </div>
        <div v-else>
          <span class="emptyInfo"><em>{{ t('NoPerson') }}</em></span>
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