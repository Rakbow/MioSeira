<template>
  <div class="entity-detail">
    <div class="entity-detail-main-col">
      <div class="entity-detail-title">
        <h1 style="display: inline;">{{ episode.name }}</h1>
        <div v-if="episode.nameEn">
          <span>{{ episode.nameEn }}</span>
        </div>
      </div>
      <div class="grid mx-2">
        <div class="col-4" style="width: 210px">
          <div class="entity-image-cover-200">
            <img :src="episode.cover" alt="main"/>
          </div>
          <div class="entity-detail-entry-info">
            <ul id="infobox">
              <li>
                <span class="tip">{{ t('Category') }}:&nbsp;</span>
                <Tag v-if="episode.episodeType === 0" class="ml-1" :value="t('EpisodeType0')"/>
                <Tag v-else class="ml-1" :value="t('EpisodeType1')"/>
              </li>
              <li v-if="episode.episodeType === 1">
                <span class="tip">{{ t('PremiereDate') }}:&nbsp;&nbsp;</span>{{ episode.premiereDate }}
              </li>
              <li><span class="tip">{{ t('Index') }}:&nbsp;&nbsp;</span>{{ `${episode.discNo}-${episode.serial}` }}</li>
              <li><span class="tip">{{ t('Duration') }}:&nbsp;&nbsp;</span>{{ episode.duration }}</li>
            </ul>
            <div v-if="userStore.user && userStore.user.type > 1">
              <Button class="p-button-link" icon="pi pi-pen-to-square"
                      @click="loadEditor($const.ENTITY.EPISODE, episode)"
                      v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}"/>
              <Like :likeCount="episode.traffic.likeCount" :liked="episode.traffic.liked" />

            </div>
          </div>
        </div>
        <div class="col py-0">
          <DetailPad :text="episode.detail"/>
          <RelatedFiles />
        </div>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <RelatedEpisodes :relatedType="episode.relatedType" :relatedId="episode.relatedId" :id="episode.id" />
      <TrafficInfo :info="episode.traffic" :addedTime="episode.addedTime" :editedTime="episode.editedTime"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/modules/user";
import {loadEditor} from "@/service/entityService";
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, provide, ref} from "vue";

const {t} = useI18n();

const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));
const DetailPad = defineAsyncComponent(() => import('@/components/common/DetailPad.vue'));
const Like = defineAsyncComponent(() => import('@/components/common/EntityLike.vue'));
const RelatedFiles = defineAsyncComponent(() => import('@/components/file/RelatedFiles.vue'));
const RelatedEpisodes = defineAsyncComponent(() => import('@/components/related/RelatedEpisodes.vue'));

const router = useRouter();
const userStore = useUserStore();
const episode = ref<any>({});
const {proxy} = getCurrentInstance()!;

onBeforeMount(() => {
  episode.value = router.currentRoute.value.meta.info;
  provide('entity', {type: proxy!.$const.ENTITY.EPISODE, id: episode.value.id} as Entity);
});

</script>

<style lang="scss" scoped>
</style>