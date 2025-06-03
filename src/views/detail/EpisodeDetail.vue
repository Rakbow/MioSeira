<template>
  <Toast/>
  <div class="flex flex-wrap justify-content-center gap-3">
    <div class="entity-detail-main-col">
      <div class="entity-header-title">
        <h1 style="display: inline;">{{ episode.title }}</h1>
        <div v-if="episode.titleEn">
          <span>{{ episode.titleEn }}</span>
        </div>
      </div>
      <div class="grid mx-2">
        <div class="col-4" style="width: 210px">
          <div class="entity-image-cover-200">
            <img :src="episode.cover" alt="main"/>
          </div>
          <div class="infobox_container">
            <EpisodeInfo :entity="episode"/>
            <div v-if="userStore.user && userStore.user.type > 1">
              <Button class="p-button-link" icon="pi pi-pen-to-square"
                      @click="loadEditor(META.ENTITY.EPISODE, episode, dialog)"
                      v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}"/>
              <Like :likeCount="episode.traffic.likeCount" :liked="episode.traffic.liked" />

            </div>
          </div>
        </div>
        <div class="col py-0">
          <DetailPad :header="$t('Description')" :text="episode.detail"/>
        </div>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <TrafficInfo :info="episode.traffic" :addedTime="episode.addedTime" :editedTime="episode.editedTime"/>
      <RelatedEpisodes :relatedType="episode.relatedType" :relatedId="episode.relatedId"
                       :id="episode.id" :discNo="episode.discNo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/entity-detail.scss';
import '@/assets/item-detail.css';
import "@/assets/entity-global.scss";
import "@/assets/entry-detail.scss";
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import {loadEditor} from "@/logic/entryService";
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import {META} from "@/config/Web_Const";
import Like from "@/components/common/EntityLike.vue";

const {t} = useI18n();

const entryImageEditor = defineAsyncComponent(() => import('@/components/image/EntryImageEditor.vue'));
const EpisodeInfo = defineAsyncComponent(() => import('@/views/detail/info/EpisodeDetailInfo.vue'));
const RelatedEpisodes = defineAsyncComponent(() => import('@/components/related/RelatedEpisodes.vue'));

const meta = ref<any>();
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const episode = ref<any>({});

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  episode.value = meta.value.info;
});

</script>

<style lang="scss" scoped>
</style>