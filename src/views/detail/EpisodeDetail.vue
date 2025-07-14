<template>
  <div :class="`${prefix}`">
    <div :class="`${prefix}-main`">
      <div :class="`${prefix}-title`">
        <h1 style="display: inline;">{{ episode.name }}</h1>
        <div v-if="episode.nameEn">
          <span>{{ episode.nameEn }}</span>
        </div>
      </div>
      <div :class="`${prefix}-entry`">
        <div :class="`${prefix}-entry-summary`">
          <div :class="`${prefix}-entry-cover`">
            <img :src="episode.cover" alt="cover"/>
          </div>
          <div :class="`${prefix}-entry-info`">
            <ul>
              <li>
                <span>{{ t('Category') }}:&nbsp;</span>
                <Tag v-if="episode.episodeType === 0" :value="t('EpisodeType0')"/>
                <Tag v-else :value="t('EpisodeType1')"/>
              </li>
              <li v-if="episode.episodeType === 1">
                <span>{{ t('PremiereDate') }}:&nbsp;&nbsp;</span>{{ episode.premiereDate }}
              </li>
              <li><span>{{ t('Index') }}:&nbsp;&nbsp;</span>{{ `${episode.discNo}-${episode.serial}` }}</li>
              <li><span>{{ t('Duration') }}:&nbsp;&nbsp;</span>{{ episode.duration }}</li>
            </ul>
            <div :class="`${prefix}-entry-actions`">
              <Like :likeCount="episode.traffic.likeCount" :liked="episode.traffic.liked"/>
              <div style="right: 0">
                <StatusEditor v-if="userStore.user && (userStore.user.type > 2 || userStore.user.type === 0)"
                              :status="episode.status"/>
                <RButton v-if="userStore.user && userStore.user.type > 1"
                         @click="loadEditor($const.ENTITY.EPISODE, episode)" action="update"/>
              </div>
            </div>
          </div>
        </div>
        <div :class="`${prefix}-entry-content`">
          <DetailPad :text="episode.detail"/>
          <RelatedFiles/>
        </div>
      </div>
    </div>
    <div :class="`${prefix}-side`">
      <RelatedEpisodes :relatedType="episode.relatedType" :relatedId="episode.relatedId"/>
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

const prefix = 'entity-detail';
const {t} = useI18n();

const TrafficInfo = defineAsyncComponent(() => import('@/components/common/PageTraffic.vue'));
const Like = defineAsyncComponent(() => import('@/components/common/EntityLike.vue'));
const StatusEditor = defineAsyncComponent(() => import('@/components/common/StatusEditor.vue'));
const DetailPad = defineAsyncComponent(() => import('@/components/common/DetailPad.vue'));
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