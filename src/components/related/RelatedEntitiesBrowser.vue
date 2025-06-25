<template>
  <div class="card">
    <DataView class="mt-2" :value="relatedEntities" lazy paginator @page="page($event)"
              :rows="queryParams.rows" :first="queryParams.first" :totalRecords="totalRecords">
      <template #empty>
        <span class="empty-search-result">
            {{ t('NoSearchResult') }}
        </span>
      </template>
      <template #list="slotProps">
        <div v-if="!loading" v-for="(entity, index) in slotProps.items" :key="index">
          <div class="grid entity-search-result-block">
            <div class="col-fixed p-1" style="width: 45px">
              <div class="entry-thumb">
                <img role="presentation" :alt="entity.target.label" :src="entity.thumb"/>
              </div>
            </div>
            <div class="col p-1">
              <a :href="`${API.ENTRY_DETAIL_PATH}/${entity.target.value}`">{{ entity.target.label }}</a><br>
              <small style="color: gray" class="text-xs">
<!--                <span v-if="entity.info">({{ entity.info }})&nbsp;</span>-->
                <span>{{ entity.subName }}</span>
              </small>
            </div>
            <div class="flex align-items-center justify-content-center" style="width: 100px">
              <Tag :value="entity.role.label"/>
            </div>
          </div>
        </div>
        <div v-if="loading" v-for="(index) in 5" :key="index">
          <div class="grid entity-search-result-block">
            <div class="col-fixed p-1" style="width: 45px">
              <Skeleton size="35px"/>
            </div>
            <div class="col p-1">
              <Skeleton class="mb-1" width="10rem"/>
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
import {ref, onMounted} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {API} from "@/config/Web_Helper_Strs";
import {inject} from "vue";
import {META, QueryParams} from "@/config/Web_Const";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const dialogRef = inject('dialogRef');
const relatedEntities = ref([]);
const totalRecords = ref(0);
const loading = ref(false);
const queryParams = ref<QueryParams>(new QueryParams());

onMounted(() => {
  initQueryParam();
  getRelatedEntities();
});

const initQueryParam = () => {
  queryParams.value = {
    first: 0,
    rows: 5,
    sortField: null,
    sortOrder: null,
    filters: {
      entityType: {value: dialogRef.value.data.entityType},
      entityId: {value: dialogRef.value.data.entityId},
      relatedGroup: {value: dialogRef.value.data.relatedGroup}
    }
  };
}

const page = (ev) => {
  queryParams.value.first = ev.first;
  queryParams.value.rows = ev.rows;
  getRelatedEntities();
}

const getRelatedEntities = async () => {
  loading.value = true;
  relatedEntities.value = Array.from({length: 5});
  const res = await axios.post(API.RELATION_LIST, queryParams.value);
  if (res.state === axios.SUCCESS) {
    totalRecords.value = res.data.total;
    relatedEntities.value = res.data.data;
  }
  loading.value = false;
};
</script>

<style lang="scss" scoped>
@use "@/assets/entity-global";
</style>