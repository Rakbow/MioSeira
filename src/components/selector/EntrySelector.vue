<template>
  <div class="card">
    <BlockUI :blocked="loading">
      <SelectButton v-if="props.all" class="w-full" size="small" v-model="selectEntityType"
                    :options="META.ENTRY_TYPE_SET" @change="switchEntryType($event)"
                    optionLabel="value" dataKey="value" ariaLabelledby="custom" optionDisabled="disabled">
        <template #option="slotProps">
          <span class="material-symbols-outlined"
                v-tooltip.bottom="{value: t(slotProps.option.label), class: 'short-tooltip'}">
            {{ slotProps.option.icon }}
          </span>
        </template>
      </SelectButton>
      <IconField class="mt-2">
        <InputIcon class="pi pi-search" v-if="!queryParam.keyword"/>
        <InputText class="w-full" v-model="queryParam.keyword" @keyup.enter="search"/>
        <InputIcon class="pi pi-times-circle" @click="clearSearch" v-if="queryParam.keyword"/>
      </IconField>
    </BlockUI>
    <DataView ref="dt" class="mt-2" :value="searchResult.data" lazy paginator @page="page($event)"
              :rows="queryParam.size" :totalRecords="searchResult.total">
      <template #empty>
        <span class="empty-search-result">
            {{ t('NoSearchResult') }}
        </span>
      </template>
      <template #list="slotProps">
        <div v-if="!loading" v-for="(entry, index) in slotProps.items" :key="index">
          <div class="grid entity-search-result-block">
            <div class="col-fixed p-1" style="width: 45px">
              <div class="entry-thumb">
                <img role="presentation" :alt="entry.name" :src="entry.thumb"/>
              </div>
            </div>
            <div class="col p-1">
              <a :href="`${API.ENTRY_DETAIL_PATH}/${entry.id}`" class="text-overflow-hidden-one"
                 :title="entry.name">{{ entry.name }}</a>
              <!--              <div>{{ entry.name }}</div>-->
              <small style="color: gray" class="text-xs text-overflow-hidden-one" :title="(entry as any).subName">
                <span v-if="entry.info">({{ entry.info }})&nbsp;</span>
                <span>{{ (entry as any).subName }}</span>
              </small>
            </div>
            <div class="col-1 flex align-items-center justify-content-center" style="width: 35px">
              <Button v-if="!entry.isPicked || type === META.ENTRY_TYPE.PERSON" text @click="select(entry)">
                <template #icon>
                  <span class="material-symbols-outlined">add_box</span>
                </template>
              </Button>
              <Button v-else text disabled severity="info">
                <template #icon>
                  <span class="material-symbols-outlined">check_box</span>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div v-if="loading" v-for="(index) in 7" :key="index">
          <div class="grid entity-search-result-block">
            <div class="col ml-1" style="height: 45px;max-width: 45px">
              <Skeleton size="34px"/>
            </div>
            <div class="col-9">
              <Skeleton width="10rem"/>
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
import {PublicHelper} from "@/toolkit/publicHelper";
import {useI18n} from "vue-i18n";

onMounted(() => {
  pickedEntries.value = props.entries;
  getEntries();
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

const pickedEntries = ref([]);
const dt = ref();
const {t} = useI18n();
const dialogRef = inject('dialogRef');
const selectEntityType = ref();
const loading = ref(false);
const queryParam = ref({
  type: props.type,
  keyword: "",
  keywords: [],
  page: 0,
  size: 7
})
const searchResult = ref({
  total: 0,
  time: 0,
  data: []
});

const switchEntryType = (ev) => {
  if (ev.value === null)
    selectEntityType.value = META.ENTRY_TYPE_SET[0];
  queryParam.value.type = parseInt(selectEntityType.value.value);
  getEntries();
}

const select = (entry) => {
  entry.isPicked = true;
  pickedEntries.value.push(entry);
  emit('pick', entry);
}

const page = (ev) => {
  queryParam.value.page = ev.page + 1;
  getEntries();
}

const search = () => {
  console.log(dt.value.first);
  queryParam.value.page = 1;
  getEntries();
}
const clearSearch = () => {
  queryParam.value.page = 1;
  queryParam.value.keyword = '';
  getEntries();
}

const getEntries = async () => {
  loading.value = true;
  searchResult.value.data = Array.from({length: 7});
  queryParam.value.keywords = PublicHelper.splitAndTrim(queryParam.value.keyword);
  const res = await axios.post(API.ENTRY_SEARCH, queryParam.value);
  if (res.state === axios.SUCCESS) {
    searchResult.value.total = res.data.total;
    searchResult.value.data = res.data.data;
    searchResult.value.time = res.data.searchTime;
  } else {
    searchResult.value.data = [];
  }
  searchResult.value.data = markPickedEntries();
  loading.value = false;
};

const markPickedEntries = () => {
  return searchResult.value.data.map(entry => {
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

.p-button {
  padding-top: 0;
  padding-bottom: 0;
}

</style>