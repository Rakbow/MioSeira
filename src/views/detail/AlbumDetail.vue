<template>
  <div id="main" class="grid mt-2">
    <Toast></Toast>
    <div class="detail-card col-8 lg:col-offset-1">
      <Card>
        <template #title>
          <div class="grid detail-item-header-title">
            <h4 class="col-11">
              <b class="detail-item-title">
                {{ item.name }}
              </b>
            </h4>
          </div>
        </template>
        <template #subtitle>
          <h5 v-if="item.nameEn !== ''" class="detail-item-subtitle"><small>{{ item!.nameEn }}</small></h5>
          <h5 v-else><small></small></h5>
          <h5 v-if="item.nameZh !== ''" class="detail-item-subtitle"><small>{{ item!.nameZh }}</small></h5>
          <h5 v-else><small></small></h5>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-4" style="width: 205px">
              <div class="album-detail-cover">
                <img :src="cover" alt="main"/>
              </div>
            </div>
            <div class="col detail-item-header-card">
              <Card>
                <template #content>
                  <div class="relative">
                    <div v-if="userStore.user">
                      <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                              @click="openEditDialog" style="right: 25%"
                              v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}" >
                        <template #icon>
                          <span class="material-symbols-outlined">edit_note</span>
                        </template>
                      </Button>
                    </div>
                    <Info :item="item" />
                    <StatusEditor :status="item.status" />
                    <ItemLike :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="detail-item-field">
            <PersonsInfo :personnel="personnel"/>
            <!-- tracks info -->
            <TrackInfo />
            <!-- detail -->
            <DetailPad :header="$t('Description')" :text="item.detail" />
            <!-- bonus -->
            <BonusPad id="bonus" v-if="item.hasBonus" :text="item.bonus" />
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
      <SideImages />
      <RelationInfo />
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime" />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {defineProps, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user.ts";
import {useDialog} from "primevue/usedialog";
import SideImages from "@/components/common/SideImages.vue";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import RelationInfo from "@/components/common/RelationInfo.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import BonusPad from "@/components/common/BonusPad.vue";
import TrackInfo from "@/components/special/AlbumTrackInfo.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/ItemLike.vue";
import Info from "@/views/detail/AlbumDetailInfo.vue";
// import InfoEditor from "@/components/entityEditor/AlbumInfoEditor.vue";
import InfoEditor from "@/components/entityEditor/ItemInfoEditor.vue";
import {useI18n} from "vue-i18n";

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();
const {t} = useI18n();

const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({})
  },
});

const item = ref<any>({});
const pageInfo = ref({});
const cover = ref({});
const option = ref({});
const audios = ref(null);
const personnel = ref([]);

onBeforeMount(() => {
  item.value = props.info.item;
  pageInfo.value = props.info.traffic;
  cover.value = props.info.cover;
  option.value = props.info.options;
  audios.value = props.info.audios;
  personnel.value = props.info.personnel;
});

// const openEditDialog = () => {
//   dialog.open(InfoEditor, {
//     props: {
//       header: t('Edit'),
//       style: {
//         width: '800px',
//       },
//       breakpoints:{
//         '960px': '80vw',
//         '640px': '70vw'
//       },
//       modal: true,
//       closable: false
//     },
//     data: {
//       item: item.value,
//       option: option.value,
//     },
//     onClose: (options) => {
//       if(options.data !== undefined) {
//         if(options.data.isUpdate) {
//           location.reload();
//         }
//       }
//     }
//   });
// }

const openEditDialog = () => {
  dialog.open(InfoEditor, {
    props: {
      header: t('Edit'),
      style: {
        width: '800px',
      },
      breakpoints:{
        '960px': '80vw',
        '640px': '70vw'
      },
      modal: true,
      closable: false
    },
    data: {
      item: item.value
    },
    onClose: (options) => {
      if(options.data !== undefined) {
        if(options.data.isUpdate) {
          location.reload();
        }
      }
    }
  });
}

</script>

<style scoped>

.album-detail-cover {
  transform: translateY(0);
  /*width: 170px;*/
  height: 185px;
}
</style>