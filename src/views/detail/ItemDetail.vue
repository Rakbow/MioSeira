<template>
  <div id="main" class="flex flex-wrap justify-content-center gap-3">
    <Toast/>
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
                  @click="loadEditor(item, dialog)" style="right: 8%"
                  v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}" >
            <template #icon>
              <span class="material-symbols-outlined">edit_note</span>
            </template>
          </Button>
          <ItemInfo :item="item" />
          <StatusEditor :status="item.status" />
          <div class="entity-like">
            <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
          </div>
        </div>
      </div>
      <div class="m-3">
        <RelatedPersons :type="META.ENTITY.ITEM" :id="item.id" :subType="item.type" />
        <AlbumTrack v-if="itemType === META.ITEM_TYPE.ALBUM" />
        <DetailPad :text="item.detail" />
        <RelatedFiles :type="META.ENTITY.ITEM" :id="item.id" />
      </div>
    </div>
    <div class="entity-detail-side-col">
      <SideImages />
      <RelationGroup :type="META.ENTITY.ITEM" :id="item.id" :subType="item.type" :showRole="false" />
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime" />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/entity-detail.scss';
import "@/assets/entity-global.scss";
import "@/assets/entry-detail.scss";
import '@/assets/entity-manager.scss';
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import SideImages from "@/components/image/SideImages.vue";
import RelatedPersons from "@/components/related/RelatedPersons.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import AlbumTrack from "@/components/item/AlbumTrackInfo.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import RelatedFiles from "@/components/related/RelatedFiles.vue";
import Like from "@/components/common/EntityLike.vue";
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/itemService";
import {META} from "@/config/Web_Const";
import RelationGroup from "@/components/related/RelationGroup.vue";
const ItemInfo = defineAsyncComponent(() => import('@/views/detail/info/ItemDetailInfo.vue'));
const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();
const itemType = ref(0);
const {t} = useI18n();

const item = ref<any>({});
const pageInfo = ref<any>();
const cover = ref({});
const option = ref({});
const meta = ref<any>();

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  item.value = meta.value.info.item;
  itemType.value = meta.value.info.type;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
  option.value = meta.value.info.options;
});

</script>

<style lang="scss" scoped>
</style>