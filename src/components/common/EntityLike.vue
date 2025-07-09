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
  const res = await Axios.post(API.ENTITY.LIKE, param.value.data);
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
  <div>
    <Button @click="like" link v-tooltip.bottom="{value: t('Like'), class: 'short-tooltip'}" :disabled="param.block">
      <i class="pi" :class="{'pi-thumbs-up-fill': liked, 'pi-thumbs-up': !liked}"/>
    </Button>
    <span>{{ likeCount }}</span>
  </div>
</template>

<style scoped lang="scss">
span {
  font-size: 1.4rem
}
i {
  font-size: 1.7rem
}
</style>