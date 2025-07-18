<template>
  <div :class="`${prefix}`">
    <div :class="`${prefix}-main`">
      <div :class="`${prefix}-title`">
        <h1 style="display: inline;">{{ entry.name }}</h1>
        <span v-if="entry.type.value === $const.ENTRY_TYPE.PRODUCT">({{ entry.subType.label }})</span>
        <span v-else>({{ entry.type.label }})</span>
        <div v-if="entry.subType.value === $const.ENTRY_SUB_TYPE.MAIN_SERIES">
          <span>{{ entry.nameEn }}</span><br>
          <span>{{ entry.nameZh }}</span><br>
        </div>
      </div>
      <template v-if="entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES">
        <div :class="`${prefix}-entry`">
          <div :class="`${prefix}-entry-summary`">
            <div :class="`${prefix}-entry-cover`">
              <img :src="cover" alt="cover"/>
            </div>
            <div :class="`${prefix}-entry-info`">
              <Info :entry="entry"/>
              <div :class="`${prefix}-entry-actions`">
                <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked"/>
                <div style="right: 0" v-permission>
                  <StatusEditor :status="entry.status"/>
                  <RButton @click="loadEditor(entry)" action="update"/>
                </div>
              </div>
            </div>
          </div>
          <div :class="`${prefix}-entry-content`">
            <DetailPad :text="entry.detail"/>
            <RelatedPersons v-if="entry.type.value === $const.ENTRY_TYPE.PRODUCT"/>
            <RelatedItems/>
          </div>
        </div>
      </template>
      <template v-else>
        <SubProductInfo/>
      </template>
    </div>
    <div :class="`${prefix}-side`">
      <RelationGroup v-if="entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES"/>
      <TrafficInfo :info="pageInfo" :addedTime="entry.addedTime" :editedTime="entry.editedTime"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/modules/user";
import {loadEditor} from "@/service/entryService";
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, provide, ref} from "vue";

const prefix = 'entity-detail';

const Info = defineAsyncComponent(() => import('@/views/detail/info/EntryDetailInfo.vue'));
const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));
const StatusEditor = defineAsyncComponent(() => import('@/components/common/StatusEditor.vue'));
const DetailPad = defineAsyncComponent(() => import('@/components/common/DetailPad.vue'));
const Like = defineAsyncComponent(() => import('@/components/common/EntityLike.vue'));
const RelatedPersons = defineAsyncComponent(() => import('@/components/related/RelatedPersons.vue'));
const RelatedItems = defineAsyncComponent(() => import('@/components/item/RelatedItems.vue'));
const SubProductInfo = defineAsyncComponent(() => import('@/components/entry/SubProductInfo.vue'));
const RelationGroup = defineAsyncComponent(() => import('@/components/related/RelationGroup.vue'));

const meta = ref<any>();
const router = useRouter();
const userStore = useUserStore();
const entry = ref<any>();
const pageInfo = ref<any>();
const cover = ref();
const {proxy} = getCurrentInstance()!;

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  entry.value = meta.value.info.entry;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
  provide('entity', {type: proxy!.$const.ENTITY.ENTRY, id: entry.value.id, subType: entry.value.type.value} as Entity);
});
</script>

<style lang="scss" scoped>
</style>