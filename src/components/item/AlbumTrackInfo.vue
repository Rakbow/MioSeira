<template>
  <div class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-align-justify"/>
        <b>{{ $t('TrackInfo') }}</b>
      </template>

      <div class="relative">
        <Edit :func="openAudioUpload" icon="cloud_upload" position="right: 30px" />
        <Edit :func="openEditDialog" icon="edit_note" />

        <div v-if="!loading">
          <div v-if="!info.discs.length">
            <span class="emptyInfo"><em>{{ $t('NoTrackInfo') }}</em></span>
          </div>
          <div v-else>
            <p class="album-track-title">
              {{ $t('TotalDiscNum') }}:&nbsp;<b>{{ info.discs.length }}</b>&nbsp;
              {{ $t('TotalTrackNum') }}:&nbsp;<b>{{ info.totalTracks }}</b>&nbsp;
              {{ $t('TotalLength') }}:&nbsp;<b>{{ info.totalDuration }}</b>
            </p>
            <div v-for="disc in info.discs">
              <b class="album-track-sub-title">
                {{ `Disc ${disc!.serial}   ${disc.code}` }}
              </b>
              <table class="episode-list-table table table-sm table-hover">
                <tbody>
                  <tr v-for="track in disc.tracks">
                    <th>{{ track.serial }}</th>
                    <td nowrap="nowrap">
                      <router-link :to="`${API.EPISODE_DETAIL}/${track.id}`">
                        <span>{{ track.title }}</span>
                      </router-link>
                    </td>
                    <td class="episode-list-duration">
                      <span>{{ track.duration }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <span class="episode-list-total">
                <span>&nbsp;{{ $t('TrackNum') }}:&nbsp;</span>{{ disc!.tracks.length }}
                <span>&nbsp;{{ $t('DiscLength') }}:&nbsp;</span>{{ disc.duration }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="loading">
          <p class="text-start" style="white-space: nowrap;">
            <Skeleton width="20rem" class="mb-2" />
          </p>
          <h5>
            <Skeleton width="15rem" height="1.5rem" />
          </h5>
          <table class="table table-sm table-hover">
            <thead />
            <tbody class="episode-list-table">
            <tr v-for="index in 5" :key="index">
              <th><Skeleton width="2rem" class="mb-2" /></th>
              <td nowrap="nowrap"><Skeleton width="35rem" /></td>
              <td class="episode-list-duration"><Skeleton width="2rem" /></td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </Fieldset>
  </div>
  <Dialog :modal="true" v-model:visible="audioUploadDisplay" :style="{width: '600px'}" :header="$t('Upload')">
    <BlockUI :blocked="editBlock">
      <FileUpload ref="dt" auto multiple :customUpload="true"
                :showUploadButton="false"
                :showCancelButton="false"
                chooseIcon="pi pi-image" @select="selectFile"
                :maxFileSize="100000000" :previewWidth="100"
                :invalidFileSizeMessage="$t('ImageInvalidFileSizeMessage')">
      <template #header="{ chooseCallback }">
        <Button @click="chooseCallback()" icon="pi pi-file" rounded outlined/>
        <Button @click="clearFile" icon="pi pi-times" rounded outlined severity="danger"
                :disabled="!fileInfos || fileInfos.length === 0"/>
        <Button @click="uploadAudioFile" icon="pi pi-save" rounded outlined v-if="fileInfos.length" />
      </template>
      <template #empty>
        <span class="empty-search-result">{{ $t('DragImage') }}</span>
      </template>
      <template #content="{ files, removeUploadedFileCallback, removeFileCallback }">
        <DataTable v-if="fileInfos.length > 0" ref="dt" :value="fileInfos" class="p-datatable-sm"
                   :alwaysShowPaginator="fileInfos.length !== 0"
                   filterDisplay="row" paginator :rows="5"
                   scrollable scrollHeight="flex" size="small"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
                   currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <Column :header="$t('Name')" style="max-width: 10rem">
            <template #body="slotProps">
              <div class="data-table-field-text-overflow-hidden">{{ slotProps.data.name }}</div>
            </template>
          </Column>
          <Column :header="$t('Size')" field="size" style="width: 6rem"/>
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
import {useDialog} from "primevue/usedialog";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useToast} from "primevue/usetoast";

const {t} = useI18n();
const toast = useToast();
const Edit = defineAsyncComponent(() => import('@/components/common/EntityEditButton.vue'));
const editor = defineAsyncComponent(() => import('@/components/item/AlbumTrackEditor.vue'));

onMounted(() => {
});

onBeforeMount(() => {
  reloadTrackInfo();
})

const route = useRoute();
const dialog = useDialog();
const editBlock = ref(false);
const loading = ref(false);
const info = ref({
  discs: [],
  totalTracks: 0,
  totalDuration: 0,
});

const reloadTrackInfo = async () => {
  editBlock.value = true;
  loading.value = true;
  const res = await axios.post(API.GET_ALBUM_TRACK_INFO, {id: route.params.id});
  if(res.state === axios.SUCCESS)
    info.value = res.data;
  editBlock.value = false;
  loading.value = false;
}

const openEditDialog = () => {
  dialog.open(editor, {
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
      discs: info.value.discs
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          reloadTrackInfo();
        }
      }
    }
  });
}

//file upload
const dt = ref();
const fileInfos = ref([]);
const audioUploadDisplay = ref(false);
const openAudioUpload = () => {
  audioUploadDisplay.value = true;
}
const selectFile = async (ev) => {
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
  fd.append('albumId', route.params.id);
  fileInfos.value.forEach(f => fd.append('files', f.file));
  editBlock.value = true;
  const res = await axios.form(API.UPLOAD_ALBUM_TRACK_FILES, fd);
  if (res.state === axios.SUCCESS)
    toast.add({severity: 'success', detail: res.message, life: 3000});
    audioUploadDisplay.value = false;
    fileInfos.value = [];
  editBlock.value = false;
}
</script>

<style lang="scss" scoped>
@use '@/assets/general' as g;

.album-track-title {
  font-size: 12px;
  margin-top: .5rem;
  text-align: left !important;
}

.album-track-sub-title {
  margin-left: .5rem;
  @extend .small-font;
}

.episode-list-duration {
  text-align: right !important;
  color: #B0C4DE;
}

.episode-list-total {
  @extend .small-font;
  float: right;
  margin: 1px;
  > span {
    color: gray
  }
}

.episode-list-table {

  padding-bottom: 0;

  td, th {
    padding-bottom: 0;
    border-bottom: 1px solid #3C405C;
  }

  td {
    padding-top: 0;

    span {
      font-size: 11px;
    }

  }

  th {
    width: 20px;
    padding-top: 4px;
    color: g.$label;
    @extend .small-font;
  }
}
</style>