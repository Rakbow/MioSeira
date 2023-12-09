<script setup>
import {defineProps, onMounted, ref} from "vue";
import {API} from '@/config/Web_Helper_Strs';
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {PublicHelper} from "@/utils/publicHelper";
import {useRoute} from "vue-router";
import {useToast} from 'primevue/usetoast';

const route = useRoute();
const toast = useToast();
const editBlock = ref(false);
const entityType = ref();
const entityId = ref();
const liked = ref(false);
const likeCount = ref(0);
onMounted(() => {
  getEntityInfo();
  liked.value = props.liked;
  likeCount.value = props.likeCount;
});

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}

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
  let json = {
    entity: entityType.value,
    entityId: entityId.value
  };
  const res = await axios.post(API.LIKE_ITEM, json);
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
  <div class="item_statistic_info">
    <Button class="p-button-link" @click="like" v-tooltip.bottom="{value: $const.Like, class: 'short-tooltip'}">
      <i class="pi" :class="{'pi-thumbs-up-fill': liked, 'pi-thumbs-up': !liked}"></i>
    </Button>
    <span class="ml-1 mr-2">{{ likeCount }}</span>
  </div>
</template>

<style scoped>

</style>