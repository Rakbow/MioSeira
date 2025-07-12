<script setup lang="ts">
import {defineProps} from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
});
</script>

<template>
  <div class="item-pop-over">
    <div class="item-pop-over-preview"
         :style="`background:transparent url(${item.cover}) no-repeat center bottom / cover`"></div>
    <ul class="item-pop-over-data">
      <li class="item-pop-title">{{ item.name }}</li>
      <li>{{ item.releaseDate }}</li>
      <li>
        <i class="pi pi-tag"/>&nbsp;
        <span class="item-pop-category">
              <strong>{{ item.type.label }}</strong>
              &rtrif; {{ item?.subType.label }}
            </span>
      </li>
      <li v-if="item.price">{{ `${item.price} ${item.currency}` }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
$pop-border-radius: 6px;
$pop-down-border-radius: 0 0 6px 6px;

.item-pop {
  &-over {
    border-radius: $pop-border-radius;
    width: 192px;
    height: 256px;
    position: relative;

    ul {
      list-style: none !important;
      padding-left: 5px !important;
    }

    ul li {
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 2px 0;

      > i {
        font-size: 10px
      }
    }
  }

  &-over-preview {
    border-radius: $pop-border-radius;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &-over-data {
    border-radius: $pop-down-border-radius;
    background: linear-gradient(to bottom, rgba(44, 44, 44, .5), #2c2c2c);
    position: absolute;
    overflow: hidden;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0;
    margin-bottom: 0;
  }

  &-title {
    padding-top: .5rem;
    display: -webkit-box; /* 必须配合 -webkit-line-clamp 使用 */
    -webkit-box-orient: vertical; /* 设置为纵向排列 */
    -webkit-line-clamp: 4; /* 限制显示的行数 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示 "..." */
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
  }

  &-category {
    display: inline-block;
    line-height: 16px;
    font-size: 11px;
  }
}
</style>