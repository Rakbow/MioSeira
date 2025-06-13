<script setup lang="ts">
import {defineProps, onBeforeMount, onMounted, ref} from "vue";
import {API} from '@/config/Web_Helper_Strs.ts';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useToast} from 'primevue/usetoast';
import {useI18n} from "vue-i18n";
import {EntityInfo} from "@/config/Web_Const";

const entityInfo = ref<EntityInfo>();
const {t} = useI18n();
const route = useRoute();
const toast = useToast();
const editBlock = ref(false);
const liked = ref(false);
const likeCount = ref(0);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});

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
  editBlock.value = true;
  let param = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id
  };
  const res = await axios.post(API.LIKE_ENTITY, param);
  if (res.state === axios.SUCCESS) {
    likeCount.value++;
    liked.value = true;
    toast.add({severity: 'success', detail: res.message, life: 3000});
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  editBlock.value = false;
};
</script>

<template>
  <Button class="p-button-link" @click="like" v-tooltip.bottom="{value: $t('Like'), class: 'short-tooltip'}">
    <i class="pi" :class="{'pi-thumbs-up-fill': liked, 'pi-thumbs-up': !liked}"></i>
  </Button>
  <span class="ml-1 mr-2">{{ likeCount }}</span>
</template>

<style scoped>

</style>