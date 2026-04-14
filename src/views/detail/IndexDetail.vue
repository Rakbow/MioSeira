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
        <div :class="`${prefix}-list-info`">
          <div :class="`${prefix}-list-name`">{{ entity.name }}</div>
          <article>{{ entity.remark }}</article>
          <span style="color: #2ea6ff">{{ entity.createdBy }}</span>
          <span style="color: #808080">•{{ t('CreatedAt') }}&nbsp;</span>
          <span style="color: #B0C4DE">{{ entity.createdAt }}</span>
          <span style="color: #808080">•{{ t('UpdatedAt') }}&nbsp;</span>
          <span style="color: #B0C4DE">{{ entity.updatedAt }}</span>
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

  article {
    color: #d8d8d8 !important;
    margin-bottom: .5rem;
  }

  span {
    font-size: 1.1rem;
  }

  &-main {
    width: 106rem !important;
  }

  &-list {

    &-info {
      background: var(--r-bg-indigo-700);
      border-radius: 1rem;
      padding: 1.5rem;
    }

    &-name {
      color: var(--r-sand-200);
      font-weight: 700 !important;
      font-size: 2rem !important;
      margin-bottom: .5rem !important;
    }

    &-log {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 5rem !important;

      > div {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }
    }

  }
}
</style>