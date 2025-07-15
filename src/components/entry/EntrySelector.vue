<template>
  <div class="entity-selector">
    <BlockUI :blocked="param.loading">
      <EntryTypeSelector v-if="option.all" :disabled="false"
                         v-model="param.query.filters.type.value" @update="switchEntryType" />
      <IconField>
        <InputIcon class="pi pi-search" v-if="!param.query.filters.keyword.value"/>
        <InputText size="large" v-model="param.query.filters.keyword.value" @keyup.enter="search"/>
        <InputIcon class="pi pi-times-circle" @click="clearSearch" v-if="param.query.filters.keyword.value"/>
      </IconField>
    </BlockUI>
    <DataView :value="param.result.data">
      <template #empty>
        <span>{{ t('NoSearchResult') }}</span>
      </template>
      <template #list="{items}">
        <div v-if="!param.loading" v-for="(entity, index) in items as any[]" :key="index">
          <div class="related-entity">
            <div class="related-entity-thumb">
              <img role="presentation" :alt="entity.name" :src="entity.thumb"/>
            </div>
            <div class="related-entity-info">
              <a :href="`${$api.ENTRY.DETAIL_PATH}/${entity.id}`" :title="entity.name">
                {{ entity.name }}
              </a>
              <small :title="entity.subName">
                {{ entity.subName }}
              </small>
            </div>

            <div class="related-entity-role">
              <RButton @click="select(entity)" icon="add_box"
                       v-if="!entity.isPicked || option.type === $const.ENTRY_TYPE.PERSON"/>
              <RButton icon="check_box" severity="info"
                       v-else disabled/>
            </div>
          </div>
        </div>
        <div v-if="param.loading" v-for="() in param.query.size">
          <div class="related-entity">
            <div class="related-entity-thumb">
              <Skeleton size="3.5rem"/>
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
          <RPaginator v-model:page="param.query.page" v-model:size="param.query.size" alwaysShow
                      :total="param.result.total" @page="page($event)" :time="param.result.time"/>
        </BlockUI>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, inject, onBeforeMount, onMounted, ref} from "vue";
import {API, Axios} from "@/api";
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";

const EntryTypeSelector = defineAsyncComponent(() => import('@/components/entry/EntryTypeSelector.vue'));

const emit = defineEmits(['pick']);
const {t} = useI18n();
const param = ref<EntitySearchParam>(new EntitySearchParam());
const dialogRef = inject<any>('dialogRef');

const option = ref({
  all: false,
  type: null,
  multi: true,
  entries: <any>[]
})

const initParam = () => {
  if(dialogRef.value.data.all) {
    option.value.all = dialogRef.value.data.all;
  }
  if(dialogRef.value.data.type) {
    option.value.type = dialogRef.value.data.type;
    param.value.query.filters.type.value = dialogRef.value.data.type;
  }
  if(dialogRef.value.data.multi) {
    option.value.multi = dialogRef.value.data.multi;
  }
  if(dialogRef.value.data.entries) {
    option.value.entries = dialogRef.value.data.entries;
  }
}

onBeforeMount(() => {
  param.value.initFilters({
    type: {value: null},
    keyword: {value: ''}
  });
  param.value.query.size = 7;
  initParam();
});

onMounted(() => {
  load();
});

const switchEntryType = (value: any) => {
  param.value.query.filters.type.value = value;
  load();
}

const select = (entity: any) => {
  entity.isPicked = true;
  option.value.entries.push(entity);
  emit('pick', option.value.entries);
}

const page = (ev: any) => {
  param.value.initPage(ev.page + 1);
  load();
}

const search = () => {
  param.value.initPage();
  load();
}
const clearSearch = () => {
  param.value.initPage();
  param.value.query.filters.keyword.value = '';
  load();
}

const load = async () => {
  param.value.loading = true;
  const res = await Axios.post(API.ENTRY.SEARCH, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data)
  }
  param.value.result.data = markPickedEntries();
  param.value.loading = false;
};

const markPickedEntries = () => {
  return param.value.result.data.map(entry => {
    const picked = (option.value.entries as any[])
        .some(pickedEntry => pickedEntry.id === entry.id);
    if (picked) {
      return {...entry, isPicked: true};
    }
    return entry;
  });
}
</script>

<style lang="scss" scoped>
</style>