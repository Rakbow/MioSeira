<script setup lang="ts">
import {defineProps, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/toolkit/publicHelper";
const {t} = useI18n();
const entry = ref();

const props = defineProps({
  entry: {
    type: Object,
    required: true,
    default: () => ({})
  } as any
});

onBeforeMount(() => {
  entry.value = props.entry;
});

</script>

<template>
  <ul id="infobox">
    <li v-if="entry.nameZh">
      <span class="tip">{{ $t('PersonNameZh') }}:&nbsp;</span>{{ entry!.nameZh }}
    </li>
    <li v-if="entry.nameEn">
      <span class="tip">{{ $t('PersonNameEn') }}:&nbsp;</span>{{ entry!.nameEn }}
    </li>
    <li v-if="entry!.aliases.length" class="sub_container">
      <ul>
        <li class="sub_section"><span class="tip">{{ $t('Aliases') }}:&nbsp;</span>{{ entry!.aliases[0] }}</li>
        <li v-for="(item, index) in entry.aliases.slice(1)" :key="index" class="sub">
          <span class="tip" style="display: none;">{{ $t('Aliases') }}:&nbsp;</span>{{ item }}
        </li>
      </ul>
    </li>
    <li>
      <span class="tip">{{ $t('Gender') }}:&nbsp;</span>
      <i :class="'mt-2 pi pi-' + PublicHelper.getGenderIcon(entry.gender.value)" style="font-size: 12px"
         v-tooltip.right="{value: entry.gender.label, class: 'short-tooltip'}" />
    </li>
    <li v-if="entry!.birthDate">
      <span class="tip">{{ $t('BirthDate') }}:&nbsp;</span>{{ entry!.birthDate }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
</style>