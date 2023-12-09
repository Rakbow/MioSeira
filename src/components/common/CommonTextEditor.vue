<template>
  <BlockUI :blocked="editBlock">
    <MdEditor v-model="text" preview-theme="github"/>
    <div class="text-end mt-3 mb-2">
      <Button icon="pi pi-times" :label="$const.Cancel" @click="close"
              class="p-button-text"/>
      <Button icon="pi pi-save" :label="$const.Save" @click="submit"/>
    </div>
    <Panel>
      <div v-if="images.length > 0">
        <DataTable :value="images" class="p-datatable-sm" striped-rows>
          <template #header>
            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
              <span class="text-xl text-900 font-bold">{{ $const.Images }}</span>
            </div>
          </template>
          <Column header-style="width: 5%">
            <template #body="slotProps">
              <Button icon="pi pi-copy" @click="copyImageUrl(slotProps.data.url)"></Button>
            </template>
          </Column>
          <Column :header="$const.Image" header-style="width: 8%">
            <template #body="slotProps">
              <img :src="slotProps.data.thumbUrl50" :alt="slotProps.data.nameEn"
                   class="edit-image"/>
            </template>
          </Column>
          <Column field="nameZh" :header="$const.NameZh" header-style="width: 10%"></Column>
          <Column field="nameEn" :header="$const.NameEn" header-style="width: 10%"></Column>
          <Column field="description" :header="$const.Description" header-style="width: 20%"></Column>
        </DataTable>
      </div>
      <div v-else>
        <span class="emptyInfo"><em>{{ $const.NoImage }}</em></span>
      </div>
    </Panel>
  </BlockUI>
</template>

<script setup>
import {MdEditor} from "md-editor-v3";
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
const text = ref('');
const type = ref('');
const images = ref([]);
// const emit = defineEmits(['update']);
const isUpdate = ref(false);
const route = useRoute();

onMounted(() => {
  text.value = dialogRef.value.data.text;
  type.value = dialogRef.value.data.type;
  images.value = dialogRef.value.data.images;
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
const copyImageUrl = (url) => {
  PublicHelper.copyToClip(url + '?imageMogr2/auto-orient/thumbnail/400x400');
}

const submit = () => {
  editBlock.value = true;
  let url;
  let json = {
    entityType: entityType.value,
    entityId: entityId.value,
    text: text.value
  };

  if (type.value === 'desc') {
    url = API.UPDATE_DETAIL;
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