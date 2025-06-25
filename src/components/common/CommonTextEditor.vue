<template>
  <BlockUI :blocked="editBlock">
    <MdEditor v-model="text" preview-theme="github"/>
    <div class="text-end mt-3 mb-2">
      <Button icon="pi pi-times" :label="t('Cancel')" @click="close"
              class="p-button-text"/>
      <Button icon="pi pi-save" :label="t('Save')" @click="submit"/>
    </div>
<!--    <Panel>-->
<!--      <div v-if="images.length > 0">-->
<!--        <DataTable :value="images" class="p-datatable-sm" striped-rows>-->
<!--          <template #header>-->
<!--            <div class="flex flex-wrap align-items-center justify-content-between gap-2">-->
<!--              <span class="text-xl text-900 font-bold">{{ t('Images') }}</span>-->
<!--            </div>-->
<!--          </template>-->
<!--          <Column header-style="width: 5%">-->
<!--            <template #body="slotProps">-->
<!--              <Button icon="pi pi-copy" @click="copyImageUrl(slotProps.data.url)"></Button>-->
<!--            </template>-->
<!--          </Column>-->
<!--          <Column :header="t('Image')" header-style="width: 8%">-->
<!--            <template #body="slotProps">-->
<!--              <img :src="slotProps.data.thumb" :alt="slotProps.data.nameEn"-->
<!--                   class="entry-thumb"/>-->
<!--            </template>-->
<!--          </Column>-->
<!--          <Column field="nameZh" :header="t('NameZh')" header-style="width: 10%" />-->
<!--          <Column field="nameEn" :header="t('NameEn')" header-style="width: 10%" />-->
<!--          <Column field="description" :header="t('Description')" header-style="width: 20%" />-->
<!--        </DataTable>-->
<!--      </div>-->
<!--      <div v-else>-->
<!--        <span class="emptyInfo"><em>{{ t('NoImage') }}</em></span>-->
<!--      </div>-->
<!--    </Panel>-->
  </BlockUI>
</template>

<script setup lang="ts">
import {MdEditor} from "md-editor-v3";
import {onMounted, ref, inject, onBeforeMount} from "vue";
import {PublicHelper} from '@/toolkit/publicHelper.ts';
import {AxiosHelper as axios} from '@/toolkit/axiosHelper.ts';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs.ts';
import {EntityInfo, META} from '@/config/Web_Const.ts';
import { useRoute } from 'vue-router';
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const text = ref('');
const type = ref('');
const images = ref([]);
// const emit = defineEmits(['update']);
const isUpdate = ref(false);
const route = useRoute();
const entityInfo = ref<EntityInfo>();

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted(() => {
  text.value = dialogRef.value.data.text;
  type.value = dialogRef.value.data.type;
  // loadImages();
});

const editBlock = ref(false);
const copyImageUrl = (url) => {
  PublicHelper.copyToClip(url + '?imageMogr2/auto-orient/thumbnail/400x400');
}

const submit = () => {
  editBlock.value = true;
  let json = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    text: text.value
  };
  axios.post(API.ENTITY_UPDATE_DETAIL, json)
      .then(res => {
        if (res.state === axios.SUCCESS) {
          toast.add({severity: 'success', detail: res.message, life: 3000});
          isUpdate.value = true;
          close();
        } else {
          toast.add({severity: 'error', detail: res.message, life: 3000});
        }
        editBlock.value = false;
      })
}

const close = () => {
  // emit('update', isUpdate.value)
  dialogRef.value.close(
      {
        isUpdate: isUpdate.value,
        text: text.value
      }
  );
}

const loadImages = async () => {
  editBlock.value = true;
  let param = {
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id
  }
  const res = await axios.post(API.IMAGE_LIST, param);
  if(res.state === axios.SUCCESS) {
    images.value = res.data.images;
    editBlock.value = false;
  }else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
    editBlock.value = false;
  }
}

</script>

<style scoped>

</style>