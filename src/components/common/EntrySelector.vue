<template>
  <div class="card">
    <!--      <SelectButton v-model="selectEntityType" :options="META.ENTITY_ICON_SET" @change="switchEntityType($event)"-->
    <!--                    optionLabel="value" dataKey="value" ariaLabelledby="custom" optionDisabled="disabled">-->
    <!--        <template #option="slotProps">-->
    <!--          <i :class="slotProps.option.icon"/>-->
    <!--        </template>-->
    <!--      </SelectButton>-->
    <BlockUI :blocked="loading">
      <IconField>
        <InputIcon class="pi pi-search" v-if="!queryParam.param.keyword"/>
        <InputText class="w-full" v-model="queryParam.param.keyword" @keyup.enter="search"/>
        <InputIcon class="pi pi-times-circle" @click="clearSearch" v-if="queryParam.param.keyword"/>
      </IconField>
    </BlockUI>
    <DataView class="mt-2" :value="entries" lazy paginator @page="page($event)"
              :rows="queryParam.param.row" :first="queryParam.param.first" :totalRecords="totalRecords">
      <template #empty>
        <span class="empty-search-result">
            {{ $t('NoSearchResult') }}
        </span>
      </template>
      <template #list="slotProps">
        <div v-if="!loading" v-for="(entry, index) in slotProps.items" :key="index">
          <div class="grid entity-search-result-block">
            <div class="col ml-1">
              <div class="entry-thumb-50">
                <img role="presentation" :alt="entry.name" :src="entry.cover"/>
              </div>
            </div>
            <div class="col-9">
              <div class="mt-1">{{ entry.name }}</div>
              <small style="color: gray" class="text-xs">
                <span v-if="entry.info">({{ entry.info }})&nbsp;</span>
                <span>{{ entry.subName }}</span>
              </small>
            </div>
            <div class="col flex align-items-center justify-content-center">
              <Button v-if="!entry.isPicked" text @click="select(entry)">
                <template #icon>
                  <span class="material-symbols-outlined">add_box</span>
                </template>
              </Button>
              <span v-else class="material-symbols-outlined">check_box</span>
            </div>
          </div>
        </div>
        <div v-if="loading" v-for="(index) in 5" :key="index">
          <div class="grid entity-search-result-block">
            <div class="col ml-1">
              <Skeleton size="50px"/>
            </div>
            <div class="col-9">
              <Skeleton class="mt-1 mb-2" width="10rem"/>
              <Skeleton width="15rem"/>
            </div>
            <div class="col flex align-items-center justify-content-center"/>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, defineProps} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {META} from "@/config/Web_Const";
import {API} from "@/config/Web_Helper_Strs";
import {inject} from "vue";

onMounted(() => {
  pickedEntries.value = props.entries;
  getEntries();
});

const props = defineProps({
  type: {
    type: Number,
    required: true
  },
  entries: {
    type: Array,
    required: true,
    default: () => ([])
  },
});
const emit = defineEmits(['pick']);

const pickedEntries = ref([]);
const dialogRef = inject('dialogRef');
const selectEntityType = ref();
const entries = ref();
const totalRecords = ref(0);
const loading = ref(false);
const queryParam = ref({
  entrySearchType: props.type,
  param: {
    keyword: "",
    first: 0,
    row: 5
  }
})
const switchEntityType = (ev) => {
  if (ev.value === null)
    selectEntityType.value = META.ENTITY_ICON_SET[0];
  queryParam.value.entrySearchType = parseInt(selectEntityType.value.value);
  getEntries();
}

const select = (item) => {
  item.isPicked = true;
  pickedEntries.value.push(item);
  emit('pick', item);
}

const first = (value) => {
  queryParam.value.param.first = value;
  getEntries();
}

const page = (ev) => {
  queryParam.value.param.first = ev.first;
  queryParam.value.param.row = ev.rows;
  getEntries();
}

const search = (ev) => {
  queryParam.value.param.first = 0;
  getEntries();
}
const clearSearch = () => {
  queryParam.value.param.first = 0;
  queryParam.value.param.keyword = '';
  getEntries();
}

const getEntries = async () => {
  loading.value = true;
  entries.value = Array.from({length: 5});
  const res = await axios.post(API.SEARCH_ENTRIES, queryParam.value);
  if (res.state === axios.SUCCESS) {
    totalRecords.value = res.data.total;
    entries.value = res.data.data;
  } else {
    entries.value = [];
  }
  entries.value = markPickedEntries();
  loading.value = false;
};

const markPickedEntries = () => {
  return entries.value.map(entry => {
    const picked = pickedEntries.value
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