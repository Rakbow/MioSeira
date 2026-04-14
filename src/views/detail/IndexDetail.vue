<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";

const NotFound = defineAsyncComponent(() => import('@/views/NotFound.vue'));
const IndexEpBrowser = defineAsyncComponent(() => import('@/components/index/IndexEpisodeBrowser.vue'));
const IndexElementBrowser = defineAsyncComponent(() => import('@/components/index/IndexElementBrowser.vue'));

const prefix = 'entity-detail';
const router = useRouter();
const list = ref<any>();
const meta = ref<any>();

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  if (!meta.value.notFound) {
    list.value = meta.value.info;
  }
});
</script>

<template>
  <NotFound v-if="meta.notFound"/>
  <div v-else>
    <div :class="`${prefix}`">
      <div :class="`${prefix}-main`">
        <div :class="`${prefix}-list-info`">
          <div class="flex flex-col">
            <div>
              <div :class="`${prefix}-list-name`">{{ list.name }}</div>
              <div :class="`${prefix}-list-log`">
                <div>
                  <RIcon name="person" :size="1.4"/>
                  <span>{{ list.createdBy }}</span>
                </div>
                <div>
                  <RIcon name="calendar_add_on" :size="1.4"/>
                  <span>{{ list.createdAt }}</span>
                </div>
                <div>
                  <RIcon name="edit_calendar" :size="1.4"/>
                  <span>{{ list.updatedAt }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <IndexEpBrowser :listId="list.id" v-if="list.type.value === $const.ENTITY.EPISODE"/>
    <IndexElementBrowser :indexId="list.id" v-if="list.type.value === $const.ENTITY.ITEM"/>
  </div>
</template>

<style scoped lang="scss">
.entity-detail-main {
  width: 106rem !important;
}

.entity-detail-list {

  &-info {
    background: var(--r-bg-indigo-700);
    border-radius: 1rem;
    margin: 1rem;
    padding: 2rem;
  }

  &-name {
    font-weight: 700 !important;
    font-size: 1.75rem !important;
    margin-bottom: 2rem !important;
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
</style>