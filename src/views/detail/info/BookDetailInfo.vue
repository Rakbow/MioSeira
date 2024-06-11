<script setup lang="ts">
import {defineProps} from "vue";
import "/node_modules/flag-icons/css/flag-icons.min.css";
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
    <tbody class="detail-item-header-table">
    <tr>
      <td>
        <i class="pi pi-barcode"/>
        <strong>{{ $t('BookISBN10') }}</strong>
      </td>
      <td>
        {{ item.isbn10 }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-barcode"/>
        <strong>{{ $t('BookISBN13') }}</strong>
      </td>
      <td>
        {{ item.barcode }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-info-circle"></i>
        <strong>{{ $t('Releases') }}</strong>
      </td>
      <td>
        {{ item.releaseDate }}
        <Tag class="ml-1" :value="item.releaseType.label" />
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
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-tag"></i>
        <strong>{{ $t('BookType') }}</strong>
      </td>
      <td>
        <a :href="'/db/manager/book?bookType=' + item.bookType.value">
          <Tag class="ml-1" :value="item.bookType.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-language"></i>
        <strong>{{ $t('Language') }}</strong>
      </td>
      <td>
        <a :href="'/db/manager/book?lang=' + item.lang.value">
          <Tag class="ml-1" :value="item.lang.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-verified"/>
        <strong>{{ $t('Bonus') }}</strong>
      </td>
      <td>
        <a v-if="item.bonus" class="ml-3">
          <i class="pi true-icon pi-check-circle" style="color: green"/>
        </a>
        <i v-else class="pi false-icon pi-times-circle"/>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>