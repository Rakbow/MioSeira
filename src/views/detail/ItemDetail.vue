<template>
  <div id="main" class="flex flex-wrap justify-content-center gap-3">
    <Toast/>
    <div class="entity-detail-main-col">
      <div class="entity-header-title">
        <h1 :title="item.name">{{ item.name }}</h1>
        <div v-for="alias in item.aliases">
          <span>{{ alias }}</span><br>
        </div>
      </div>
      <div class="grid border-round-sm m-3">
        <div class="col-4" style="width: 200px;height: 200px;text-align: center;vertical-align: middle;">
          <img :src="cover" alt="main"/>
        </div>
        <div class="col card" style="background: #2f364f;">
          <div class="relative">
            <div v-if="userStore.user">
              <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                      @click="loadEditor(item, dialog)" style="right: 10%"
                      v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}" >
                <template #icon>
                  <span class="material-symbols-outlined">edit_note</span>
                </template>
              </Button>
            </div>
            <ItemInfo :item="item" />
            <StatusEditor :status="item.status" />

            <div class="item_statistic_info">
              <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
            </div>
          </div>
        </div>
      </div>
      <div class="m-3">
        <DetailPad v-if="itemType === META.ITEM_TYPE.BOOK" :header="$t('Summary')" :text="item.summary" />
<!--        <RelatedCharacters v-if="itemType == META.ITEM_TYPE.GOODS || itemType == META.ITEM_TYPE.FIGURE" />-->
        <RelatedPersons />
        <DetailPad :header="$t('Description')" :text="item.detail" />
        <AlbumTrack v-if="itemType === META.ITEM_TYPE.ALBUM" />
      </div>
    </div>
    <div class="entity-detail-side-col">
      <SideImages />
      <RelationEntities :header="$t('RelatedProduct')" :relatedGroup="META.RELATION_RELATED_GROUP.RELATED_PRODUCT" />
      <RelationEntities v-if="itemType === META.ITEM_TYPE.GOODS || itemType === META.ITEM_TYPE.FIGURE"
                        :header="$t('RelatedCharacter')" :relatedGroup="META.RELATION_RELATED_GROUP.RELATED_CHAR" />
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime" />
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/entity-detail.scss"
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {defineAsyncComponent, onBeforeMount, ref, shallowRef} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import SideImages from "@/components/image/SideImages.vue";
import RelationEntities from "@/components/related/RelatedEntities.vue";
import RelatedPersons from "@/components/related/RelatedPersons.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import AlbumTrack from "@/components/item/AlbumTrackInfo.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import Like from "@/components/common/EntityLike.vue";
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/itemService";
import {META} from "@/config/Web_Const";
const ItemInfo = shallowRef();
const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();
const itemType = ref(0);
const {t} = useI18n();

const item = ref<any>({});
const pageInfo = ref({});
const cover = ref({});
const option = ref({});
const meta = ref<any>();

const getItemInfo = () => {
  if(itemType.value === META.ITEM_TYPE.ALBUM) {
    ItemInfo.value = defineAsyncComponent(() => import('@/views/detail/info/AlbumDetailInfo.vue'));
  }else if(itemType.value === META.ITEM_TYPE.BOOK) {
    ItemInfo.value = defineAsyncComponent(() => import('@/views/detail/info/BookDetailInfo.vue'));
  }else if(itemType.value === META.ITEM_TYPE.GOODS) {
    ItemInfo.value = defineAsyncComponent(() => import('@/views/detail/info/GoodsDetailInfo.vue'));
  }else if(itemType.value === META.ITEM_TYPE.FIGURE) {
    ItemInfo.value = defineAsyncComponent(() => import('@/views/detail/info/FigureDetailInfo.vue'));
  }
}

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  item.value = meta.value.info.item;
  itemType.value = meta.value.info.type;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
  option.value = meta.value.info.options;

  getItemInfo();
});

</script>

<style lang="scss" scoped>
</style>