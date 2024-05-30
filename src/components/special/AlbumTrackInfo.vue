<template>
  <Fieldset :toggleable="true">
    <template #legend>
      <span class="material-symbols-outlined fieldset-icon">queue_music</span>
      <b>{{ $const.TrackInfo }}</b>
    </template>

    <div class="relative">

      <div v-if="userStore.user">
        <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                @click="openEditDialog" style="right: 5%" :disabled="loading"
                v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}">
          <template #icon>
            <span class="material-symbols-outlined">edit_note</span>
          </template>
        </Button>
      </div>

      <div v-if="!loading">
        <div v-if="info.discs.length === 0">
          <span class="emptyInfo"><em>{{ $const.NoTrackInfo }}</em></span>
        </div>
        <div v-else>
          <p class="text-start">
            {{ $const.TotalDiscNum }}: <b>{{ info.discs.length }} </b>
            {{ $const.TotalTrackNum }}: <b>{{ info.totalTracks }} </b>
            {{ $const.TotalLength }}: <b>{{ info.totalDuration }}</b>
          </p>
          <div v-for="disc in info.discs">
            <h5>
              {{ `Disc ${disc.serial}   ${disc.code}` }}
            </h5>
            <table class="table table-sm table-hover">
              <thead />
              <tbody class="detail-item-track-table">
              <tr v-for="track in disc.tracks">
                <th>{{ track.serial }}</th>
                <td nowrap="nowrap">
                  <router-link :to="'/db/ep/' + track.id">
                    {{ track.title }}
                  </router-link>
                </td>
                <td class="text-end" style="color: #b0c4de">
                  {{ track.duration }}
                </td>
              </tr>
              </tbody>
            </table>
            <p class="text-end">
              {{ $const.TrackNum }}: <b>{{ disc.tracks.length }}</b>
              <span>&nbsp;{{ $const.DiscLength }}: <b>{{ disc.duration }}</b></span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading">
        <p class="text-start" style="white-space: nowrap;">
          <Skeleton width="20rem" class="mb-2" />
        </p>
        <h5>
          <Skeleton width="15rem" height="1.5rem" />
        </h5>
        <table class="table table-sm table-hover">
          <thead />
          <tbody class="detail-item-track-table">
          <tr v-for="index in 5" :key="index">
            <th><Skeleton width="2rem" class="mb-2" /></th>
            <td nowrap="nowrap"><Skeleton width="35rem" /></td>
            <td class="text-end" style="color: #b0c4de"><Skeleton width="2rem" /></td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </Fieldset>
</template>

<script setup>
import {defineAsyncComponent, defineProps, getCurrentInstance, onBeforeMount, onMounted, ref} from "vue";
import {useUserStore} from "@/store/user.ts";
import {useRoute} from "vue-router";
import {useDialog} from "primevue/usedialog";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";

const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;
const editor = defineAsyncComponent(() => import('@/components/special/AlbumTrackEditor.vue'));

onMounted(() => {
});

onBeforeMount(() => {
  reloadTrackInfo();
})

const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const editBlock = ref(false);
const loading = ref(false);
const info = ref({
  discs: []
});

const reloadTrackInfo = async () => {
  editBlock.value = true;
  loading.value = true;
  const res = await axios.post($api.GET_ALBUM_TRACK_INFO, {id: route.params.id});
  if(res.state === axios.SUCCESS)
    info.value = res.data;
  editBlock.value = false;
  loading.value = false;
}

const openEditDialog = () => {
  dialog.open(editor, {
    props: {
      header: $const.TrackInfo,
      style: {
        width: '60vw',
        minWidth: '60vw'
      },
      breakpoints: {
        '960px': '60vw',
        '640px': '40vw'
      },
      modal: true,
      closable: false
    },
    data: {
      discs: info.value.discs
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          reloadTrackInfo();
        }
      }
    }
  });
}

</script>

<style scoped>

</style>