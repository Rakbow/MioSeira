<script setup lang="ts">
import {inject, ref} from "vue";
import {useI18n} from "vue-i18n";
import {AlbumTrack, parseAlbumTracks} from "@/service/itemService";
import {API, Axios} from "@/api";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const entity = inject<Entity>('entity')!;
const {t} = useI18n();
const dialogRef = inject<any>("dialogRef");
const param = ref(new EditParam());
const tracks = ref<AlbumTrack[]>([]);
const discNo = ref(1);
const loading = ref();
const analysisInput = ref<string>('');
const parseDisc = () => {
  loading.value = true;
  tracks.value.push(...parseAlbumTracks(analysisInput.value));
  loading.value = false;
}

const close = () => {
  dialogRef.value.close(
      {
        isUpdate: param.value.isUpdate
      }
  );
}

const submit = async () => {
  param.value.block = true;
  const res = await Axios.post(API.ALBUM_TRACK_QUICK_CREATE, {
    id: entity!.id,
    tracks: tracks.value
  });
  if (res.success()) {
    bs!.toast.success(res.message);
    param.value.isUpdate = true;
    close();
  } else {
    bs!.toast.error(res.message);
  }
  param.value.block = false;
}

</script>

<template>
  <BlockUI :blocked="param.block">
    <div class="field">
      <Textarea class="w-full" size="small" rows="6" v-model="analysisInput"/>
    </div>
    <div class="formgrid grid">
      <div class="field col">
        <FloatLabel variant="on">
          <label>{{ t('Index') }}</label>
          <InputNumber size="small" v-model="discNo" class="static w-full"/>
        </FloatLabel>
      </div>
      <div class="field col">
        <Button size="small" icon="pi pi-sync" class="p-button-warning"
                @click="parseDisc" :title="t('Analysis')"/>
      </div>
    </div>
    <DataTable ref="dt" :value="tracks" :loading="loading"
               alwaysShowPaginator paginator :rows="50" stripedRows size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;"
               scrollable scrollHeight="400px" responsiveLayout="scroll">
      <template #empty>
        <span class="emptyInfo">
            {{ t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ t('CommonDataTableLoadingInfo') }}</span>
      </template>
      <Column :header="t('Disc')" field="discNo" style="flex: 0 0 10rem"/>
      <Column :header="t('Index')" field="serial" style="flex: 0 0 10rem"/>
      <Column :header="t('Name')" field="title" style="flex: 0 0 10rem"/>
      <Column :header="t('Duration')" field="duration" style="flex: 0 0 10rem"/>
    </DataTable>
    <div class="relative">
      <div class="bottom-0 right-0">
        <Button icon="pi pi-times" :label="t('Cancel')" @click="close"
                class="p-button-text"/>
        <Button icon="pi pi-save" :label="t('Save')" @click="submit"/>
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>