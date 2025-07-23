<template>
  <Panel>
    <template #header>
        <span><i class="pi pi-list"/><strong>{{ t('RelatedEpisode') }}</strong></span>
    </template>
    <div class="related-episode">
      <div v-if="!loading">

        <div class="flex flex-wrap p-1">
          <div class="grid" style="border-radius: .5rem;background: var(--r-bg-neutral-950)">
            <div class="col-fixed p-1" style="width: 4.5rem">
              <div class="entry-thumb-list">
                <img :src="parent.thumb" role="presentation" :alt="parent.name"/>
              </div>
            </div>
            <div class="col p-1" style="width: 24rem">
                <span class="block data-table-field-text-overflow-hidden">
                  <a :href="`/db/${parent.tableName}/${parent.id}`" :title="parent.name">{{ parent.name }}</a>
                </span>
              <small style="color: gray" class="block data-table-field-text-overflow-hidden">
                {{ parent.subName }}
              </small>
            </div>
          </div>
        </div>


        <table>
          <tbody>
          <tr v-for="ep in eps as any[]">
            <th :class="{ 'related-episode-current-th': ep.id === entity!.id }">
              {{ ep.serial }}
            </th>
            <td nowrap="nowrap" v-if="ep.id === entity!.id" class="related-episode-current-td">
              <span style="width: 25rem" class="text-ellipsis" :title="ep.name">{{ ep.name }}</span>
            </td>
            <td nowrap="nowrap" v-else class="text-ellipsis" style="width: 25rem">
              <router-link :to="`${$api.EPISODE.DETAIL_PATH}/${ep.id}`" :title="ep.name">
                <span>{{ ep.name }}</span>
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>

        <div class="flex flex-wrap p-1">
          <div class="grid" style="border-radius: .5rem;background: var(--r-bg-neutral-950)">
            <div class="col-fixed p-1" style="width: 5rem">
              <div class="entry-thumb-list">
                <Skeleton size="4rem"/>
              </div>
            </div>
            <div class="col p-1" style="width: 24rem">
                <span class="block data-table-field-text-overflow-hidden">
                  <Skeleton class="mt-1"/>
                </span>
              <small style="color: gray" class="block data-table-field-text-overflow-hidden">
                <Skeleton class="mt-2"/>
              </small>
            </div>
          </div>
        </div>

        <table>
          <tbody>
          <tr v-for="index in 10" :key="index">
            <th>
              <Skeleton width="1.5rem"/>
            </th>
            <td nowrap="nowrap">
              <Skeleton width="25.5rem" class="mt-1"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import {defineProps, inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";

const entity = inject<Entity>('entity');
const {t} = useI18n();

const eps = ref<any[]>([]);
const parent = ref({
  name: '',
  subName: '',
  thumb: '',
  id: 0,
  tableName: '',
});
const props = defineProps({
  relatedType: {
    type: Number,
    required: true
  },
  relatedId: {
    type: Number,
    required: true
  }
});
onMounted(() => {
  load();
});

onBeforeMount(() => {
})
const loading = ref(false);

const load = async () => {
  loading.value = true;
  const res = await Axios.post(
      API.EPISODE.RELATED,
      {
        relatedType: props.relatedType,
        relatedId: props.relatedId,
        id: entity!.id
      }
  );
  if (res.success())
    eps.value = res.data.eps;
  parent.value = res.data.parent;
  loading.value = false;
}

</script>

<style lang="scss" scoped>
@use '@/styles/general';

.related-episode {
  &-current {
    &-th {
      color: white;
      border-radius: .5rem 0 0 .5rem;
      background: var(--r-bg-neutral-950);
    }

    &-td {
      border-radius: 0 .5rem .5rem 0;
      background: var(--r-bg-neutral-950);
      color: white;
    }
  }

  table {
    margin: 1rem 0;
    max-width: 28rem;
    padding-bottom: 0;
    border: none;
    border-collapse: collapse;

    tr {
      border-bottom: .1rem solid var(--r-bg-indigo-700);
      padding-bottom: .1rem;

      &:hover {
        background-color: var(--r-bg-indigo-700);
      }
    }

    td {
      padding-top: 0;

      span {
        font-size: 1.1rem;
      }

    }

    th {
      width: 2rem;
      color: var(--r-steel-500);
      @extend .small-font;
    }
  }
}
</style>