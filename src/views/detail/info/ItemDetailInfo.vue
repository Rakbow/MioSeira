<script setup lang="ts">
import {defineAsyncComponent, defineProps} from "vue";
import {PublicHelper} from "@/utils/publicHelper";
import {useI18n} from "vue-i18n";

const ItemExtraInfo = defineAsyncComponent(() => import('@/components/item/ItemExtraInfo.vue'));
const Currency = defineAsyncComponent(() => import('@/components/global/Currency.vue'));

const {t} = useI18n();

const props = defineProps<{
  item: any
}>();

</script>

<template>
  <table>
    <tbody>
    <tr v-if="[$const.ITEM_TYPE.BOOK, $const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(item.type)">
      <td>
        <b>{{ t('Type') }}</b>
      </td>
      <td>
        <Tag :value="item.subType.label"
             :style="`color: var(--r-item-${item.type.value}-${item.subType.value})`"/>
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
          <Currency v-model="item.currency" :query="`${item.price}+${item.currency}`"/>
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
        <template v-if="[$const.ITEM_TYPE.ALBUM, $const.ITEM_TYPE.VIDEO].includes(item.type.value)">
          <span v-if="item.discs">{{ item.discs }}&nbsp;discs,&nbsp;</span>
          <span v-if="item.episodes">{{ item.episodes }}&nbsp;tracks,&nbsp;</span>
          <span v-if="item.runTime">{{ PublicHelper.secondsToTimeFormat(item.runTime) }}</span>
        </template>
        <template v-if="item.type.value === $const.ITEM_TYPE.BOOK">
          <span v-if="item.scale">{{ item.scale }},&nbsp;</span>
          <span v-if="item.pages">{{ item.pages }}&nbsp;pages</span>
        </template>
<!--        <template v-if="item.type.value === $const.ITEM_TYPE.VIDEO">-->
<!--          <span v-if="item.discs">{{ item.discs }}&nbsp;discs,&nbsp;</span>-->
<!--          <span v-if="item.episodes">{{ item.episodes }}&nbsp;episodes,&nbsp;</span>-->
<!--          <span v-if="item.runTime">{{ PublicHelper.secondsToTimeFormat(item.runTime) }}</span>-->
<!--        </template>-->
      </td>
    </tr>

    <template v-if="[$const.ITEM_TYPE.GOODS, $const.ITEM_TYPE.FIGURE].includes(item.type.value)">
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