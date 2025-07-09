<script setup lang="ts">
import {computed, defineAsyncComponent, getCurrentInstance, inject, onMounted, ref} from 'vue';
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {bs} from '@/service/baseService';
import {useUserStore} from "@/store/modules/user";

const manager = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesManager.vue'));

const {t} = useI18n();
const personnel = ref<PersonnelGroup[]>([]);
const loading = ref(false);
const { proxy } = getCurrentInstance()!;
const entity = inject<Entity>('entity');
const userStore = useUserStore();

onMounted(() => {
  load()
});

const openEditDialog = () => {
  bs!.dialog.open(manager, {
    props: {
      header: `${t('RelatedEntry')}-${t('Edit')}`,
      style: {
        width: '90rem',
      },
      modal: true,
      closable: true
    },
    data: {
      entityType: entity!.type,
      entityId: entity!.id,
      entitySubType: entity!.subType,
      type: proxy!.$const.ENTITY.ENTRY,
      subTypes: [proxy!.$const.ENTRY_TYPE.PERSON]
    },
    onClose: (options: any) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          load();
        }
      }
    }
  });
}

const load = async () => {
  loading.value = true;
  const res = await Axios.post(API.RELATION.PERSONNEL, {
    entityType: entity!.type,
    entityId: entity!.id
  });
  if (res.success())
    personnel.value = res.data;
  loading.value = false;
}

const chunkArray = (array: [], chunkSize: number) => {
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
      <div class="entity-fieldset-actions" v-if="userStore.user && userStore.user.type > 1">
        <RButton @click="openEditDialog" icon="person_edit" tip="Edit" severity="info"/>
      </div>
      <div class="person-table">
        <table v-if="personnel.length">
          <tbody>
          <tr v-for="item in visibleRows" :key="item.role.label">
            <td><span>{{ item.role.label }}</span></td>
            <td>
              <template v-for="(chunk) in chunkArray((item as any).persons, 10)">
                <div>
                  <template v-for="(person, index) in chunk">
                    <router-link :to="`${$api.ENTRY.DETAIL_PATH}/${(person as any).id}`">
                      <span>{{ (person as any).name }}</span>
                    </router-link>
                    <span v-if="(person as any).remark">&nbsp;({{ (person as any).remark }})</span>
                    <span v-if="index < chunk.length - 1">, </span>
                  </template>
                </div>
              </template>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else>
          <span class="empty-search-result">{{ t('NoPerson') }}</span>
        </div>
        <Button v-if="personnel.length > maxRows" @click="toggleCollapse" class="p-button-link" size="small">
          <span v-if="isCollapsed">{{ t('Expand') }}&nbsp;<i class="pi pi-sort-down-fill"/></span>
          <span v-else>{{ t('Collapse') }}&nbsp;<i class="pi pi-sort-up-fill"/></span>
        </Button>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<style scoped lang="scss">
@use '@/styles/general' as g;

.person-table {
  position: relative !important;
  margin-left: .5rem;
  margin-top: .25rem;

  span {
    font-size: 1.1rem;
  }

  td {
    padding-left: .6rem;
    padding-right: .6rem;
    font-size: 1.1rem;
    vertical-align: top;

    > div {
      display: block;
    }

    > span {
      color: var(--r-steel-500);
      white-space: nowrap;
      @extend .small-font
    }
  }
}
</style>