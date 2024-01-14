<script setup>
import {defineProps, getCurrentInstance, ref} from "vue";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;

const props = defineProps({
  album: {
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
        <i class="pi material-symbols-outlined">tag</i>
        <strong>{{ $const.AlbumCatalogNo }}</strong>
      </td>
      <td>
        {{ album.catalogNo ? album.catalogNo : "N/A" }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi material-symbols-outlined">barcode</i>
        <strong>{{ $const.Barcode }}</strong>
      </td>
      <td>{{ album.barcode ? album.barcode : "N/A" }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-calendar"></i>
        <strong>{{ $const.ReleaseDate }}</strong>
      </td>
      <td>
        {{ album.releaseDate ? album.releaseDate : "N/A" }}
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-tag"></i>
        <strong>{{ $const.ReleasePrice }}</strong>
      </td>
      <td>
        {{ album.price !== 0 ? album.price : "&nbsp;&nbsp;-" }}
        <span v-if="album.price !== 0">
          <span v-if="album.currencyUnit === 'JPY'" class="ml-1"
                style="text-decoration-line: underline;text-decoration-style: dashed;"
                v-tooltip.right="{value: $const.TaxInclusive, class: 'region-tooltip'}">JPY</span>
          <span v-else>{{ album.currencyUnit }}</span>
          <span class="ml-2 dropdown">
            <a href="#" class="dropdown-toggle"
               data-bs-toggle="dropdown">{{ $const.OtherCurrencyUnit }}</a>
            <div class="dropdown-menu">
                <a :href="`https://www.bing.com/search?q=${album.price}+${album.currencyUnit}+IN+CNY`"
                   class="dropdown-item">CNY</a>
                <a :href="`https://www.bing.com/search?q=${album.price}+${album.currencyUnit}+IN+USD`"
                   class="dropdown-item">USD</a>
                <a :href="`https://www.bing.com/search?q=${album.price}+${album.currencyUnit}+IN+EUR`"
                   class="dropdown-item">EUR</a>
                <a :href="`https://www.bing.com/search?q=${album.price}+${album.currencyUnit}+IN+TWD`"
                   class="dropdown-item">TWD</a>
            </div>
          </span>
      </span>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi material-symbols-outlined detail-list-icon">workspace_premium</i>
        <strong>{{ $const.Bonus }}</strong>
      </td>
      <td>
        <a v-if="album.hasBonus" href="#bonus" class="ml-3">
          <i class="pi true-icon pi-check-circle"></i>
        </a>
        <i v-else class="pi false-icon pi-times-circle"></i>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi pi-print"></i>
        <strong>{{ $const.PublishFormat }}</strong>
      </td>
      <td v-for="format of album.publishFormat" style="display:inline">
        <a :href="'/db/albums?publishFormat=' + format.value">
          <Tag class="ml-1" :value="format.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi iconfont icon-zhuanjiguangpan"></i>
        <strong>{{ $const.MediaFormat }}</strong>
      </td>
      <td v-for="format of album.mediaFormat" style="display:inline">
        <a :href="'/db/albums?mediaFormat=' + format.value">
          <Tag class="ml-1" :value="format.label"></Tag>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <i class="pi iconfont icon-musicfill"></i>
        <strong>{{ $const.AlbumFormat }}</strong>
      </td>
      <td v-for="format of album.albumFormat" style="display:inline">
        <a :href="'/db/albums?albumFormat=' + format.value">
          <Tag class="ml-1" :value="format.label"></Tag>
        </a>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>