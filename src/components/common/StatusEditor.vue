<script setup lang="ts">
import {useUserStore} from "@/store/user";
import {defineProps, onBeforeMount, onMounted, ref} from "vue";
import {API} from '@/config/Web_Helper_Strs';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useToast} from 'primevue/usetoast';
import {EntityInfo} from "@/config/Web_Const.js";

const route = useRoute();
const userStore = useUserStore();
const toast = useToast();
const editBlock = ref(false);
const status = ref();
const entityInfo = ref<EntityInfo>();

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted(() => {
  status.value = props.status;
});

const props = defineProps({
  status: {
    type: Boolean,
    required: true
  }
});

const updateStatus = async () => {
  editBlock.value = true;
  let json = {
    entity: entityInfo.value?.type,
    ids: [entityInfo.value?.id],
    status: !status.value
  };
  const res = await axios.post(API.ENTITY_UPDATE_STATUS, json);
  if (res.state === axios.SUCCESS) {
    toast.add(new PToast().success(res.message));
  } else {
    toast.add(new PToast().error(res.message));
  }
  editBlock.value = false;
};
</script>

<template>
  <div v-if="userStore.user">
    <div class="item_status_edit" style="top: .5rem;right: .5rem" v-if="userStore.user.type > 2 || userStore.user.type === 0">
      <ToggleSwitch v-model="status" @click="updateStatus" />
    </div>
  </div>
</template>

<style scoped>

</style>