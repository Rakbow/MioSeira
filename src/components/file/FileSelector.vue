<template>
  <div class="entity-selector">
    <BlockUI :blocked="param.loading">
      <IconField>
        <InputIcon class="pi pi-search" v-if="!param.keyword"/>
        <InputText size="large" v-model="param.keyword" @keyup.enter="search"/>
        <InputIcon class="pi pi-times-circle" @click="clearSearch" v-if="param.keyword"/>
      </IconField>
    </BlockUI>
    <DataView :value="param.data">
      <template #empty>
        <span>{{ t('NoSearchResult') }}</span>
      </template>
      <template #list="{items}">
        <div v-if="!param.loading" v-for="(entity, index) in items" :key="index">
          <div class="related-entity">
            <div class="related-entity-thumb">
              <div style="width: 2.5rem;height: 2.5rem" v-html="getIcon(entity.name).svg"/>
            </div>
            <div class="related-entity-info">
              {{ entity.name }}
              <small :title="entity.size">
                {{ entity.size }}
              </small>
            </div>
            <div class="related-entity-role">
              <Button v-if="!entity.isPicked" text @click="select(entity)">
                <template #icon>
                  <RIcon name="add_box" />
                </template>
              </Button>
              <Button v-else text disabled severity="info">
                <template #icon>
                  <RIcon name="check_box" />
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div v-if="param.loading" v-for="(index) in param.size" :key="index">
          <div class="related-entity">
            <div class="related-entity-thumb">
              <Skeleton size="2.5rem"/>
            </div>
            <div class="related-entity-info">
              <Skeleton width="30rem" class="mt-2" height="1.5rem"/>
              <Skeleton width="20rem" class="mt-1"/>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <BlockUI :blocked="param.loading">
          <Paginator v-model:first="param.first" :rows="param.size" :totalRecords="param.total"
                     @page="page($event)" :alwaysShow="param.total !== 0">
            <template #start>
              search in {{ param.time }}s
            </template>
            <template #end>
              {{ param.total }} items
            </template>
          </Paginator>
        </BlockUI>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, defineProps} from "vue";
import {API, Axios} from "@/api";
import { getIcon } from 'material-file-icons';
import {useI18n} from "vue-i18n";
import {EntitySelectorParam} from "@/service/entityService";

const emit = defineEmits(['pick']);

onMounted(() => {
  pickedFiles.value = props.entries;
  load();
  param.value.initFirst();
});

const props = defineProps({
  entries: {
    type: Array,
    required: true,
    default: () => ([])
  },
  multiSelect: {
    type: Boolean,
    required: false,
    default: true
  },
});


const {t} = useI18n();
const pickedFiles = ref([]);
const param = ref<EntitySelectorParam>(new EntitySelectorParam());

const select = (entity) => {
  entity.isPicked = true;
  pickedFiles.value.push(entity);
  emit('pick', entity);
}

const page = (ev) => {
  param.value.page = ev.page + 1;
  load();
}

const search = () => {
  param.value.initPage();
  load();
}
const clearSearch = () => {
  param.value.initPage();
  param.value.keyword = '';
  load();
}

const load = async () => {
  param.value.load();
  param.value.handleKeyword();
  const res = await Axios.post(API.FILE_SEARCH, param.value);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.data = markPickedFiles();
  param.value.endLoad();
};

const markPickedFiles = () => {
  return param.value.data.map(entry => {
    const picked = pickedFiles.value
        .some(f => f.id === entry.id);
    if (picked) {
      return {...entry, isPicked: true};
    }
    return entry;
  });
}
</script>

<style lang="scss" scoped>
@use "entity-global";
</style>