<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {useDialog} from "primevue/usedialog";
import {useRoute} from "vue-router";
import {EntityInfo, META} from '@/config/Web_Const.ts';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {useI18n} from "vue-i18n";
import {AlbumTrack, AlbumDisc, parseAlbumTracks} from "@/logic/albumService";
import {PublicHelper} from "@/toolkit/publicHelper";
import {API} from "@/config/Web_Helper_Strs";

const entityInfo = ref<EntityInfo>();
const {t} = useI18n();
const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const route = useRoute();
const editBlock = ref(false);
const isUpdate = ref(false);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});

const loading = ref();
const disc = {
  id: entityInfo.value?.id,
  serial: 1,
  tracks: []
};
const analysisInput = ref();
const parseDisc = () => {
  loading.value = true;
  disc.id = entityInfo.value?.id;
  disc.tracks = parseAlbumTracks(analysisInput.value);
  loading.value = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: isUpdate.value
      }
  );
}

const submit = async () => {
  editBlock.value = true;
  const res = await axios.post(API.QUICK_ADD_ALBUM_DISC, disc);
  if (res.state === axios.SUCCESS) {
    toast.add({severity: 'success', detail: res.message, life: 3000});
    isUpdate.value = true;
    close();
  } else {
    toast.add({severity: 'error', detail: res.message, life: 3000});
  }
  editBlock.value = false;
}

</script>

<template>
  <BlockUI :blocked="editBlock">
    <div class="field">
      <Textarea class="w-full" size="small" rows="6" v-model="analysisInput"/>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ $t('AlbumDetailEditTrackDiscIndex') }}</label>
          <InputNumber size="small" v-model="disc.serial" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <Button size="small" icon="pi pi-sync" class="p-button-warning"
                @click="parseDisc" :title="$t('Analysis')"/>
      </div>
    </div>
    <DataTable ref="dt" :value="disc.tracks" class="p-datatable-sm" :loading="loading"
               alwaysShowPaginator paginator :rows="50" stripedRows size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}"
               scrollable scrollHeight="400px" responsiveLayout="scroll">
      <template #empty>
        <span class="emptyInfo">
            {{ $t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ $t('CommonDataTableLoadingInfo') }}</span>
      </template>
      <Column :header="$t('Index')" field="serial" style="flex: 0 0 10rem"/>
      <Column :header="$t('Name')" field="title" style="flex: 0 0 10rem"/>
      <Column :header="$t('Duration')" field="duration" style="flex: 0 0 10rem"/>
    </DataTable>
    <div class="relative">
      <div class="bottom-0 right-0">
        <Button icon="pi pi-times" :label="$t('Cancel')" @click="close"
                class="p-button-text"/>
        <Button icon="pi pi-save" :label="$t('Save')" @click="submit"/>
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>