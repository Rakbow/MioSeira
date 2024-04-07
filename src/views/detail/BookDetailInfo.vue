<script setup>
import {defineProps, getCurrentInstance} from "vue";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {META} from '@/config/Web_Const';
const $const = getCurrentInstance().appContext.config.globalProperties.$const;

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

</script>

<template>
  <table class="table-borderless table-sm ml-2">
    <tbody class="detail-item-header-table">
    <tr>
      <td>
        <i class="pi pi-barcode" />
        <strong>{{ $const.BookISBN10 }}</strong>
      </td>
      <td>
        {{ item.isbn10 }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-barcode" />
        <strong>{{ $const.BookISBN13 }}</strong>
      </td>
      <td>
        {{ item.isbn13 }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-tag"></i>
        <strong>{{ $const.BookType }}</strong>
      </td>
      <td>
        <a :href="'/db/manager/book?bookType=' + item.bookType.value">
          <Tag class="ml-1" :value="item.bookType.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-globe"></i>
        <strong>{{ $const.Region }}</strong>
      </td>
      <td>
        <span :class="'fi fi-' + item.region.value" style="margin-left: 0.5rem"
              v-tooltip.bottom="{value: item.region.label, class: 'region-tooltip'}"></span>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-language"></i>
        <strong>{{ $const.Language }}</strong>
      </td>
      <td>
        <a :href="'/db/manager/book?lang=' + item.lang.value">
          <Tag class="ml-1" :value="item.lang.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-calendar"></i>
        <strong>{{ $const.PublishDate }}</strong>
      </td>
      <td>
        {{ item.publishDate }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-ticket"></i>
        <strong>{{ $const.PublishPrice }}</strong>
      </td>
      <td>
        {{ item.price !== 0 ? item.price : "&nbsp;&nbsp;-" }}
        <span v-if="item.price !== 0">
          <span v-if="item.currency === 'JPY'" class="ml-1"
                style="text-decoration-line: underline;text-decoration-style: dashed;"
                v-tooltip.right="{value: $const.TaxInclusive, class: 'region-tooltip'}">JPY</span>
          <span v-else>{{ item.currency }}</span>
          <span class="ml-2 dropdown">
            <a href="#" class="dropdown-toggle"
               data-bs-toggle="dropdown">{{ $const.OtherCurrencyUnit }}</a>
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
        <i class="pi pi-verified" />
        <strong>{{ $const.Bonus }}</strong>
      </td>
      <td>
        <a v-if="item.hasBonus" href="#bonus" class="ml-3">
          <i class="pi true-icon pi-check-circle" style="color: green" />
        </a>
        <i v-else class="pi false-icon pi-times-circle" />
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.detail-list-icon {
  margin-right: 0.25rem;
  font-size: 1.3rem;
}
</style>