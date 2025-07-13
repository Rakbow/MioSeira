<template>
  <DataView :value="param.result.data" lazy paginator>
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
    <template #paginatorcontainer>
      <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                  :total="param.result.total" @page="page($event)" :time="param.result.time"/>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeMount, defineAsyncComponent} from "vue";
import {API, Axios} from "@/api";
import {inject} from "vue";
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";

const RelationEntity = defineAsyncComponent(() => import('@/components/related/RelatedEntity.vue'));

const {t} = useI18n();
const dialogRef = inject<any>('dialogRef');
const param = ref(new EntitySearchParam());

onBeforeMount(async () => {
  param.value.query.size = 7;
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
  param.value.initPage(ev.page + 1);
  load();
}

const load = async () => {
  param.value.load();
  param.value.data = Array.from({length: param.value.query.size});
  const res = await Axios.post(API.RELATION.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
  }
  param.value.endLoad();
};
</script>

<style lang="scss" scoped>
</style>