<script setup>
import {useUserStore} from "@/store/user";
import {defineProps, onMounted, ref} from "vue";
import {API} from '@/config/Web_Helper_Strs';
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {PublicHelper} from "@/utils/publicHelper";
import {useRoute} from "vue-router";
import {useToast} from 'primevue/usetoast';

const route = useRoute();
const userStore = useUserStore();
const toast = useToast();
const editBlock = ref(false);
const entityType = ref();
const entityId = ref();
const status = ref();
onMounted(() => {
  getEntityInfo();
  status.value = props.status;
});

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}

const props = defineProps({
  status: {
    type: Boolean,
    required: true
  }
});

const updateStatus = async () => {
  editBlock.value = true;
  let json = {
    entity: entityType.value,
    ids: [entityId.value],
    status: !status.value
  };
  const res = await axios.post(API.UPDATE_ITEMS_STATUS, json);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  editBlock.value = false;
};
</script>

<template>
  <div v-if="userStore.user">
    <div class="item_status_edit" v-if="userStore.user.type > 2 || userStore.user.type === 0">
      <InputSwitch v-model="status" @click="updateStatus" />
    </div>
  </div>
</template>

<style scoped>

</style>