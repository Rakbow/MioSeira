<script setup lang="ts">
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, provide, ref} from "vue";
import {useRouter} from "vue-router";

const FavoriteBrowser = defineAsyncComponent(() => import('@/components/list/FavoriteBrowser.vue'));

const prefix = 'entity-detail';
const router = useRouter();
const list = ref<any>();
const {proxy} = getCurrentInstance()!;

onBeforeMount(() => {
  list.value = router.currentRoute.value.meta.info;
  provide('list', {listId: list.value.id, type: list.value.type.value});
});
</script>

<template>
  <div :class="`${prefix}`">
    <div :class="`${prefix}-main`">
      <div :class="`${prefix}-list-info`">
        <div class="flex flex-col">
          <div>
            <div :class="`${prefix}-list-name`">{{ list.name }}</div>
            <div :class="`${prefix}-list-log`">
              <div>
                <RIcon name="person" :size="1.4"/>
                <span>{{ list.creator }}</span>
              </div>
              <div>
                <RIcon name="calendar_add_on" :size="1.4"/>
                <span>{{ list.createTime }}</span>
              </div>
              <div>
                <RIcon name="edit_calendar" :size="1.4"/>
                <span>{{ list.updateTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FavoriteBrowser />
    </div>
  </div>
</template>

<style scoped lang="scss">
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