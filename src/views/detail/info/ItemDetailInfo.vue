<script setup lang="ts">
import {defineProps} from "vue";
import {META} from '@/config/Web_Const';
import "flag-icons/css/flag-icons.min.css";
import {PublicHelper} from "@/toolkit/publicHelper";
import ItemExtraInfo from "@/components/item/ItemExtraInfo.vue";
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
    <tr v-if="[META.ITEM_TYPE.ALBUM, META.ITEM_TYPE.DISC].includes(item.type)">
      <td>
        <b>{{ t('MediaFormat') }}</b>
      </td>
      <td v-for="format of item.mediaFormat" style="display:inline">
        <Tag class="ml-1" :value="format.label"/>
      </td>
    </tr>
    <tr v-if="item.type === META.ITEM_TYPE.ALBUM">
      <td>
        <b>{{ t('AlbumFormat') }}</b>
      </td>
      <td v-for="format of item.albumFormat" style="display:inline">
        <Tag class="ml-1" :value="format.label"/>
      </td>
    </tr>
    <template v-if="item.type === META.ITEM_TYPE.BOOK">
      <tr>
        <td>
          <b>{{ t('BookType') }}</b>
        </td>
        <td>
          <a :href="'/db/manager/book?bookType=' + item.subType.value">
            <Tag class="ml-1" :value="item.subType.label"/>
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <b>{{ t('PublishLanguage') }}</b>
        </td>
        <td>
          <a :href="'/db/manager/book?lang=' + item.lang.value">
            <Tag class="ml-1" :value="item.lang.label"></Tag>
          </a>
        </td>
      </tr>
    </template>
    <tr v-if="[META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(item.type)">
      <td>
        <b>{{ t('Type') }}</b>
      </td>
      <td>
        <Tag class="ml-1" :value="item.subType.label"/>
      </td>
    </tr>

    <tr>
      <td>
        <b>{{ t('Releases') }}</b>
      </td>
      <td>
        {{ item.releaseDate }}
        <span v-if="[META.ITEM_TYPE.ALBUM, META.ITEM_TYPE.DISC, META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(item.type)"
            :class="'ml-1 mr-1 fi fi-' + item.region"/>
        <Tag v-if="[META.ITEM_TYPE.BOOK].includes(item.type)"
             class="ml-1" :value="item.releaseType.label"/>
      </td>
    </tr>


    <tr>
      <td></td>
      <td>
        <template v-if="[META.ITEM_TYPE.BOOK, META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(item.type)">
          {{ item.barcode }}
          <span v-if="item.type === META.ITEM_TYPE.BOOK" :class="'fi fi-' + item.region" style="margin-left: 0.5rem" />
        </template>

        {{ item.price !== 0 ? item.price : "&nbsp;&nbsp;-" }}
        <span v-if="item.price !== 0">
          <span class="dropdown">
            <a href="#" class="dropdown-toggle"
               data-bs-toggle="dropdown">
              <span v-if="item.currency === 'JPY'"
                    v-tooltip="{value: t('TaxInclusive'), class: 'region-tooltip'}">JPY</span>
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
        <i v-if="item.bonus" v-tooltip.bottom="{value: t('Bonus'), class: 'short-tooltip'}"
           class="ml-1 pi pi-star-fill" style="color: #b7b71e"/>
      </td>
    </tr>
    <tr v-if="[META.ITEM_TYPE.ALBUM, META.ITEM_TYPE.DISC].includes(item.type)">
      <td></td>
      <td>
        {{ item.catalogId }}&nbsp;•&nbsp;{{ item.barcode }}
      </td>
    </tr>

    <tr>
      <td>
        <b>{{ t('Spec') }}</b>
      </td>
      <td>
        <template v-if="item.type === META.ITEM_TYPE.ALBUM">
          <span v-if="item.discs">{{ item.discs }}&nbsp;discs,&nbsp;</span>
          <span v-if="item.tracks">{{ item.tracks }}&nbsp;tracks,&nbsp;</span>
          <span v-if="item.runTime">{{ PublicHelper.secondsToTimeFormat(item.runTime) }}</span>
        </template>
        <template v-if="item.type === META.ITEM_TYPE.BOOK">
          <span v-if="item.size">{{ item.size }},&nbsp;</span>
          <span v-if="item.pages">{{ item.pages }}&nbsp;pages</span>
        </template>
        <template v-if="item.type === META.ITEM_TYPE.DISC">
          <span v-if="item.discs">{{ item.discs }}&nbsp;discs,&nbsp;</span>
          <span v-if="item.episodes">{{ item.episodes }}&nbsp;episodes,&nbsp;</span>
          <span v-if="item.runTime">{{ PublicHelper.secondsToTimeFormat(item.runTime) }}</span>
        </template>
      </td>
    </tr>

    <template v-if="[META.ITEM_TYPE.GOODS, META.ITEM_TYPE.FIGURE].includes(item.type)">
      <tr v-if="item.versions.length">
        <td>
          <b>{{ t('Version') }}</b>
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
      <ItemExtraInfo :id="item.id" />
    </template>

    <tr v-if="item.spec">
      <td>
        <b>{{ t('Dimensions') }}</b>
      </td>
      <td>
        <span>{{ item.spec }}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
</style>