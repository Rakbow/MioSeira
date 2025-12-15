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
              <div style="top: 0" v-permission>
                <RButton v-if="item.type.value === $const.ITEM_TYPE.ALBUM" icon="draft" size="small"
                         @click="openLocalPath" />
                <StatusEditor :status="item.status"/>
                <RButton @click="loadEditor(item)" action="update"/>
              </div>
              <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked"
                    style="bottom: 0"/>
            </div>
          </div>
        </div>
        <div :class="`${prefix}-item-content`">
          <RelatedPersons/>
          <AlbumTracks v-if="item.type.value === $const.ITEM_TYPE.ALBUM" :id="item.id" :catalogId="item.catalogId" />
          <DetailPad :text="item.detail"/>
          <RelatedFiles/>
        </div>
      </div>
    </div>
    <div :class="`${prefix}-side`">
      <ImagePreviewer/>
      <RelationGroup :showRole="false"/>
      <Links/>
<!--      <Changelog/>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, provide, ref} from "vue";
import {useRouter} from "vue-router";
import {loadEditor} from "@/service/itemService";
import {API, Axios} from "@/api";

const prefix = 'entity-detail';

const Info = defineAsyncComponent(() => import('@/views/detail/info/ItemDetailInfo.vue'));
const Links = defineAsyncComponent(() => import('@/components/common/EntityLink.vue'));
const Changelog = defineAsyncComponent(() => import('@/components/common/Changelog.vue'));
const DetailPad = defineAsyncComponent(() => import('@/components/common/DetailPad.vue'));
const Like = defineAsyncComponent(() => import('@/components/common/EntityLike.vue'));
const StatusEditor = defineAsyncComponent(() => import('@/components/common/StatusEditor.vue'));
const AlbumTracks = defineAsyncComponent(() => import('@/components/item/AlbumTracks.vue'));
const ImagePreviewer = defineAsyncComponent(() => import('@/components/image/ImagePreviewer.vue'));
const RelatedFiles = defineAsyncComponent(() => import('@/components/file/RelatedFiles.vue'));
const RelatedPersons = defineAsyncComponent(() => import('@/components/related/RelatedPersons.vue'));
const RelationGroup = defineAsyncComponent(() => import('@/components/related/RelationGroup.vue'));

const router = useRouter();
const item = ref<any>({});
const pageInfo = ref<any>();
const cover = ref<string>();
const meta = ref<any>();
const {proxy} = getCurrentInstance()!;

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  item.value = meta.value.info.item;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
  provide('entity', {type: proxy!.$const.ENTITY.ITEM, id: item.value.id, subType: item.value.type.value} as Entity);
});

const openLocalPath = async () => {
  const res = await Axios.post(API.ENTITY.ENTITY_LOCAL_PATH, {
    entityType: proxy!.$const.ENTITY.ITEM,
    entitySubType: item.value.type.value,
    entityId: item.value.id
  });
  console.log(res.data)
}

</script>
<style lang="scss" scoped>
</style>