<template>
  <div id="main" class="flex flex-wrap justify-content-center gap-3">
    <div class="entity-detail-main-col">
      <div class="entity-detail-header-title">
        <h1 :title="item.name">{{ item.name }}</h1>
        <div v-for="alias in item.aliases">
          <span>{{ alias }}</span><br>
        </div>
      </div>
      <div class="grid border-round-sm m-3">
        <div class="col-4" style="width: 20rem;height: 20rem;text-align: center;vertical-align: middle;">
          <img :src="cover.toString()" alt="main"/>
        </div>
        <div class="col card relative" style="background: #2f364f;">
          <Button v-if="userStore.user && userStore.user.type > 1" class="p-button-link absolute top-0"
                  @click="loadEditor(item)" style="right: 8%"
                  v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}">
            <template #icon>
              <MaterialIcon name="edit_note"/>
            </template>
          </Button>
          <ItemInfo :item="item"/>
          <StatusEditor :status="item.status"/>
          <div class="entity-like">
            <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked"/>
          </div>
        </div>
      </div>
      <div class="m-3">
        <RelatedPersons/>
        <AlbumTrack v-if="itemType === $const.ITEM_TYPE.ALBUM"/>
        <DetailPad :text="item.detail"/>
        <RelatedFiles :type="$const.ENTITY.ITEM" :id="item.id"/>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <SideImages/>
      <RelationGroup :showRole="false"/>
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/styles/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {defineAsyncComponent, getCurrentInstance, onBeforeMount, provide, ref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/modules/user";
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/service/itemService";

const ItemInfo = defineAsyncComponent(() => import('@/views/detail/info/ItemDetailInfo.vue'));
const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));
const DetailPad = defineAsyncComponent(() => import('@/components/common/DetailPad.vue'));
const Like = defineAsyncComponent(() => import('@/components/common/EntityLike.vue'));
const StatusEditor = defineAsyncComponent(() => import('@/components/common/StatusEditor.vue'));
const AlbumTrack = defineAsyncComponent(() => import('@/components/item/AlbumTrackInfo.vue'));
const SideImages = defineAsyncComponent(() => import('@/components/image/SideImages.vue'));
const RelatedFiles = defineAsyncComponent(() => import('@/components/related/RelatedFiles.vue'));
const RelatedPersons = defineAsyncComponent(() => import('@/components/related/RelatedPersons.vue'));
const RelationGroup = defineAsyncComponent(() => import('@/components/related/RelationGroup.vue'));

const router = useRouter();
const userStore = useUserStore();
const itemType = ref(0);
const {t} = useI18n();
const item = ref<any>({});
const pageInfo = ref<any>();
const cover = ref({});
const meta = ref<any>();
const {proxy} = getCurrentInstance()!;

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  item.value = meta.value.info.item;
  itemType.value = meta.value.info.type;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
  provide('entity', {type: proxy!.$const.ENTITY.ITEM, id: item.value.id, subType: item.value.type} as Entity);
});

</script>

<style lang="scss" scoped>
</style>