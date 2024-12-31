<script setup lang="ts">
import {defineProps} from "vue";
import {META} from '@/config/Web_Const.ts';
import {useI18n} from "vue-i18n";
import "flag-icons/css/flag-icons.min.css";
import {PublicHelper} from "@/toolkit/publicHelper";

const {t} = useI18n();
const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({})
  } as any
});

</script>

<template>
  <table class="table-borderless table-sm ml-2">
    <tbody class="entity-info-table">
    <tr>
      <td>
        <b>{{ $t('MediaFormat') }}</b>
      </td>
      <td v-for="format of item.mediaFormat" style="display:inline">
        <Tag class="ml-1" :value="format.label"/>
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('AlbumFormat') }}</b>
      </td>
      <td v-for="format of item.albumFormat" style="display:inline">
        <Tag class="ml-1" :value="format.label"/>
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('Releases') }}</b>
      </td>
      <td>
        {{ item.releaseDate }}
        <span :class="'ml-1 mr-1 fi fi-' + item.region"/>
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        {{ item.price !== 0 ? item.price : "&nbsp;&nbsp;" }}
        <span v-if="item.price !== 0">
          <span class="dropdown">
            <a href="#" class="dropdown-toggle"
               data-bs-toggle="dropdown">
              <span v-if="item.currency === 'JPY'"
                    v-tooltip="{value: $t('TaxInclusive'), class: 'region-tooltip'}">JPY</span>
              <span v-else>{{ item.currency }}</span>
            </a>
            <div class="dropdown-menu" style="background: black">
              <a v-for="(currency, code) in META.CURRENCIES" :key="code"
                 :href="`https://www.bing.com/search?q=${item.price}+${item.currency}+IN+${code}`"
                 class="dropdown-item">{{ currency }}</a>
            </div>
          </span>
        </span>
        <Tag class="ml-1" :value="item.releaseType.label"/>
        <i v-if="item.bonus" v-tooltip.bottom="{value: $t('Bonus'), class: 'short-tooltip'}"
           class="ml-1 pi pi-star-fill" style="color: #b7b71e"/>
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        {{ item.catalogId }}&nbsp;•&nbsp;{{ item.barcode }}
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('Spec') }}</b>
      </td>
      <td>
        <span v-if="item.discs">{{ item.discs }}&nbsp;discs,&nbsp;</span>
        <span v-if="item.tracks">{{ item.tracks }}&nbsp;tracks,&nbsp;</span>
        <span v-if="item.runTime">{{ PublicHelper.secondsToTimeFormat(item.runTime) }}</span>
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('Dimensions') }}</b>
      </td>
      <td>
        <span v-if="item.width">W={{ item.width }}mm&nbsp;</span>
        <span v-if="item.length">L={{ item.length }}mm&nbsp;</span>
        <span v-if="item.height">H={{ item.height }}mm&nbsp;</span>
        <span v-if="item.weight">{{ item.weight }}g</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
</style>