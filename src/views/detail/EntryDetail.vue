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
                      @click="loadEditor(entry, dialog)"
                      v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}">
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
          <RelatedPersons :type="$const.ENTITY.ENTRY" :id="entry.id" :subType="entry.type.value"
              v-if="entry.type.value === $const.ENTRY_TYPE.PRODUCT && entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES"/>
          <RelatedItems v-if="entry.subType.value !== $const.ENTRY_SUB_TYPE.MAIN_SERIES"/>
        </div>
      </div>
      <div class="m-3">
        <SubProductInfo v-if="entry.subType.value === $const.ENTRY_SUB_TYPE.MAIN_SERIES"/>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <RelationGroup :type="$const.ENTITY.ENTRY" :id="entry.id" :subType="entry.type.value" />
      <TrafficInfo :info="pageInfo" :addedTime="entry.addedTime" :editedTime="entry.editedTime"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/styles/entity-detail.scss';
import "@/styles/entity-global.scss";
import "@/styles/entry-detail.scss";
import '@/styles/entity-manager.scss';
import '@/styles/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {useRouter} from "vue-router";
import {useUserStore} from "@/store/modules/user";
import {useDialog} from "primevue/usedialog";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import RelatedPersons from "@/components/related/RelatedPersons.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import {loadEditor} from "@/logic/entryService";
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import SubProductInfo from "@/components/special/SubProductInfo.vue";
import RelatedItems from "@/components/related/RelatedItems.vue";
import Like from "@/components/common/EntityLike.vue";
import RelationGroup from "@/components/related/RelationGroup.vue";

const {t} = useI18n();
defineAsyncComponent(() => import('@/components/image/EntryImageEditor.vue'));
const Info = defineAsyncComponent(() => import('@/views/detail/info/EntryDetailInfo.vue'));

const meta = ref<any>();
const router = useRouter();
const userStore = useUserStore();
const dialog = useDialog();

const entry = ref();
const pageInfo = ref<any>();
const cover = ref();

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  entry.value = meta.value.info.entry;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
});
</script>

<style lang="scss" scoped>
</style>