<template>
  <BlockUI :blocked="editBlock">
    <MdEditor v-model="text" preview-theme="github"/>
    <div class="text-end mt-3 mb-2">
      <Button icon="pi pi-times" :label="$constant.Cancel" @click="close"
              class="p-button-text"/>
      <Button icon="pi pi-save" :label="$constant.Save" @click="submit"/>
    </div>
    <Panel>
      <div v-if="images.length > 0">
        <DataTable :value="images" class="p-datatable-sm" striped-rows>
          <template #header>
            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
              <span class="text-xl text-900 font-bold">{{ $constant.Images }}</span>
            </div>
          </template>
          <Column header-style="width: 5%">
            <template #body="slotProps">
              <Button icon="pi pi-copy" @click="copyImageUrl(slotProps.data.url)"></Button>
            </template>
          </Column>
          <Column :header="$constant.Image" header-style="width: 8%">
            <template #body="slotProps">
              <img :src="slotProps.data.thumbUrl50" :alt="slotProps.data.nameEn"
                   class="edit-image"/>
            </template>
          </Column>
          <Column field="nameZh" :header="$constant.NameZh" header-style="width: 10%"></Column>
          <Column field="nameEn" :header="$constant.NameEn" header-style="width: 10%"></Column>
          <Column field="description" :header="$constant.Description" header-style="width: 20%"></Column>
        </DataTable>
      </div>
      <div v-else>
        <span class="emptyInfo"><em>{{ $constant.NoImage }}</em></span>
      </div>
    </Panel>
  </BlockUI>
</template>

<script setup>
import {MdEditor} from "md-editor-v3";
import {onMounted, ref, inject, defineEmits} from "vue";
import {PublicHelper} from '@/utils/publicHelper';
import {AxiosHelper} from '@/utils/axiosHelper';
import {useToast} from "primevue/usetoast";
import {useDialog} from 'primevue/usedialog';
import {API} from '@/config/Web_Helper_Strs';

const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const text = ref('');
const type = ref('');
const images = ref([]);
// const emit = defineEmits(['update']);
const isUpdate = ref(false);

onMounted(() => {
  text.value = dialogRef.value.data.text;
  type.value = dialogRef.value.data.type;
  images.value = dialogRef.value.data.images;
});

const editBlock = ref(false);
const copyImageUrl = (url) => {
  PublicHelper.copyToClip(url + '?imageMogr2/auto-orient/thumbnail/400x400');
}

const submit = () => {
  editBlock.value = true;
  let url;
  let json = {
    entityType: dialogRef.value.data.entityType,
    entityId: dialogRef.value.data.entityId,
    text: text.value
  };

  if (type.value === 'desc') {
    url = API.UPDATE_DESCRIPTION;
  } else if (type.value === 'bonus') {
    url = API.UPDATE_BONUS;
  }

  AxiosHelper.post(url, json)
      .then(res => {
        if (res.state === 1) {
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

</script>

<style scoped>

</style>