<template>
  <Fieldset :toggleable="true">
    <template #legend>
      <span class="material-symbols-outlined fieldset-icon">queue_music</span>
      <b>{{ $const.TrackInfo }}</b>
    </template>
    <div v-if="isEmpty">
      <span class="emptyInfo"><em>{{ $const.NoTrackInfo }}</em></span>
    </div>
    <div v-else>
      <p class="text-start">
        {{ $const.TotalDiscNum }}: <b>{{ info.discList.length }} </b>
        {{ $const.TotalTrackNum }}: <b>{{ info.totalTracks }} </b>
        {{ $const.TotalLength }}: <b>{{ info.totalLength }}</b>
      </p>
      <div v-for="(disc, index) in info.discList">
        <h5>
          {{ `Disc ${index + 1} (${disc.mediaFormat}) ${catalogNo?'[' + catalogNo + '-' + (index + 1) + ']':''} ${disc.albumFormat}` }}
        </h5>
        <table class="table table-sm table-hover">
          <thead>
          </thead>
          <tbody class="detail-item-track-table">
          <tr v-for="(track, index) in disc.trackList">
            <th>{{ index + 1 > 9 ? index + 1 : "0" + (index + 1) }}</th>
            <td nowrap="nowrap">
              <router-link :to="'/db/music/' + track.musicId">
                {{ track.name }}
              </router-link>
            </td>
            <td class="text-end" style="color: #b0c4de">
              <span v-if="track.length === '00:00'">N/A</span>
              <span v-else>{{ track.length }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <p class="text-end">
          {{ $const.TrackNum }}: <b>{{ disc.trackList.length }} </b>
          <span v-if="disc.discLength !== '00:00'">
              {{ $const.DiscLength }}: <b>{{ disc.discLength }}</b>
          </span>
        </p>
      </div>
    </div>
  </Fieldset>
</template>

<script setup>
import {defineProps, getCurrentInstance, onBeforeMount, onMounted, ref} from "vue";
import {useUserStore} from "@/store/user";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;

const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({

    })
  },
  catalogNo: {
    type: String,
    default: () => ('')
  }
});

const isEmpty = ref(false);

onBeforeMount(() => {
  if(JSON.stringify(props.info) === '{}') {
    isEmpty.value = true;
  }
})

</script>

<style scoped>

</style>