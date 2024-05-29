<script setup>
import {defineProps, getCurrentInstance} from "vue";
import {META} from '@/config/Web_Const.ts';
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
        <i class="pi pi-hashtag" />
        <strong>{{ $const.AlbumCatalogNo }}</strong>
      </td>
      <td>
        {{ item.catalogNo ? item.catalogNo : "N/A" }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-barcode" />
        <strong>{{ $const.Barcode }}</strong>
      </td>
      <td>{{ item.ean13 ? item.ean13 : "N/A" }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-calendar"></i>
        <strong>{{ $const.ReleaseDate }}</strong>
      </td>
      <td>
        {{ item.releaseDate ? item.releaseDate : "N/A" }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-ticket"></i>
        <strong>{{ $const.ReleasePrice }}</strong>
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
    <tr>
      <td>
        <i class="pi pi-print"></i>
        <strong>{{ $const.PublishFormat }}</strong>
      </td>
      <td v-for="format of item.publishFormat" style="display:inline">
        <Tag class="ml-1" :value="format.label"></Tag>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-video" />
        <strong>{{ $const.MediaFormat }}</strong>
      </td>
      <td v-for="format of item.mediaFormat" style="display:inline">
        <Tag class="ml-1" :value="format.label"></Tag>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-tag" />
        <strong>{{ $const.AlbumFormat }}</strong>
      </td>
      <td v-for="format of item.albumFormat" style="display:inline">
        <Tag class="ml-1" :value="format.label"></Tag>
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