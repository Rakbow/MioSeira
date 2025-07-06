<script setup lang="ts">
import {defineProps, inject, onMounted, ref} from "vue";
import {API, Axios} from '@/api';
import {useI18n} from "vue-i18n";

import {bs} from '@/service/baseService';
import {EditParam} from "@/service/entityService";

const {t} = useI18n();
const entity = inject<Entity>('entity')!;
const param = ref(new EditParam());
const liked = ref(false);
const likeCount = ref(0);

onMounted(() => {
  liked.value = props.liked;
  likeCount.value = props.likeCount;
});

const props = defineProps({
  liked: {
    type: Boolean,
    required: true
  },
  likeCount: {
    type: Number,
    required: true,
    default: () => (0)
  }
});

const like = async () => {
  param.value.block = true;
  param.value.data = {
    entityType: entity.type,
    entityId: entity.id
  };
  const res = await Axios.post(API.ENTITY_LIKE, param.value.data);
  if (res.success()) {
    likeCount.value++;
    liked.value = true;
    bs!.toast.success(res.message);
  } else {
    bs!.toast.error(res.message);
  }
  param.value.block = false;
};
</script>

<template>
  <div class="justify-content-center mt-1">
    <Button class="p-button-link" @click="like" v-tooltip.bottom="{value: t('Like'), class: 'short-tooltip'}" :disabled="param.block">
      <i style="font-size: 1.7rem" class="pi" :class="{'pi-thumbs-up-fill': liked, 'pi-thumbs-up': !liked}"/>
    </Button>
    <span style="font-size: 1.4rem">{{ likeCount }}</span>
  </div>
</template>

<style scoped>

</style>