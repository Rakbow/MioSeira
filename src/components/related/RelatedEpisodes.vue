<template>
  <Panel class="entity-detail-side-panel">
    <template #header>
        <span><i class="pi pi-list"/><strong>{{ t('RelatedEpisode') }}</strong></span>
    </template>
    <div class="relative">
      <div v-if="!loading">

        <div class="flex flex-wrap p-1">
          <div class="grid" style="border-radius: 5px;background: var(--r-bg-neutral-950)">
            <div class="col-fixed p-1" style="width: 45px">
              <div class="entry-thumb">
                <img role="presentation" :alt="parent.name" :src="parent.thumb"/>
              </div>
            </div>
            <div class="col p-1" style="width: 240px">
                <span class="block data-table-field-text-overflow-hidden">
                  <a :href="`/db/${parent.tableName}/${parent.id}`" :title="parent.name">{{ parent.name }}</a>
                </span>
              <small style="color: gray" class="block data-table-field-text-overflow-hidden">
                {{ parent.subName }}
              </small>
            </div>
          </div>
        </div>


        <table class="episode-list-table table table-sm">
          <tbody>
          <tr v-for="ep in eps">
            <th :class="{ 'episode-list-current-th': ep.id === props.id }">
              {{ ep.serial }}
            </th>
            <td nowrap="nowrap" v-if="ep.id === props.id" class="episode-list-current-td">
              <span>{{ ep.name }}</span>
            </td>
            <td nowrap="nowrap" v-else>
              <router-link :to="`${$api.EPISODE_DETAIL}/${ep.id}`">
                <span>{{ ep.name }}</span>
              </router-link>
            </td>
            <!--              <td class="album-track-duration">-->
            <!--                <span>{{ ep.duration }}</span>-->
            <!--              </td>-->
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>

        <div class="flex flex-wrap p-1">
          <div class="grid" style="border-radius: 5px;background: var(--r-bg-neutral-950)">
            <div class="col-fixed p-1" style="width: 50px">
              <div class="entry-thumb">
                <Skeleton size="40px"/>
              </div>
            </div>
            <div class="col p-1" style="width: 240px">
                <span class="block data-table-field-text-overflow-hidden">
                  <Skeleton class="mt-1"/>
                </span>
              <small style="color: gray" class="block data-table-field-text-overflow-hidden">
                <Skeleton class="mt-2"/>
              </small>
            </div>
          </div>
        </div>

        <table class="episode-list-table table table-sm table-hover">
          <tbody>
          <tr v-for="index in 10" :key="index">
            <th>
              <Skeleton width="15px"/>
            </th>
            <td nowrap="nowrap">
              <Skeleton width="255px" class="mt-1"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import {defineProps, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";

const {t} = useI18n();

const eps = ref([]);
const parent = ref({
  name: null,
  subName: null,
  thumb: null,
  id: null,
  tableName: null,
});
const props = defineProps({
  relatedType: {
    type: Number,
    required: true
  },
  relatedId: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});
onMounted(() => {
  getRelatedData();
});

onBeforeMount(() => {
})
const loading = ref(false);

const getRelatedData = async () => {
  loading.value = true;
  const res = await Axios.post(
      API.EPISODE_GET_RELATED,
      {
        relatedType: props.relatedType,
        relatedId: props.relatedId,
        id: props.id
      }
  );
  if (res.success())
    eps.value = res.data.eps;
  parent.value = res.data.parent;
  loading.value = false;
}

</script>

<style lang="scss" scoped>
@use '@/styles/general' as general;

.episode-list {
  &-duration {
    text-align: right !important;
    color: var(--r-steel-300);
  }

  &-total {
    @extend .small-font;
    float: right;
    margin: 1px;

    > span {
      color: gray
    }
  }

  &-table {

    padding-bottom: 0;

    td, th {
      padding-bottom: 0;
      border-bottom: 1px solid var(--r-bg-indigo-700);
    }

    td {
      padding-top: 0;

      span {
        font-size: 11px;
      }

    }

    th {
      width: 20px;
      padding-top: 4px;
      color: var(--r-steel-500);
      @extend .small-font;
    }
  }

  &-current {
    &-th {
      color: white;
      border-radius: 5px 0 0 5px;
      background: var(--r-bg-neutral-950);
    }

    &-td {
      border-radius: 0 5px 5px 0;
      background: var(--r-bg-neutral-950);
      color: white;
    }
  }
}
</style>