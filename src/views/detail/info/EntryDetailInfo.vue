<script setup lang="ts">
import {defineProps, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/toolkit/publicHelper";
import {META} from "@/config/Web_Const";
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
      <span class="tip">{{ t('NameZh') }}:&nbsp;</span>{{ entry!.nameZh }}
    </li>
    <li v-if="entry.nameEn">
      <span class="tip">{{ t('NameEn') }}:&nbsp;</span>{{ entry!.nameEn }}
    </li>
    <li v-if="entry.aliases.length" class="sub_container">
      <ul>
        <li v-for="(alias, index) in entry.aliases" :key="index" :class="{ 'sub_section': index === 0, sub: index > 0 }">
          <span v-if="index === 0" class="tip">{{ t('Aliases') }}:&nbsp;</span>{{ alias }}
        </li>
      </ul>
    </li>
    <li v-if="entry.type.value === META.ENTRY_TYPE.PERSON || entry.type.value === META.ENTRY_TYPE.CHARACTER">
      <span class="tip">{{ t('Gender') }}:&nbsp;</span>
      <i :class="PublicHelper.getGenderIcon(entry.gender.value)" style="font-size: 12px"
         v-tooltip.right="{value: entry.gender.label, class: 'short-tooltip'}" />
    </li>
    <li v-if="entry.type.value !== META.ENTRY_TYPE.CLASSIFICATION && entry.type.value !== META.ENTRY_TYPE.MATERIAL">
      <span class="tip">{{ t('Date') }}:&nbsp;</span>{{ (entry as any).date }}
    </li>
    <li v-if="entry.links.length" class="sub_container">
      <ul>
        <li v-for="(link, index) in entry.links" :key="index" :class="{ 'sub_section': index === 0, sub: index > 0 }">
                    <span v-if="index === 0" class="tip">
                      {{ t('Link') }}:&nbsp;
                    </span><a :href="link">
          <i class="pi pi-link" style="font-size: 11px"/>{{ PublicHelper.getDomain(link) }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
</style>