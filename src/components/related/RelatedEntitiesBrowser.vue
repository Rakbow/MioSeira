<template>
  <DataView :value="param.data" lazy paginator @page="page($event)"
            :rows="param.query.rows" :first="param.query.first" :totalRecords="param.total">
    <template #empty>
        <span class="empty-search-result">
            {{ t('NoSearchResult') }}
        </span>
    </template>
    <template #list="{items}">
      <div v-if="!param.loading" v-for="entity in items">
        <RelationEntity :entity="entity" :showRole="true"/>
      </div>
      <div v-if="param.loading" v-for="(index) in items" :key="index">
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
  </DataView>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeMount, defineAsyncComponent} from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {API} from "@/config/Web_Helper_Strs";
import {inject} from "vue";
import {useI18n} from "vue-i18n";
import {EntityManageParam} from "@/logic/entityService";

const RelationEntity = defineAsyncComponent(() => import('@/components/related/RelatedEntity.vue'));

const {t} = useI18n();
const dialogRef = inject<any>('dialogRef');
const param = ref(new EntityManageParam());

onBeforeMount(async () => {
  param.value.initPage(0, 7);
  param.value.initFilters({
    entityType: {value: dialogRef.value.data.entityType},
    entityId: {value: dialogRef.value.data.entityId},
    targetEntityType: {value: dialogRef.value.data.type},
    targetEntitySubTypes: {value: dialogRef.value.data.subTypes}
  });
})

onMounted(() => {
  param.value.load();
  load();
});

const page = (ev: any) => {
  param.value.initPage(ev.first, ev.rows);
  load();
}

const load = async () => {
  param.value.load();
  param.value.data = Array.from({length: param.value.query.rows});
  const res = await axios.post(API.RELATION_LIST, param.value.query);
  if (res.state === axios.SUCCESS) {
    param.value.total = res.data.total;
    param.value.data = res.data.data;
  }
  param.value.endLoad();
};
</script>

<style lang="scss" scoped>
</style>