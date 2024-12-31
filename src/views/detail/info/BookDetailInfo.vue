<script setup lang="ts">
import {defineProps} from "vue";
import "flag-icons/css/flag-icons.min.css";
import {META} from '@/config/Web_Const.ts';
import {useI18n} from "vue-i18n";

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
        <b>{{ $t('BookType') }}</b>
      </td>
      <td>
        <a :href="'/db/manager/book?bookType=' + item.subType.value">
          <Tag class="ml-1" :value="item.subType.label"/>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('PublishLanguage') }}</b>
      </td>
      <td>
        <a :href="'/db/manager/book?lang=' + item.lang.value">
          <Tag class="ml-1" :value="item.lang.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('Releases') }}</b>
      </td>
      <td>
        {{ item.releaseDate }}
        <Tag class="ml-1" :value="item.releaseType.label" />
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        {{ item.barcode }}
        <span :class="'fi fi-' + item.region" style="margin-left: 0.5rem" />
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
        <i v-if="item.bonus" v-tooltip.bottom="{value: $t('Bonus'), class: 'short-tooltip'}"
           class="ml-1 pi pi-star-fill" style="color: #b7b71e"/>
      </td>
    </tr>
    <tr>
      <td>
        <b>{{ $t('Spec') }}</b>
      </td>
      <td>
        <span v-if="item.size">{{ item.size }},&nbsp;</span>
        <span v-if="item.pages">{{ item.pages }}&nbsp;pages</span>
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

<style scoped>
</style>