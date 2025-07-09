<script setup lang="ts">
import {useUserStore} from "@/store/modules/user";
import {defineProps, inject, onMounted, ref} from "vue";
import {API, Axios} from '@/api'
import {bs} from '@/service/baseService';
import {EditParam} from "@/service/entityService";

const userStore = useUserStore();
const param = ref(new EditParam());
const status = ref();
const entity = inject<Entity>('entity')!;

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
  param.value.block = true;
  param.value.data = {
    entity: entity!.type,
    ids: [entity!.id],
    status: !status.value
  };
  const res = await Axios.post(API.ENTITY.UPDATE_STATUS, param.value.data);
  if (res.success()) {
    bs!.toast.success(res.message);
  } else {
    bs!.toast.error(res.message);
  }
  param.value.block = false;
};
</script>

<template>
  <ToggleSwitch v-model="status" @click="updateStatus" :disabled="param.block" />
</template>

<style scoped>

</style>