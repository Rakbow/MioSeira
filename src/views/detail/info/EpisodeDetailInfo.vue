<script setup lang="ts">
import {defineProps, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const entity = ref();

const props = defineProps({
  entity: {
    type: Object,
    required: true,
    default: () => ({})
  } as any
});

onBeforeMount(() => {
  entity.value = props.entity;
});

</script>

<template>
  <ul id="infobox">
    <li>
      <span class="tip">{{ t('Category') }}:&nbsp;</span>
      <Tag v-if="entity.episodeType === 0" class="ml-1" :value="t('EpisodeType0')"/>
      <Tag v-else class="ml-1" :value="t('EpisodeType1')"/>
    </li>
    <li v-if="entity.episodeType === 1">
      <span class="tip">{{ t('PremiereDate') }}:&nbsp;&nbsp;</span>{{ entity.premiereDate }}
    </li>
    <li><span class="tip">{{ t('Index') }}:&nbsp;&nbsp;</span>{{ `${entity.discNo}-${entity.serial}` }}</li>
    <li><span class="tip">{{ t('Duration') }}:&nbsp;&nbsp;</span>{{ entity.duration }}</li>
  </ul>
</template>

<style lang="scss" scoped>
</style>