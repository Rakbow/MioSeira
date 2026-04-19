<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const NotFound = defineAsyncComponent(() => import('@/views/NotFound.vue'));
const Tracks = defineAsyncComponent(() => import('@/components/index/IndexEpisodeBrowser.vue'));
const Items = defineAsyncComponent(() => import('@/components/index/IndexElementItemBrowser.vue'));

const prefix = 'index-detail';
const router = useRouter();
const entity = ref<any>();
const meta = ref<any>();

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  if (!meta.value.notFound) {
    entity.value = meta.value.info;
  }
});
</script>

<template>
  <NotFound v-if="meta.notFound"/>
  <div v-else>
    <div :class="`${prefix}`">
      <div :class="`${prefix}-main`">
        <div :class="`${prefix}-cover`">
          <img :src="entity.cover" alt="cover"/>
        </div>
        <div :class="`${prefix}-info`">
          <div :class="`${prefix}-name`">{{ entity.name }}</div>
          <div :class="`${prefix}-desc`">{{ entity.remark }}</div>
          <span style="color: #2ea6ff">{{ entity.createdBy }}</span>
          <span style="color: #808080">•{{ t('CreatedAt') }}&nbsp;</span>
          <span style="color: #999999">{{ entity.createdAt }}</span>
          <span style="color: #808080">•{{ t('UpdatedAt') }}&nbsp;</span>
          <span style="color: #999999">{{ entity.updatedAt }}</span>
        </div>
      </div>
    </div>
    <Tracks :listId="entity.id" v-if="entity.type.value === $const.ENTITY.EPISODE"/>
    <Items :indexId="entity.id" v-if="entity.type.value === $const.ENTITY.ITEM"/>
  </div>
</template>

<style scoped lang="scss">
.index-detail {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;

  span {
    font-size: 1.1rem;
  }

  &-main {
    width: 106rem !important;
    background: var(--r-bg-indigo-700);
    border-radius: 1rem;
    padding: .7rem;
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }

  img {
    width: 10rem;
    border-radius: 0.5rem;
  }

  &-cover {
    width: 10rem;
    height: 10rem;
    flex-shrink: 0;
  }

  &-info {
    flex: 1;
  }

  &-name {
    color: var(--r-sand-200);
    font-weight: 700 !important;
    font-size: 2.5rem !important;
  }

  &-desc {
    color: #B0C4DE !important;
    font-size: 1.4rem;
    height: 4.5rem;
  }

}
</style>