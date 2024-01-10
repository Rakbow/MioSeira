<script setup>
import {getCurrentInstance, inject, onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {useDialog} from "primevue/usedialog";
import {useRoute} from "vue-router";
import {META} from '@/config/Web_Const';
import {AxiosHelper as axios} from "@/utils/axiosHelper";

const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;
const toast = useToast();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const route = useRoute();
const editBlock = ref(false);
const isUpdate = ref(false);

onMounted(() => {
  discSet.value = dialogRef.value.data.discs;
  isUpdate.value = false;
  initDisc();
});

const initDisc = () => {
  discSet.value.forEach(disc => {
    disc.tracks.forEach(track => {
      track.code = disc.code;
    })
  })
}

const tracks = ref({
  titleSet: [],
  durationSet: []
});
const disc = ref({});

//region XMR
const submit = async () => {
  editBlock.value = true;
  let param = {
    id: route.params.id,
    discs: discSet.value
  }
  const res = await axios.post($api.UPDATE_ALBUM_TRACK_INFO, param);
  if(res.state === axios.SUCCESS) {
    toast.add({severity: 'success', summary: "Success", detail: res.message, life: 3000});
    isUpdate.value = true;
    editBlock.value = false;
    close();
  }else{
    editBlock.value = false;
    toast.add({severity: 'error', summary: "Error", detail: res.message, life: 3000});
  }
}
//endregion

let discId = 1;
let tmpTrackId = -1;
const discSet = ref();
const cmDisc = ref();
const cmTrack = ref();
const selectedDisc = ref();
const selectedTrack = ref();
const menuModelDisc = ref([
  {label: $const.Delete, icon: 'pi pi-fw pi-trash', command: () => deleteDisc(selectedDisc)}
]);
const menuModelTrack = ref([
  {label: $const.Delete, icon: 'pi pi-fw pi-trash', command: () => deleteTrack(selectedTrack)}
]);
const discRowMenu = (ev) => {
  cmDisc.value.show(ev.originalEvent);
};
const trackRowMenu = (ev) => {
  cmTrack.value.show(ev.originalEvent);
};

//disc 重新排序
const onRowReorderDisc = (ev) => {
  discSet.value = ev.value;
};
//track 重新排序
const onRowReorderTrack = (ev) => {
  for (let disc of discSet.value) {
    if (disc.code === ev.value[0].code) {
      disc.tracks = ev.value;
      disc.tracks.forEach(track => {
        track.action = META.ACTION.UPDATE;
      });
    }
  }
};
//删除 disc
const deleteDisc = (disc) => {
  discSet.value.forEach(d => {
    if(d.code === disc.value.code)
      d.action = META.ACTION.REAL_DELETE;
  });
  toast.add({severity: 'info', summary: $const.MessageDeleted, detail: disc.value.code, life: 3000});
  selectedDisc.value = null;
};
//删除 track
const deleteTrack = (track) => {
  for (let disc of discSet.value) {
    disc.tracks.forEach(t => {
      if(t.id === track.id)
        t.action = META.ACTION.REAL_DELETE;
    });
  }
  toast.add({severity: 'info', summary: $const.MessageDeleted, detail: track.title, life: 3000});
};
const editingRowsTrack = ref([]);
//编辑保存track
const onRowEditSaveTrack = (ev) => {
  let {newData, index} = ev;
  for (let disc of discSet.value) {
    if (disc.code === newData.code) {
      disc.tracks[index] = newData;
      if(newData.action !== META.ACTION.INSERT)
        newData.action = META.ACTION.UPDATE;
    }
  }
};
const expandedRows = ref([]);
const expandAll = () => {
  expandedRows.value = discSet.value;
};
const collapseAll = () => {
  expandedRows.value = null;
};
const checkDisc = () => {
  if (tracks.value.titleSet === undefined || tracks.value.titleSet.length === 0) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: $const.TrackInfoTitleEmpty,
      life: 3000
    });
    return false;
  }
  if (tracks.value.durationSet === undefined || tracks.value.durationSet.length === 0) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: $const.TrackInfoDurationEmpty,
      life: 3000
    });
    return false;
  }
  if (tracks.value.durationSet.length !== tracks.value.titleSet.length) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: $const.TrackInfoNotEquals,
      life: 3000
    });
    return false;
  }
  return true;
}
const addDisc = () => {
  if (checkDisc()) {
    let newDisc = {
      action: META.ACTION.INSERT,
      code: `NewDisc-${discId}`,
      tracks: []
    };
    for (let i = 0; i < tracks.value.titleSet.length; i++) {
      let track = {
        id: tmpTrackId,
        code: newDisc.code,
        title: tracks.value.titleSet[i],
        duration: tracks.value.durationSet[i],
        action: META.ACTION.INSERT
      };
      newDisc.tracks.push(track);
      tmpTrackId--;
    }
    discSet.value.push(newDisc);
    tracks.value = {};
    disc.value = {};
    discId++;
  }
};

