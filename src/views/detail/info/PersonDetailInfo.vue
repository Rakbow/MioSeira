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
      <span class="tip">{{ $t('PersonNameZh') }}:&nbsp;</span>{{ entry!.nameZh }}
    </li>
    <li v-if="entry.nameEn">
      <span class="tip">{{ $t('PersonNameEn') }}:&nbsp;</span>{{ entry!.nameEn }}
    </li>
    <li v-if="entry.aliases.length" class="sub_container">
      <ul>
        <li v-for="(alias, index) in entry.aliases" :key="index" :class="{ 'sub_section': index === 0, sub: index > 0 }">
          <span v-if="index === 0" class="tip">{{ $t('Aliases') }}:&nbsp;</span>{{ alias }}
        </li>
      </ul>
    </li>
    <li v-if="entry!.birthDate">
      <span class="tip">{{ $t('BirthDate') }}:&nbsp;</span>{{ entry!.birthDate }}
    </li>
    <li v-if="entry.gender.value">
      <span class="tip">{{ $t('Gender') }}:&nbsp;</span>
      <i :class="'mt-2 pi pi-' + PublicHelper.getGenderIcon(entry.gender.value)" style="font-size: 12px"
         v-tooltip.right="{value: entry.gender.label, class: 'short-tooltip'}" />
    </li>

    <li v-for="(link, index) in entry.links" :key="index" :class="{ 'sub_section': index === 0, sub: index > 0 }">
      <span v-if="index === 0" class="tip">{{ $t('Link') }}:&nbsp;</span>
      <a :href="link.url" target="_blank">
                <span style="display: inline;" class="text-truncate-2 mr-2">
                  <i :class="link.type === META.LINK_TYPE.TWITTER ? 'pi pi-twitter' : 'pi pi-at'" style="font-size: 11px" />
                  <i>{{ link.name }}</i>
                </span>
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
</style>