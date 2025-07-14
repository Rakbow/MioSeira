<template>
  <div class="entity-selector">
    <BlockUI :blocked="param.loading">
      <SelectButton v-if="props.all" class="w-full" size="small"
                    v-model="entryType" :options="$const.ENTRY_TYPE_SET" @change="switchEntryType($event)"
                    optionLabel="value" dataKey="value" ariaLabelledby="custom">
        <template #option="{option}">
          <RIcon :name="option.icon"/>
          <span style="font-size: 1.4rem">{{ t(option!.label) }}</span>
        </template>
      </SelectButton>
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
                       v-if="!entity.isPicked || type === $const.ENTRY_TYPE.PERSON"/>
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
import {ref, onMounted, defineProps, getCurrentInstance, onBeforeMount} from "vue";
import {META} from "@/config/Web_Const";
import {API, Axios} from "@/api";
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";

onBeforeMount(() => {
  param.value.initFilters({
    type: {value: null},
    keyword: {value: ''}
  });
  param.value.query.size = 7;
});

onMounted(() => {
  pickedEntries.value = props.entries;
  param.value.query.filters.type.value = props.type;
  load();
});

const props = defineProps({
  all: {
    type: Boolean,
    required: false,
    default: false
  },
  type: {
    type: Number,
    required: false,
    default: META.ENTRY_TYPE.PRODUCT
  },
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
const emit = defineEmits(['pick']);
const { proxy } = getCurrentInstance()!;
const {t} = useI18n();
const pickedEntries = ref<any[]>([]);
const entryType = ref();
const param = ref<EntitySearchParam>(new EntitySearchParam());

const switchEntryType = (ev: any) => {
  if (ev.value === null)
    entryType.value = proxy!.$const.ENTRY_TYPE_SET[0];
  param.value.query.filters.type.value = parseInt(entryType.value.value);
  load();
}

const select = (entity: any) => {
  entity.isPicked = true;
  pickedEntries.value!.push(entity);
  emit('pick', entity);
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
    const picked = pickedEntries.value!
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