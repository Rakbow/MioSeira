<template>
  <div class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-align-justify"/>
        <b>{{ t('TrackInfo') }}</b>
      </template>

      <div class="album-track">
        <Edit :func="openAudioUpload" icon="cloud_upload" position="right: 3rem" label="Upload"/>
        <Edit :func="openQuickCreatorDialog" icon="music_note_add" label="Add"/>

        <div v-if="!loading">
          <div v-if="!info.discs.length">
            <span class="empty-search-result">{{ t('NoTrackInfo') }}</span>
          </div>
          <div v-else>
            <p class="album-track-header">
              {{ t('TotalDiscNum') }}:&nbsp;<b>{{ info.discs.length }}</b>&nbsp;
              {{ t('TotalTrackNum') }}:&nbsp;<b>{{ info.totalTracks }}</b>&nbsp;
              {{ t('TotalLength') }}:&nbsp;<b>{{ info.totalDuration }}</b>
            </p>
            <div v-for="disc in (info.discs as any[])">
              <b class="album-track-sub-header">
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
              <table class="album-track-table table table-sm table-hover">
                <tbody>
                <tr v-for="track in disc.tracks">
                  <th>{{ track.serial }}</th>
                  <td nowrap="nowrap">
                    <router-link :to="`${API.EPISODE_DETAIL}/${track.id}`">
                      <span>{{ track.name }}</span>
                    </router-link>
                  </td>
                  <td class="album-track-duration">
                    <span>{{ track.duration }}</span>
                  </td>
                </tr>
                </tbody>
              </table>
              <span class="album-track-total">
                <span>&nbsp;{{ t('TrackNum') }}:&nbsp;</span>{{ disc.tracks.length }}
                <span>&nbsp;{{ t('DiscLength') }}:&nbsp;</span>{{ disc.duration }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="loading">
          <Skeleton width="20rem" style="margin-top: .75rem" />
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
    <BlockUI :blocked="editBlock">
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
          <DataTable v-if="fileInfos.length > 0" ref="dt" :value="fileInfos" class="p-datatable-sm"
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
import {computed, defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
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
const quickCreator = defineAsyncComponent(() => import('@/components/item/AlbumTrackQuickCreator.vue'));

onMounted(() => {
  reloadTrackInfo();
});

onBeforeMount(() => {
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
  const res = await axios.post(API.ALBUM_TRACK_LIST, {id: route.params.id});
  if (res.state === axios.SUCCESS)
    info.value = res.data;
  editBlock.value = false;
  loading.value = false;
}

const openQuickCreatorDialog = () => {
  dialog.open(quickCreator, {
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
    onClose: (options) => {
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
  const res = await axios.form(API.ALBUM_TRACK_FILES_UPLOAD, fd);
  if (res.state === axios.SUCCESS)
    toast.add(new PToast().success(res.message));
  audioUploadDisplay.value = false;
  fileInfos.value = [];
  editBlock.value = false;
}
</script>

<style lang="scss" scoped>
@use '@/assets/general' as g;

.album-track {
  position: relative !important;

  &-header {
    font-size: 1.2rem;
    margin-top: .5rem;
    text-align: left !important;
  }

  &-sub-header {
    margin-left: .5rem;
    @extend .small-font;

    span {
      color: gray;
    }

    p {
      display: inline;
    }

  }

  &-table {

    padding-bottom: 0;

    td, th {
      padding-bottom: .1rem;
      border-bottom: .1rem solid g.$common-border-bottom;
    }

    td {
      padding-top: 0;

      span {
        font-size: 1.1rem;
      }

    }

    th {
      width: 2rem;
      padding-top: .4rem;
      color: g.$label;
      @extend .small-font;
    }
  }

  &-total {
    @extend .small-font;
    float: right;
    margin: .1rem;

    > span {
      color: gray
    }
  }

  &-duration {
    text-align: right !important;
    color: #B0C4DE;
  }

}
</style>