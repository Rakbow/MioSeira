<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {useRoute} from "vue-router";
import {EntityInfo} from '@/config/Web_Const';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useI18n} from "vue-i18n";
import {AlbumDisc, parseAlbumTracks} from "@/logic/itemService";
import {PublicHelper} from "@/toolkit/publicHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useEntityStore} from "@/logic/entityService";

const entityInfo = ref<EntityInfo>();
const {t} = useI18n();
const toast = useToast();
const dr = inject<any>("dialogRef");
const route = useRoute();
const block = ref(false);
const upload = ref(false);
const loading = ref();
const analysisInput = ref();
const store = useEntityStore();
const disc = ref(new AlbumDisc());

onBeforeMount(() => {
  if (dr.value.data.mode === 'normal'){
    entityInfo.value = PublicHelper.getEntityInfo(route);
    disc.value.itemId = entityInfo.value!.id;
  }
  disc.value.mediaFormat = store.options.mediaFormatSet[1].value
  disc.value.albumFormat = [store.options.albumFormatSet[0].value]
});
const parseDisc = () => {
  loading.value = true;
  disc.value.tracks.push(...parseAlbumTracks(analysisInput.value));
  analysisInput.value = '';
  loading.value = false;
}

const close = () => {
  dr.value.close(
      {
        upload: upload.value
      }
  );
}

const submit = async () => {
  if (dr.value.data.mode === 'normal') {
    block.value = true;
    const res = await axios.post(API.ALBUM_TRACK_QUICK_CREATE, disc.value);
    if (res.state === axios.SUCCESS) {
      toast.add(new PToast().success(res.message));
      upload.value = true;
      close();
    }
    block.value = false;
  } else if (dr.value.data.mode === 'advance') {
    dr.value.close(
        {
          disc: disc.value
        }
    );
  }


}

</script>

<template>
  <BlockUI :blocked="block">
    <div class="formgrid grid">
    </div>
    <DataTable ref="dt" :value="disc.tracks" :loading="loading"
               alwaysShowPaginator paginator :rows="50" stripedRows size="small"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="{first} to {last} of {totalRecords}"
               scrollable scrollHeight="400px" responsiveLayout="scroll">
      <template #header>
        <div class="field">
          <Textarea class="w-full" size="small" rows="6" v-model="analysisInput"/>
        </div>
        <div class="grid">
          <div class="col">
            <FloatLabel variant="on">
              <label>{{ t('Index') }}</label>
              <InputNumber size="small" v-model="disc.discNo" class="static w-full"/>
            </FloatLabel>
          </div>
          <div class="col">
            <FloatLabel variant="on">
              <label>{{ t('MediaFormat') }}</label>
              <Select v-model="disc.mediaFormat" :options="store.options.mediaFormatSet"
                      size="small" optionLabel="label" optionValue="value" class="static w-full"/>
            </FloatLabel>
          </div>
          <div class="field col" style="max-width: 50px">
            <Button size="small" icon="pi pi-sync" class="p-button-warning"
                    @click="parseDisc" :title="t('Analysis')" :disabled="analysisInput === ''"/>
          </div>
        </div>
        <div class="field">
          <FloatLabel variant="on">
            <label>{{ t('AlbumFormat') }}<i class="required-label pi pi-asterisk"/></label>
            <MultiSelect showClear size="small" v-model="disc.albumFormat" :options="store.options.albumFormatSet"
                         optionLabel="label" optionValue="value" display="chip" class="static w-full"/>
          </FloatLabel>
        </div>
      </template>
      <template #empty>
        <span class="emptyInfo">
            {{ t('CommonDataTableEmptyInfo') }}
        </span>
      </template>
      <template #loading>
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span>{{ t('CommonDataTableLoadingInfo') }}</span>
      </template>
      <Column :header="t('Index')" field="serial" style="flex: 0 0 10rem"/>
      <Column :header="t('Name')" field="name" style="flex: 0 0 10rem"/>
      <Column :header="t('Duration')" field="duration" style="flex: 0 0 10rem"/>
    </DataTable>
    <div class="relative">
      <div class="bottom-0 right-0">
        <Button icon="pi pi-times" size="small" :label="t('Cancel')" @click="close"
                class="p-button-text"/>
        <Button icon="pi pi-save" size="small" :label="t('Save')" @click="submit"/>
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>