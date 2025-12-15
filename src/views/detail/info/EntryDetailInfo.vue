<script setup lang="ts">
import {defineProps} from "vue";
import {useI18n} from "vue-i18n";
import {PublicHelper} from "@/utils/publicHelper";
const {t} = useI18n();

const props = defineProps<{
  entry: any
}>();

</script>

<template>
  <ul>
    <li v-if="entry.nameZh">
      <span>{{ t('NameZh') }}:&nbsp;</span>{{ entry!.nameZh }}
    </li>
    <li v-if="entry.nameEn">
      <span>{{ t('NameEn') }}:&nbsp;</span>{{ entry!.nameEn }}
    </li>
    <li v-if="entry.gender">
      <span>{{ t('Gender') }}:&nbsp;</span>
      <i :class="PublicHelper.getGenderIcon(entry.gender)"/>
    </li>
    <li v-if="entry.date">
      <span>{{ t('Date') }}:&nbsp;</span>{{ entry.date }}
    </li>

    <li v-if="entry.aliases.length" style="border-bottom: 0">
      <ul>
        <li v-for="(alias, index) in entry.aliases" :class="{ sub: index > 0 }">
          <span v-if="index === 0">{{ t('Aliases') }}:&nbsp;</span>
          {{ alias }}
        </li>
      </ul>
    </li>
<!--    <li v-if="entry.links.length" style="border-bottom: 0">-->
<!--      <ul>-->
<!--        <li v-for="(link, index) in entry.links" :class="{ sub: index > 0 }">-->
<!--          <span v-if="index === 0">{{ t('Link') }}:&nbsp;</span>-->
<!--          <a :href="link" target="_blank"><i class="pi pi-link"/>{{ PublicHelper.getHostname(link) }}</a>-->
<!--        </li>-->
<!--      </ul>-->
<!--    </li>-->
  </ul>
</template>

<style lang="scss" scoped>
</style>