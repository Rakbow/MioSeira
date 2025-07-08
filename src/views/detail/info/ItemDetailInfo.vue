<script setup lang="ts">
import {defineAsyncComponent, defineProps} from "vue";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useI18n} from "vue-i18n";

const ItemExtraInfo = defineAsyncComponent(() => import('@/components/item/ItemExtraInfo.vue'));
const CurrencySelect = defineAsyncComponent(() => import('@/components/global/CurrencySelect.vue'));

const {t} = useI18n();

const props = defineProps<{
  item: any
}>();

</script>

<template>
  <table>
    <tbody>
    <template v-if="item.type === $const.ITEM_TYPE.BOOK">
      <tr>
        <td>
          <b>{{ t('Category') }}</b>
        </td>
        <td>
          <Tag :value="item.subType.label"/>
        </td>
      </tr>
      <tr>
        <td>
          <b>{{ t('Language') }}</b>
        </td>
        <td>
          <Tag :value="item.lang.label"/>
        </td>
      </tr>
    </template>
    <tr v-else-if="[$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(item.type)">
      <td>
        <b>{{ t('Type') }}</b>
      </td>
      <td>
        <Tag :value="item.subType.label"/>
      </td>
    </tr>

    <tr>
      <td>
        <b>{{ t('Releases') }}</b>
      </td>
      <td>
        {{ item.releaseDate }}
        <span :class="'ml-1 fi fi-' + item.region"/>
      </td>
    </tr>

    <tr>
      <td></td>
      <td>
        <template v-if="item.price">
          {{item.price}}
          <CurrencySelect v-model="item.currency" :query="`${item.price}+${item.currency}`"/>
        </template>
        <Tag :value="item.releaseType.label"/>
        <i v-if="item.bonus" class="ml-1 pi pi-star-fill" style="color: yellow" v-tooltip="{value: t('Bonus')}"/>
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        <span v-if="item.catalogId">{{ item.catalogId }}</span>
        <span v-if="item.catalogId && item.barcode">&nbsp;•&nbsp;</span>
        <span v-if="item.barcode">{{ item.barcode }}</span>
      </td>
    </tr>

    <tr>
      <td>
        <b>{{ t('Spec') }}</b>
      </td>
      <td>
        <template v-if="item.type === $const.ITEM_TYPE.ALBUM">
          <span v-if="item.discs">{{ item.discs }}&nbsp;discs,&nbsp;</span>
          <span v-if="item.tracks">{{ item.tracks }}&nbsp;tracks,&nbsp;</span>
          <span v-if="item.runTime">{{ PublicHelper.secondsToTimeFormat(item.runTime) }}</span>
        </template>
        <template v-if="item.type === $const.ITEM_TYPE.BOOK">
          <span v-if="item.size">{{ item.size }},&nbsp;</span>
          <span v-if="item.pages">{{ item.pages }}&nbsp;pages</span>
        </template>
        <template v-if="item.type === $const.ITEM_TYPE.DISC">
          <span v-if="item.discs">{{ item.discs }}&nbsp;discs,&nbsp;</span>
          <span v-if="item.episodes">{{ item.episodes }}&nbsp;episodes,&nbsp;</span>
          <span v-if="item.runTime">{{ PublicHelper.secondsToTimeFormat(item.runTime) }}</span>
        </template>
      </td>
    </tr>

    <template v-if="[$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(item.type)">
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
      <ItemExtraInfo/>
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
@use "flag-icons/css/flag-icons.min.css";
</style>