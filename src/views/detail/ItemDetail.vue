<template>
  <div id="main" class="flex flex-wrap justify-content-center gap-3">
    <Toast></Toast>
    <div class="mt-3 card" style="width: 900px;background: #18181b">
      <div class="item-detail-header">
        <h3>{{ item.name }}</h3>
        <h5 v-if="item.nameEn">{{ item!.nameEn }}</h5>
        <h5 v-else />
        <h5 v-if="item.nameZh">{{ item!.nameZh }}</h5>
        <h5 v-else />
      </div>
      <div class="grid border-round-sm m-3">
        <div class="col-4" style="width: 200px;height: 200px;text-align: center;vertical-align: middle;">
          <img :src="cover" alt="main"/>
        </div>
        <div class="col card" style="background: #2f364f;">
          <div class="relative">
            <div v-if="userStore.user">
              <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                      @click="loadEditor(dialog, item, option)" style="right: 10%"
                      v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}" >
                <template #icon>
                  <span class="material-symbols-outlined">edit_note</span>
                </template>
              </Button>
            </div>
            <AlbumInfo v-if="itemType === META.ITEM_TYPE.ALBUM" :item="item" />
            <BookInfo v-if="itemType === META.ITEM_TYPE.BOOK" :item="item" />
            <StatusEditor :status="item.status" />
            <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
          </div>
        </div>
      </div>
      <div class="m-3">
        <PersonsInfo :personnel="personnel"/>
        <!-- detail -->
        <DetailPad :header="$t('Description')" :text="item.detail" />
        <!-- tracks info -->
        <TrackInfo v-if="itemType === META.ITEM_TYPE.ALBUM" />
      </div>
    </div>
    <div style="width: 300px">
      <SideImages :images="meta.info.images" :count="meta.info.imageCount" />
      <RelationInfo />
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime" />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user.ts";
import {useDialog} from "primevue/usedialog";
import SideImages from "@/components/image/SideImages.vue";
import RelationInfo from "@/components/common/RelationInfo.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import TrackInfo from "@/components/special/AlbumTrackInfo.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import Like from "@/components/common/EntityLike.vue";
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/itemService";
import {META} from "@/config/Web_Const";

const AlbumInfo = defineAsyncComponent(() => import('@/views/detail/info/AlbumDetailInfo.vue'));
const BookInfo = defineAsyncComponent(() => import('@/views/detail/info/BookDetailInfo.vue'));
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
const personnel = ref([]);
const meta = ref<any>();

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  item.value = meta.value.info.item;
  itemType.value = meta.value.info.type;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
  option.value = meta.value.info.options;
  personnel.value = meta.value.info.personnel;
});

</script>

<style lang="scss" scoped>

@import "@/assets/entity-detail";

.item-detail-header {
  margin: 1rem;
}

.item-detail-header h3 {
  font-weight: bold;
  color: #beb993;
  text-align: left;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.item-detail-header h5 {
  /*font-family: "Comic Sans MS", "serif";*/
  text-align: left !important;
  margin-top: 0.2em;
  margin-bottom: 0;
  color: #788990;
}
</style>