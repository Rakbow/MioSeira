<template>
  <div class="entity-detail-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-align-justify"/>
        <b>{{ t('TrackInfo') }}</b>
      </template>

      <div v-permission class="entity-detail-fieldset-actions">
        <RButton @click="openAudioUpload" icon="cloud_upload" tip="Upload" v-if="info.discs.length"/>
        <RButton @click="openQuickCreatorDialog" icon="music_note_add" tip="Add"/>
      </div>

      <div class="album-tracks">
        <div v-if="!loading">
          <div v-if="!info.discs.length">
            <span class="empty-search-result">{{ t('NoTrackInfo') }}</span>
          </div>
          <div v-else>
            <p class="album-tracks-header">
              {{ t('TotalDiscNum') }}:&nbsp;<b>{{ info.discs.length }}</b>&nbsp;
              {{ t('TotalTrackNum') }}:&nbsp;<b>{{ info.totalTracks }}</b>&nbsp;
              {{ t('TotalLength') }}:&nbsp;<b>{{ info.totalDuration }}</b>
            </p>
            <div v-for="disc in info.discs as any[]" class="album-tracks-disc">
              <AlbumTrackTable :disc="disc" />
            </div>
          </div>
        </div>

        <div v-else>
          <Skeleton width="20rem" style="margin-top: .75rem"/>
          <Skeleton width="15rem" style="margin: .5rem 0"/>
          <table class="table table-sm table-hover">
            <thead/>
            <tbody class="album-track-table">
            <tr v-for="index in 5" :key="index">
              <th>
                <Skeleton width="2rem" class="mb-1"/>
              </th>
              <td nowrap="nowrap">
                <Skeleton width="35rem" style="margin-top: .4rem"/>
              </td>
              <td>
                <Skeleton width="2rem" style="margin-top: .4rem"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </Fieldset>
  </div>
  <Dialog :modal="true" v-model:visible="audioUploadDisplay" :style="{width: '60rem'}" :header="t('Upload')">
    <BlockUI :blocked="param.block">
      <FileUpload ref="dt" auto multiple :customUpload="true"
                  :showUploadButton="false"
                  :showCancelButton="false"
                  chooseIcon="pi pi-image" @select="selectFile"
                  :maxFileSize="100000000" :previewWidth="100"
                  :invalidFileSizeMessage="t('InvalidFileSizeMessage')">
        <template #header="{ chooseCallback }">
          <div>
            <RButton @click="chooseCallback()" icon="image" tip="Images"/>
            <RButton @click="clearFile" action="clear" :disabled="!fileInfos || fileInfos.length === 0"/>
            <RButton @click="uploadAudioFile" icon="cloud_upload" v-if="fileInfos.length" tip="Upload"/>
          </div><br>
          <Select size="small" :options="[...Array(info.discs.length).keys()]" v-model="selectedDiscNo"/>
        </template>
        <template #empty>
          <span class="empty-search-result">{{ t('DragFile') }}</span>
        </template>
        <template #content>
          <DataTable v-if="fileInfos.length > 0" ref="dt" :value="fileInfos" class="entity-manager-datatable"
                     scrollable scrollHeight="31rem" size="small">
            <Column :header="t('Name')" style="width: 10rem">
              <template #body="{data}">
                <div class="text-ellipsis">{{ data.name }}</div>
              </template>
            </Column>
            <Column :header="t('Size')" field="size" style="width: 6rem"/>
            <Column style="width: 1rem">
              <template #body="{ index }">
                <Button size="small" icon="pi pi-times" link severity="danger"
                        @click="removeFile(index)"/>
              </template>
            </Column>
          </DataTable>
        </template>
      </FileUpload>
    </BlockUI>
  </Dialog>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {PublicHelper} from "@/utils/publicHelper";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const AlbumTrackTable = defineAsyncComponent(() => import('@/components/item/AlbumTrackTable.vue'));
const quickCreator = defineAsyncComponent(() => import('@/components/item/AlbumTrackQuickCreator.vue'));

const {t} = useI18n();
const param = ref(new EditParam());
const loading = ref(false);
const info = ref({
  discs: [],
  totalTracks: 0,
  totalDuration: 0,
});

const props = defineProps<{
  id: number,
  catalogId: string
}>()

onMounted(() => {
  reloadTrackInfo();
});

const reloadTrackInfo = async () => {
  param.value.block = true;
  loading.value = true;
  const res = await Axios.post(API.ITEM.ALBUM_TRACK_LIST, {id: props.id});
  if (res.success())
    info.value = res.data;
  param.value.block = false;
  loading.value = false;
}

const openQuickCreatorDialog = () => {
  bs!.dialog.open(quickCreator, {
    props: {
      header: t('TrackInfo'),
      style: {
        width: '65rem'
      },
      modal: true,
      closable: false
    },
    data: {
      mode: 'normal',
      id: props.id
    },
    onClose: (options: any) => {
      if (options.data !== undefined) {
        if (options.data.upload) {
          reloadTrackInfo();
        }
      }
    }
  });
}

//file upload
const dt = ref();
const fileInfos = ref<any[]>([]);
const audioUploadDisplay = ref(false);
const openAudioUpload = () => {
  audioUploadDisplay.value = true;
}
const selectFile = async (ev: any) => {
  if (!ev.files) return;
  fileInfos.value = [];
  for (let file of ev.files) {
    let info = {
      name: file.name,
      size: PublicHelper.formatSize(file.size),
      file: file
    }
    fileInfos.value.push(info)
  }
};
const clearFile = () => {
  dt.value.files = [];
  fileInfos.value = [];
};
const removeFile = (index: number) => {
  fileInfos.value.splice(index, 1);
};

const selectedDiscNo = ref(0);

const uploadAudioFile = async () => {
  let selectedDisc: any = info.value.discs[selectedDiscNo.value]
  const fd = new FormData();
  fd.append('id', selectedDisc.id);
  fd.append('itemId', props.id.toString());
  fd.append('albumCatalogId', props.catalogId);
  fd.append('discCatalogId', selectedDisc.catalogId);
  fd.append('discNo', selectedDisc.discNo);
  fileInfos.value.forEach(f => fd.append('files', f.file));
  param.value.block = true;
  const res = await Axios.form(API.ITEM.ALBUM_TRACK_QUICK_UPLOAD, fd);
  if (res.success())
    bs!.toast.success(res.message);
  audioUploadDisplay.value = false;
  fileInfos.value = [];
  param.value.block = false;
}
</script>

<style lang="scss" scoped>
@use "@/styles/entity-extra-album";
</style>