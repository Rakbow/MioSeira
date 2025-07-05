<script setup lang="ts">
import {computed, defineAsyncComponent, defineProps, getCurrentInstance, onMounted, ref} from 'vue';
import {useDialog} from "primevue/usedialog";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";

const Edit = defineAsyncComponent(() => import('@/components/common/EntityEditButton.vue'));
const manager = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesManager.vue'));

const {t} = useI18n();
const dialog = useDialog();
const personnel = ref<PersonnelGroup[]>([]);
const loading = ref(false);
const { proxy } = getCurrentInstance();

onMounted(() => {
  load()
});

const props = defineProps({
  type: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  subType: {
    type: Number,
    required: true
  }
});

const openEditDialog = () => {
  dialog.open(manager, {
    props: {
      header: `${t('RelatedEntry')}-${t('Edit')}`,
      style: {
        width: '90rem',
      },
      modal: true,
      closable: true
    },
    data: {
      entityType: props.type,
      entityId: props.id,
      entitySubType: props.subType,
      type: proxy.$const.ENTITY.ENTRY,
      subTypes: [proxy.$const.ENTRY_TYPE.PERSON]
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
  const res = await Axios.post(API.RELATION_PERSONNEL, {
    entityType: props.type,
    entityId: props.id
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
      <div class="person-table">
        <Edit :func="openEditDialog" icon="person_edit"/>
        <table v-if="personnel.length">
          <tbody>
          <tr v-for="item in visibleRows" :key="item.role.label">
            <td><span>{{ item.role.label }}</span></td>
            <td>
              <template v-for="(chunk) in chunkArray((item as any).persons, 10)">
                <div>
                  <template v-for="(person, index) in chunk">
                    <router-link :to="`${API.ENTRY_DETAIL_PATH}/${(person as any).id}`">
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
      color: g.$label;
      white-space: nowrap;
      @extend .small-font
    }
  }
}
</style>