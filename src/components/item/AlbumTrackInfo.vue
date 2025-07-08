<template>
  <div class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-align-justify"/>
        <b>{{ t('TrackInfo') }}</b>
      </template>

      <div class="album-tracks">
        <RButton @click="openAudioUpload" icon="cloud_upload" tooltip="Upload" variant="text"
                 class="absolute" style="right: 3rem"/>
        <RButton @click="openQuickCreatorDialog" icon="music_note_add" tooltip="Add" variant="text"
                 class="absolute" style="right: 0"/>

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
              <b class="album-tracks-disc-header">
                {{ `Disc ${disc.discNo} (${disc.mediaFormat.label})` }}
                <template v-if="disc.catalogId">&nbsp;[{{ disc.catalogId }}]</template>
                <template v-if="disc.albumFormat.length">
                  &nbsp;
                  <p v-for="(format, index) of disc.albumFormat">
                    <span>{{ format.label }}</span>
                    <span v-if="index < disc.albumFormat.length - 1">, </span>
                  </p>
                </template>
              </b>
              <table>
                <tbody>
                <tr v-for="track in disc.tracks">
                  <th>{{ track.serial < 10 ? `0${track.serial}` : track.serial }}</th>
                  <td nowrap="nowrap">
                    <router-link :to="`${$api.EPISODE_DETAIL}/${track.id}`">
                      <span>{{ track.name }}</span>
                    </router-link>
                  </td>
                  <td class="album-tracks-duration">
                    <span>{{ track.duration }}</span>
                  </td>
                </tr>
                </tbody>
              </table>
              <span class="album-tracks-disc-total">
                <span>&nbsp;{{ t('TrackNum') }}:&nbsp;</span>{{ disc.tracks.length }}
                <span>&nbsp;{{ t('DiscLength') }}:&nbsp;</span>{{ disc.duration }}
              </span>
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
  <Dialog :modal="true" v-model:visible="audioUploadDisplay" :style="{width: '600px'}" :header="t('Upload')">
    <BlockUI :blocked="param.block">
      <FileUpload ref="dt" auto multiple :customUpload="true"
                  :showUploadButton="false"
                  :showCancelButton="false"
                  chooseIcon="pi pi-image" @select="selectFile"
                  :maxFileSize="100000000" :previewWidth="100"
                  :invalidFileSizeMessage="t('InvalidFileSizeMessage')">
        <template #header="{ chooseCallback }">
          <Button @click="chooseCallback()" icon="pi pi-file" rounded outlined/>
          <Button @click="clearFile" icon="pi pi-times" rounded outlined severity="danger"
                  :disabled="!fileInfos || fileInfos.length === 0"/>
          <Button @click="uploadAudioFile" icon="pi pi-save" rounded outlined v-if="fileInfos.length"/>
        </template>
        <template #empty>
          <span class="empty-search-result">{{ t('DragFile') }}</span>
        </template>
        <template #content>
          <DataTable v-if="fileInfos.length > 0" ref="dt" :value="fileInfos"
                     :alwaysShowPaginator="fileInfos.length !== 0" paginator :rows="5"
                     scrollable scrollHeight="flex" size="small"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
                     currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;">
            <Column :header="t('Name')" style="max-width: 10rem">
              <template #body="slotProps">
                <div class="data-table-field-text-overflow-hidden">{{ slotProps.data.name }}</div>
              </template>
            </Column>
            <Column :header="t('Size')" field="size" style="width: 6rem"/>
            <Column style="width: 1rem">
              <template #body="{ index }">
                <Button size="small" icon="pi pi-times" outlined rounded severity="danger"
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
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {PublicHelper} from "@/toolkit/publicHelper";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const {t} = useI18n();
const quickCreator = defineAsyncComponent(() => import('@/components/item/AlbumTrackQuickCreator.vue'));

onMounted(() => {
  reloadTrackInfo();
});

onBeforeMount(() => {
})

const route = useRoute();
const param = ref(new EditParam());
const loading = ref(false);
const info = ref({
  discs: [],
  totalTracks: 0,
  totalDuration: 0,
});

const reloadTrackInfo = async () => {
  param.value.block = true;
  loading.value = true;
  const res = await Axios.post(API.ALBUM_TRACK_LIST, {id: route.params.id});
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
        width: '40vw',
        minWidth: '40vw'
      },
      breakpoints: {
        '960px': '40vw',
        '640px': '40vw'
      },
      modal: true,
      closable: false
    },
    data: {
      mode: 'normal'
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
const uploadAudioFile = async () => {
  const fd = new FormData();
  fd.append('albumId', route.params.id.toString());
  fileInfos.value.forEach(f => fd.append('files', f.file));
  param.value.block = true;
  const res = await Axios.form(API.ALBUM_TRACK_FILES_UPLOAD, fd);
  if (res.success())
    bs!.toast.success(res.message);
  audioUploadDisplay.value = false;
  fileInfos.value = [];
  param.value.block = false;
}
</script>

<style lang="scss" scoped>
@use '@/styles/general';

.album-tracks {
  position: relative !important;

  &-header {
    font-size: 1.2rem;
    margin-top: .5rem;
    text-align: left !important;
  }

  &-disc {
    margin-top: 3rem;

    &-header {
      margin-left: .5rem;
      @extend .small-font;

      span {
        color: gray;
      }

      p {
        display: inline;
      }

    }

    &-total {
      @extend .small-font;
      float: right;
      margin: .1rem;
      color: var(--r-steel-300);

      > span {
        color: gray
      }
    }
  }

  table {
    width: 100%;
    padding-bottom: 0;
    border: none;
    border-collapse: collapse;

    tr {
      border-bottom: .1rem solid var(--r-bg-indigo-700);
      padding-bottom: .1rem;

      &:hover {
        background-color: var(--r-bg-indigo-700);
      }
    }

    td {
      padding-top: 0;

      span {
        font-size: 1.1rem;
      }

    }

    th {
      width: 2rem;
      color: var(--r-steel-500);
      @extend .small-font;
    }
  }

  &-duration {
    text-align: right !important;
    color: var(--r-steel-300);
  }

}
</style>