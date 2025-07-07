<template>
  <div class="flex flex-wrap justify-content-center gap-3">
    <div class="entity-detail-main-col">
      <div class="entity-detail-header-title">
        <h1 style="display: inline;">{{ entry.name }}</h1>
        <span class="small-font" v-if="entry.type === $const.ENTRY_TYPE.PRODUCT">({{ (entry as any).subType.label }})</span>
        <span class="small-font" v-else>({{ entry.type.label }})</span>
        <div v-if="entry.subType.value === $const.ENTRY_SUB_TYPE.MAIN_SERIES">
          <span>{{ entry!.nameEn }}</span><br>
          <span>{{ entry!.nameZh }}</span><br>
        </div>
      </div>
      <div v-if="entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES" class="flex grid mx-2">
        <div class="col-4" style="width: 21rem">
          <div class="entity-image-cover-200">
            <img :src="cover" alt="main"/>
          </div>
          <div class="infobox-container">
            <Info :entry="entry"/>
            <div v-if="userStore.user && userStore.user.type > 1" class="flex justify-content-end">
              <Button class="p-button-link"
                      @click="loadEditor(entry)"
                      v-tooltip="{value: t('Edit'), class: 'short-tooltip'}">
                <template #icon>
                  <MaterialIcon name="edit_square"/>
                </template>
              </Button>
              <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked"/>
            </div>
          </div>
        </div>
        <div class="col py-0">
          <DetailPad v-if="entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES" :text="entry.detail"/>
          <RelatedPersons v-if="entry.type.value === $const.ENTRY_TYPE.PRODUCT
           && entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES"/>
          <RelatedItems v-if="entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES"/>
        </div>
      </div>
      <div class="m-3">
        <SubProductInfo v-if="entry.subType.value === $const.ENTRY_SUB_TYPE.MAIN_SERIES"/>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <RelationGroup />
      <TrafficInfo :info="pageInfo" :addedTime="entry.addedTime" :editedTime="entry.editedTime"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/styles/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {useRouter} from "vue-router";
import {useUserStore} from "@/store/modules/user";
import {loadEditor} from "@/service/entryService";
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, provide, ref} from "vue";

const {t} = useI18n();
const Info = defineAsyncComponent(() => import('@/views/detail/info/EntryDetailInfo.vue'));
const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));
const DetailPad = defineAsyncComponent(() => import('@/components/common/DetailPad.vue'));
const Like = defineAsyncComponent(() => import('@/components/common/EntityLike.vue'));
const RelatedItems = defineAsyncComponent(() => import('@/components/related/RelatedItems.vue'));
const RelatedPersons = defineAsyncComponent(() => import('@/components/related/RelatedPersons.vue'));
const SubProductInfo = defineAsyncComponent(() => import('@/components/special/SubProductInfo.vue'));
const RelationGroup = defineAsyncComponent(() => import('@/components/related/RelationGroup.vue'));

const meta = ref<any>();
const router = useRouter();
const userStore = useUserStore();
const entry = ref();
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