<template>
  <div class="entity-selector">
    <BlockUI :blocked="param.loading">
      <SelectButton v-if="props.all" class="w-full" size="small" v-model="selectEntityType"
                    :options="META.ENTRY_TYPE_SET" @change="switchEntryType($event)"
                    optionLabel="value" dataKey="value" ariaLabelledby="custom" :optionDisabled="'disabled'">
        <template #option="{option}">
          <MaterialIcon :name="option.icon" v-tooltip.bottom="{value: t(option!.label), class: 'short-tooltip'}"/>
        </template>
      </SelectButton>
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
        <div v-if="!param.loading" v-for="(entity, index) in items as any[]" :key="index">
          <div class="related-entity">
            <div class="related-entity-thumb">
              <img role="presentation" :alt="entity.name" :src="entity.thumb"/>
            </div>
            <div class="related-entity-info">
              <a :href="`${API.ENTRY_DETAIL_PATH}/${entity.id}`" :title="entity.name">
                {{ entity.name }}
              </a>
              <small :title="entity.subName">
                {{ entity.subName }}
              </small>
            </div>

            <div class="related-entity-role">
              <Button v-if="!entity.isPicked || type === META.ENTRY_TYPE.PERSON" text @click="select(entity)">
                <template #icon>
                  <MaterialIcon name="add_box" />
                </template>
              </Button>
              <Button v-else text disabled severity="info">
                <template #icon>
                  <MaterialIcon name="check_box" />
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div v-if="param.loading" v-for="(index) in 7" :key="index">
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
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {META} from "@/config/Web_Const";
import {API} from "@/config/Web_Helper_Strs";
import {useI18n} from "vue-i18n";
import {EntitySelectorParam} from "@/logic/entityService";

onMounted(() => {
  pickedEntries.value = props.entries;
  load();
  param.value.initFirst();
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

const {t} = useI18n();
const pickedEntries = ref<any[]>([]);
const dt = ref();
const selectEntityType = ref();
const loading = ref(false);
const param = ref<EntitySelectorParam>(new EntitySelectorParam());

const switchEntryType = (ev: any) => {
  if (ev.value === null)
    selectEntityType.value = META.ENTRY_TYPE_SET[0];
  param.value.type = parseInt(selectEntityType.value.value);
  load();
}

const select = (entity: any) => {
  entity.isPicked = true;
  pickedEntries.value!.push(entity);
  emit('pick', entity);
}

const page = (ev: any) => {
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
  param.value.type = props.type;
  const res = await axios.post(API.ENTRY_SEARCH, param.value);
  if (res.state === axios.SUCCESS) {
    param.value.loadResult(res.data);
  }
  param.value.data = markPickedEntries();
  param.value.endLoad();
};

const markPickedEntries = () => {
  return param.value.data.map(entry => {
    const picked = pickedEntries.value!
        .some(pickedEntry => pickedEntry.id === entry.id && pickedEntry.type === entry.type);
    if (picked) {
      return {...entry, isPicked: true};
    }
    return entry;
  });
}
</script>

<style lang="scss" scoped>
@use "@/assets/entity-global";
</style>