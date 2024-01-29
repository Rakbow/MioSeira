<template>
  <div id="main" class="grid mt-2">
    <Toast></Toast>
    <div class="detail-card col-8 lg:col-offset-1">
      <Card>
        <template #title>
          <div class="grid detail-item-header-title">
            <h4 class="col-11">
              <b class="detail-item-title">
                {{ album.name }}
              </b>
            </h4>
          </div>
        </template>
        <template #subtitle>
          <h5 v-if="album.nameEn !== ''" class="detail-item-subtitle"><small>{{ album.nameEn }}</small></h5>
          <h5 v-else><small></small></h5>
          <h5 v-if="album.nameZh !== ''" class="detail-item-subtitle"><small>{{ album.nameZh }}</small></h5>
          <h5 v-else><small></small></h5>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-4" style="width: 205px">
              <div class="album-detail-cover">
                <img :src="itemImageInfo.cover.url" :alt="itemImageInfo.cover.name"/>
              </div>
            </div>
            <div class="col detail-item-header-card">
              <Card>
                <template #content>
                  <div class="relative">
                    <div v-if="userStore.user">
                      <Button v-if="userStore.user.type === 0 || userStore.user.type > 1" class="p-button-link absolute top-0"
                              @click="openEditDialog" style="right: 25%"
                              v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}" >
                        <template #icon>
                          <span class="material-symbols-outlined">edit_note</span>
                        </template>
                      </Button>
                    </div>
                    <Info :album="album" />
                    <StatusEditor :status="album.status" />
                    <ItemLike :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="detail-item-field">
            <PersonsInfo :personnel="personnel"/>
            <!-- tracks info -->
            <TrackInfo :info="album.trackInfo" />
            <!-- detail -->
            <DetailPad :header="$const.Description" :text="album.detail" />
            <!-- bonus -->
            <BonusPad id="bonus" v-if="album.hasBonus" :text="album.bonus" />
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
<!--      <CategoryInfo :info="detailInfo"/>-->
      <SideImages :images="itemImageInfo"/>
      <TrafficInfo :info="pageInfo" :addedTime="album.addedTime" :editedTime="album.editedTime" />
      <Panel class="mt-2" v-if="!relatedItemLoad">
        <template #header>
          <span class="text-start side-panel-header">
              <i class="pi iconfont icon-album"></i><span><strong>{{ $const.RelatedAlbumTitle }}</strong></span>
          </span>
        </template>
        <div class="grid" v-if="relatedAlbums.length !== 0">
            <span class="small_font">
                <div class="info_bit_small small_font grid m-0 p-0"
                     v-if="relatedAlbums.length !== 0"
                     v-for="relatedAlbum of relatedAlbums">
                    <div class="sidebar-panel-image-small-div album_info_bit_thumb mt-2">
                        <a :href="'/db/album/'+ relatedAlbum.id">
                            <img class="sidebar-panel-image-small" :src="relatedAlbum.cover.blackUrl"
                                 v-tooltip.bottom="$const.AddedTime + ': ' + relatedAlbum.addedTime + $const.EditedTime + ': ' + relatedAlbum.editedTime">
                        </a>
                    </div>
                    <div class="col p-0" style="height: 80px">
                        <ul class="info_bit_small_other">
                            <li>
                                <a class="small_font"
                                   :href="'/db/album/'+ relatedAlbum.id ">
                                    <span class="text-truncate-2 mr-2">
                                        {{ relatedAlbum.name }}
                                    </span>
                                </a>
                            </li>
                            <li>
                                <span class="small_font col-6 related-item-catalog">
                                    {{ relatedAlbum.catalogNo ? relatedAlbum.catalogNo : 'N/A' }}
                                </span>
                                <span class="small_font col-6 related-item-date">
                                    {{ relatedAlbum.releaseDate }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </span>
        </div>
        <div v-else>
          <span class="emptyInfo"><em>{{ $const.ItemDetailMessageNoRelatedItem }}</em></span>
        </div>
      </Panel>
    </div>
  </div>
</template>

<script setup>
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {getCurrentInstance, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
import {useDialog} from "primevue/usedialog";
import SideImages from "@/components/common/SideImages.vue";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import BonusPad from "@/components/common/BonusPad.vue";
import TrackInfo from "@/components/special/AlbumTrackInfo.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/ItemLike.vue";
import Info from "@/views/detail/AlbumDetailInfo.vue";
import InfoEditor from "@/components/common/entityEditor/AlbumInfoEditor.vue";

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const album = ref({});
const pageInfo = ref({});
const itemImageInfo = ref({});
const option = ref({});
const relatedItemLoad = ref(true);
const relatedAlbums = ref([]);
const productSet = ref([]);
const productSelect = ref(true);
const audios = ref(null);
const personnel = ref([]);

const displayEditDialog = ref(false);
const displayTrackEditDialog = ref(false);

onBeforeMount(() => {
  album.value = router.currentRoute.value.meta.info.item;
  pageInfo.value = router.currentRoute.value.meta.info.traffic;
  itemImageInfo.value = router.currentRoute.value.meta.info.itemImageInfo;
  option.value = router.currentRoute.value.meta.info.options;
  audios.value = router.currentRoute.value.meta.info.audios;
  personnel.value = router.currentRoute.value.meta.info.personnel;
});

const openEditDialog = () => {
  dialog.open(InfoEditor, {
    props: {
      header: $const.Edit,
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
      item: album.value,
      option: option.value,
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

.detail-list-icon {
  margin-right: 0.25rem;
  font-size: 1.3rem;
}

.album-detail-cover {
  transform: translateY(0);
  /*width: 170px;*/
  height: 185px;
}
</style>