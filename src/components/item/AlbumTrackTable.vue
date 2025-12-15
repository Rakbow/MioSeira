<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {computed, ref} from "vue";

const props = defineProps<{
  disc: any
}>();
const {t} = useI18n();

const maxRows = ref(10);// 最大显示行数
const isCollapsed = ref(true);// 折叠状态
const visibleRows = computed(() => {
  return isCollapsed.value ? props.disc.tracks.slice(0, maxRows.value) : props.disc.tracks;
});
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <b class="album-tracks-disc-header">
    {{ `Disc ${disc.discNo} (${disc.mediaFormat.label})` }}
    <template v-if="disc.catalogId">&nbsp;[{{ disc.catalogId }}]</template>
    <template v-if="disc.albumFormat.length">
      &nbsp;
      <p v-for="(format, index) of disc.albumFormat">
        <span>{{ format.label }}</span>
        <span v-if="index < disc.albumFormat.length - 1">, </span>
      </p>
    </template>
  </b>
  <table>
    <tbody>
      <tr v-for="track in visibleRows">
        <th>{{ track.serial < 10 ? `0${track.serial}` : track.serial }}</th>
        <td nowrap="nowrap">
          <router-link :to="`${$api.EPISODE.DETAIL_PATH}/${track.id}`">
            <span>{{ track.name }}</span>
          </router-link>
        </td>
        <td class="album-tracks-duration">
          <span>{{ track.duration }}</span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2">
          <div class="album-tracks-disc-toggle">
            <Button v-if="disc.tracks.length > maxRows" @click="toggleCollapse" class="p-button-link" size="small">
              <span v-if="isCollapsed" style="font-size: 1.1rem">{{ t('Expand') }}&nbsp;<i class="pi pi-sort-down-fill"/></span>
              <span v-else>{{ t('Collapse') }}&nbsp;<i class="pi pi-sort-up-fill"/></span>
            </Button>
          </div>
        </td>
        <td>
          <div class="album-tracks-disc-total">
            <span>&nbsp;{{ t('TrackNum') }}:&nbsp;</span>{{ disc.tracks.length }}
            <span v-if="disc.duration">&nbsp;{{ t('DiscLength') }}:&nbsp;</span>{{ disc.duration }}
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<style scoped lang="scss">
@use "@/styles/entity-extra-album";
</style>