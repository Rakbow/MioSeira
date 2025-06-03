<script setup lang="ts">
import {defineProps} from "vue";
import {META} from '@/config/Web_Const.ts';
import {useI18n} from "vue-i18n";
import "flag-icons/css/flag-icons.min.css";
import GoodsFigureRelatedInfo from "@/components/item/GoodsFigureRelatedInfo.vue";

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
        <b>{{ $t('Type') }}</b>
      </td>
      <td>
        <Tag class="ml-1" :value="item.subType.label"/>
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
        {{ item.barcode }}
        {{ item.price !== 0 ? item.price : "&nbsp;&nbsp;-" }}
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
        <Tag class="ml-1" :value="item.releaseType.label" />
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('Dimensions') }}</b>
      </td>
      <td>
        <Tag v-if="item.scale" class="ml-1" :value="item.scale"/>&nbsp;
        <span v-if="item.width">W={{ item.width }}mm&nbsp;</span>
        <span v-if="item.length">L={{ item.length }}mm&nbsp;</span>
        <span v-if="item.height">H={{ item.height }}mm&nbsp;</span>
        <span v-if="item.weight">{{ item.weight }}g</span>
      </td>
    </tr>
    <tr v-if="item.versions.length">
      <td>
        <b>{{ $t('Version') }}</b>
      </td>
      <td>
        <div style="display: block;">
          <template v-for="(v, index) in item.versions">
            <span style="white-space: nowrap;">{{ v }}</span>
            <span v-if="index < item.versions.length - 1">, </span>
          </template>
        </div>
      </td>
    </tr>
    <GoodsFigureRelatedInfo :id="item.id" />
    </tbody>
  </table>
</template>

<style scoped lang="scss">
</style>