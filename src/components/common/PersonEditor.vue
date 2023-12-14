<script setup>
import {onMounted, ref, inject} from "vue";
import {PublicHelper} from '@/utils/publicHelper';
import {AxiosHelper} from '@/utils/axiosHelper';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs';
import { useRoute } from 'vue-router';

const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const personnel = ref([]);
// const emit = defineEmits(['update']);
const isUpdate = ref(false);
const route = useRoute();

onMounted(() => {
  personnel.value = dialogRef.value.data.images;
  getEntityInfo();
});

const entityType = ref();
const entityId = ref();
const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}

const editBlock = ref(false);
</script>

<template>

</template>

<style scoped>

</style>