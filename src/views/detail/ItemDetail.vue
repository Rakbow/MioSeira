<template>
  <div id="main" :class="prefix">
    <div :class="`${prefix}-main`">
      <div :class="`${prefix}-title`">
        <h1 :title="item.name">{{ item.name }}</h1>
        <span v-for="alias in item.aliases">{{ alias }}<br></span>
      </div>
      <div :class="`${prefix}-item`">
        <div :class="`${prefix}-item-summary`">
          <div :class="`${prefix}-item-cover`">
            <img :src="cover" alt="cover"/>
          </div>
          <div :class="`${prefix}-item-info`">
            <Info :item="item"/>
            <div :class="`${prefix}-item-actions`">
              <div style="top: 0">
                <StatusEditor v-if="userStore.user && (userStore.user.type > 2 || userStore.user.type === 0)"
                              :status="item.status"/>
                <RButton v-if="userStore.user && userStore.user.type > 1"
                         @click="loadEditor(item)" icon="edit_square" tooltip="Edit"/>
              </div>
              <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked"
                    style="bottom: 0"/>
            </div>
          </div>
        </div>
        <div :class="`${prefix}-item-content`">
          <RelatedPersons/>
          <AlbumTrack v-if="itemType === $const.ITEM_TYPE.ALBUM"/>
          <DetailPad :text="item.detail"/>
          <RelatedFiles/>
        </div>
      </div>
    </div>
    <div :class="`${prefix}-side`">
      <ImageGallery/>
      <RelationGroup :showRole="false"/>
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, provide, ref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/modules/user";
import {loadEditor} from "@/service/itemService";

const prefix = 'entity-detail';

const Info = defineAsyncComponent(() => import('@/views/detail/info/ItemDetailInfo.vue'));
const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));
const DetailPad = defineAsyncComponent(() => import('@/components/common/DetailPad.vue'));
const Like = defineAsyncComponent(() => import('@/components/common/EntityLike.vue'));
const StatusEditor = defineAsyncComponent(() => import('@/components/common/StatusEditor.vue'));
const AlbumTrack = defineAsyncComponent(() => import('@/components/item/AlbumTrackInfo.vue'));
const ImageGallery = defineAsyncComponent(() => import('@/components/image/ImageGallery.vue'));
const RelatedFiles = defineAsyncComponent(() => import('@/components/related/RelatedFiles.vue'));
const RelatedPersons = defineAsyncComponent(() => import('@/components/related/RelatedPersons.vue'));
const RelationGroup = defineAsyncComponent(() => import('@/components/related/RelationGroup.vue'));

const router = useRouter();
const userStore = useUserStore();
const itemType = ref(0);
const item = ref<any>({});
const pageInfo = ref<any>();
const cover = ref<string>();
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