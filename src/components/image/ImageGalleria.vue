<script setup lang="ts">
import {defineProps} from "vue";
import {useI18n} from "vue-i18n";

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: Number,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(["update:activeIndex", "update:visible"]);
const {t} = useI18n();
const close = () => {
  emit("update:visible", !props.visible);
};
</script>

<template>
    <Galleria :value="images"
              :activeIndex="activeIndex"
              @update:activeIndex="(newVal) => emit('update:activeIndex', newVal)"
              :visible="visible"
              @update:visible="close"
              :numVisible="7" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
      <template #item="slotProps">
        <img :src="slotProps.item.display" :alt="slotProps.item.name" style="width: 100%; display: block"
             oncontextmenu="return false"/>
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumb" :alt="slotProps.item.name" style="display: block"/>
      </template>
      <template #caption="{item}">
        <div class="image-galleria-footer">
          <div class="col-6">
                <span v-if="images" class="title-container">
                  <span>{{ `${activeIndex + 1}/${images.length}` }}</span>
                  <span class="title">{{ item.name }}</span>
                  <span style="font-size: 10px">{{ item.detail }}</span>
              </span>
          </div>
          <div class="col-6 text-end">
              <span v-if="images">
                  <span>{{ t('UploadIn') + item!.addedTime }}</span>
              </span>
          </div>
        </div>
      </template>
    </Galleria>
</template>

<style scoped lang="scss">

.image-galleria-footer {
  display: flex;
  align-items: center;
  /*background-color: rgba(0, 0, 0, 0.9);*/
  color: #ffffff;
  > button {
    background-color: transparent;
    color: #ffffff;
    border: 0 none;
    border-radius: 0;
    margin: .2rem 0;
  }
  > button.fullscreen-button {
    margin-left: auto;
  }
  > button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.title-container > span {
  font-size: .9rem;
  padding-left: .829rem;
}

.title-container > span.title {
  font-weight: bold;
}

.p-galleria-content {
  position: relative;
}

.p-galleria-thumbnail-content {
  height: 100px;
  width: 100px;
}
</style>