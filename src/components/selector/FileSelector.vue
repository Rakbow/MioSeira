<template>
  <div class="card">
    <BlockUI :blocked="loading">
      <IconField class="mt-2">
        <InputIcon class="pi pi-search" v-if="!queryParam.keyword"/>
        <InputText class="w-full" v-model="queryParam.keyword" @keyup.enter="search"/>
        <InputIcon class="pi pi-times-circle" @click="clearSearch" v-if="queryParam.keyword"/>
      </IconField>
    </BlockUI>
    <DataView class="mt-2" :value="searchResult.data" lazy paginator @page="page($event)"
              :rows="queryParam.size" :totalRecords="searchResult.total">
      <template #empty>
        <span class="empty-search-result">
            {{ $t('NoSearchResult') }}
        </span>
      </template>
      <template #list="slotProps">
        <div v-if="!loading" v-for="(file, index) in slotProps.items" :key="index">
          <div class="grid entity-search-result-block">
            <div class="col-fixed p-1" style="width: 45px">
              <div v-html="getIcon(file.name).svg"/>
            </div>
            <div class="col p-1">
              {{ file.name }}
              <small style="color: gray" class="text-sm text-overflow-hidden-one">
                <span>{{ file.size }}</span>
              </small>
            </div>
            <div class="col-1 flex align-items-center justify-content-center" style="width: 35px">
              <Button v-if="!file.isPicked" text @click="select(file)">
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
            <div class="col ml-1">
              <Skeleton size="35px"/>
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
import {ref, onMounted, defineProps, onBeforeMount} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {META} from "@/config/Web_Const";
import {API} from "@/config/Web_Helper_Strs";
import {inject} from "vue";
import {PublicHelper} from "@/toolkit/publicHelper";
import { getIcon } from 'material-file-icons';

onBeforeMount(() => {
});

onMounted(() => {
  pickedFiles.value = props.entries;
  loadFiles();
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
const emit = defineEmits(['pick']);

const pickedFiles = ref([]);
const dialogRef = inject('dialogRef');
const loading = ref(false);
const queryParam = ref({
  searchType: props.type,
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

const select = (item) => {
  item.isPicked = true;
  pickedFiles.value.push(item);
  emit('pick', item);
  // if (!props.multiSelect) close()
}

const page = (ev) => {
  queryParam.value.page = ev.page + 1;
  loadFiles();
}

const search = (ev) => {
  queryParam.value.page = 1;
  loadFiles();
}
const clearSearch = () => {
  queryParam.value.page = 1;
  queryParam.value.keyword = '';
  loadFiles();
}

const loadFiles = async () => {
  loading.value = true;
  searchResult.value.data = Array.from({length: 7});
  queryParam.value.keywords = PublicHelper.splitAndTrim(queryParam.value.keyword);
  const res = await axios.post(API.FILE_SEARCH, queryParam.value);
  if (res.state === axios.SUCCESS) {
    searchResult.value.total = res.data.total;
    searchResult.value.data = res.data.data;
    searchResult.value.time = res.data.searchTime;
  } else {
    searchResult.value.data = [];
  }
  searchResult.value.data = markPickedFiles();
  loading.value = false;
};

const markPickedFiles = () => {
  return searchResult.value.data.map(entry => {
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
@use "@/assets/entity-global";

.p-button {
  padding-top: 0;
  padding-bottom: 0;
}

</style>