const close = () => {
  dialogRef.value.close(
    {
      isUpdate: isUpdate.value
    }
  );
};

</script>

<template>
  <BlockUI :blocked="editBlock">
    <Panel>
      <template #header>
        <i class="pi pi-plus-circle mr-2" style="font-size: 2rem"/>
        <b>{{ $const.Add }}</b>
      </template>
      <div class="grid">
        <div class="col-10">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-tag"/>
            </span>
            <Chips v-model="tracks.titleSet" :placeholder="$const.Title"/>
          </div>
        </div>
        <div class="col-10">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-clock"/>
            </span>
            <Chips v-model="tracks.durationSet" :placeholder="$const.Duration" separator=","/>
          </div>
        </div>

        <div class="col-2">
          <Button :label="$const.AddDisc" icon="pi pi-save" severity="success" @click="addDisc"/>
        </div>
      </div>

      <Panel>
        <template #header>
          <i class="pi pi-pencil mr-2" style="font-size: 2rem"/>
          <b>{{ $const.Edit }}</b>
        </template>
        <div v-if="discSet">
          <DataTable :value="discSet" class="p-datatable-sm" stripedRows
                     responsiveLayout="scroll" v-model:expandedRows="expandedRows"
                     @rowReorder="onRowReorderDisc"
                     contextMenu v-model:contextMenuSelection="selectedDisc"
                     @rowContextmenu="discRowMenu">
            <template #header>
              <div class="table-header-container">
                <Button icon="pi pi-angle-double-down" @click="expandAll"
                        class="mr-2" v-tooltip.bottom="{value: $const.ExpandAll, class: 'common-tooltip'}"/>
                <Button icon="pi pi-angle-double-up" @click="collapseAll"
                        v-tooltip.bottom="{value: $const.CollapseAll, class: 'common-tooltip'}"/>
              </div>
            </template>
            <Column :rowReorder="true" headerStyle="width: 10%" bodyStyle="text-align:center" />
            <Column :expander="true" headerStyle="width: 10%" bodyStyle="text-align:center" />
            <Column :header="$const.Disc" field="code" headerStyle="width: 70%" />
            <Column :rowEditor="true" headerStyle="width:10%" bodyStyle="text-align:center" />
            <template #expansion="slotProps">
              <div class="orders-subtable">
                <DataTable :value="slotProps.data.tracks" class="p-datatable-sm"
                           stripedRows responsiveLayout="scroll"
                           @rowReorder="onRowReorderTrack"
                           contextMenu v-model:context-menu-selection="selectedTrack"
                           @rowContextmenu="trackRowMenu" edit-mode="row"
                           v-model:editingRows="editingRowsTrack"
                           @rowEditSave="onRowEditSaveTrack">
                  <Column :rowReorder="true"></Column>
                  <Column :header="$const.AlbumDetailEditTrackTrackIndex">
                    <template #body="slotProps">
                      {{ slotProps.index + 1 }}
                    </template>
                  </Column>
                  <Column field="title" :header="$const.Title">
                    <template #editor="{ data, field }">
                      <InputText v-model="data[field]" autofocus></InputText>
                    </template>
                  </Column>
                  <Column field="duration" :header="$const.Duration">
                    <template #editor="{ data, field }">
                      <InputMask v-model="data[field]" autofocus mask="99:99"></InputMask>
                    </template>
                  </Column>
                  <Column :row-editor="true" style="width:10%; min-width:8rem"
                          bodyStyle="text-align:center"></Column>
                  <ContextMenu :model="menuModelTrack" ref="cmTrack"></ContextMenu>
                </DataTable>
              </div>
            </template>
            <ContextMenu :model="menuModelDisc" ref="cmDisc" />
          </DataTable>
        </div>
        <div v-else>
          <span class="emptyInfo">{{ $const.NoTrackInfo }}</span>
        </div>
      </Panel>

      <template #footer>
        <Button :label="$const.Cancel" icon="pi pi-times" class="mr-4"
                @click="close" :disabled="editBlock" />
        <Button :label="$const.Save" icon="pi pi-save" severity="success" class="mr-4"
                @click="submit" :disabled="editBlock"/>
      </template>
    </Panel>
  </BlockUI>
</template>

<style scoped>

</style>