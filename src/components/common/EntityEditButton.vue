<script setup lang="ts">
import {useUserStore} from "@/store/user";
import {defineProps} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps({
  func: {
    type: Function,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: false,
    default: 'right: 0'
  },
  label: {
    type: String,
    required: false,
    default: 'Edit'
  }
});

const userStore = useUserStore();
</script>

<template>
  <div v-if="userStore.user">
    <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
            @click="props.func" :style="position" size="small"
            v-tooltip.bottom="{value: t(label), class: 'short-tooltip'}">
      <template #icon>
        <span class="material-symbols-outlined">{{ icon }}</span>
      </template>
    </Button>
  </div>
</template>

<style scoped lang="scss">

</style>