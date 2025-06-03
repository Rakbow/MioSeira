<template>
  <div class="card">
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
            <div class="col-fixed p-1" style="width: 45px">
              <div class="entry-thumb">
                <img role="presentation" :alt="entry.name" :src="entry.cover"/>
              </div>
            </div>
            <div class="col p-1">
              <a :href="`/db/product/${entry.id}`">{{ entry.name }}</a><br>
              <small style="color: gray" class="text-xs">
<!--                <span v-if="entry.info">({{ entry.info }})&nbsp;</span>-->
                <span>{{ entry.subName }}</span>
              </small>
            </div>
<!--            <div class="col flex align-items-center justify-content-center">-->

<!--            </div>-->
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
<!--      <template #paginatorcontainer>-->
<!--        <Paginator v-model:first="queryParam.param.first" :rows="queryParam.param.row" :totalRecords="totalRecords">-->
<!--          <template #end="slotProps">-->
<!--            <span class="gray small-font">{{ totalRecords }} entries</span>-->
<!--          </template>-->
<!--        </Paginator>-->
<!--      </template>-->
    </DataView>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {API} from "@/config/Web_Helper_Strs";
import {inject} from "vue";
import {META} from "@/config/Web_Const";

onMounted(() => {
  queryParam.value.entityType = dialogRef.value.data.entityType;
  queryParam.value.entityId = dialogRef.value.data.entityId;
  queryParam.value.relatedGroup = dialogRef.value.data.relatedGroup;
  getEntries();
});

const dialogRef = inject('dialogRef');
const entries = ref();
const totalRecords = ref(0);
const loading = ref(false);
const queryParam = ref({
  relatedGroup: 0,
  entityType: 0,
  entityId: 0,
  direction: META.RELATION_RELATED_DIRECTION.POSITIVE,
  param: {
    keyword: "",
    first: 0,
    row: 5
  }
})

const page = (ev) => {
  queryParam.value.param.first = ev.first;
  queryParam.value.param.row = ev.rows;
  getEntries();
}

const getEntries = async () => {
  loading.value = true;
  entries.value = Array.from({length: 5});
  const res = await axios.post(API.GET_RELATED_ENTITIES, queryParam.value);
  if (res.state === axios.SUCCESS) {
    totalRecords.value = res.data.total;
    entries.value = res.data.data;
  } else {
    entries.value = [];
  }
  loading.value = false;
};
</script>

<style lang="scss" scoped>
@use "entity-global";
</style>