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
            <!--            <div th:insert="~{template/item-detail-template :: item_common_edit_button}"></div>-->
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
                    <table class="table-borderless table-sm ml-2">
                      <tbody class="detail-item-header-table">
                      <tr>
                        <td>
                          <i class="pi material-symbols-outlined">tag</i>
                          <strong>{{ $const.AlbumCatalogNo }}</strong>
                        </td>
                        <td>
                          {{ album.catalogNo ? album.catalogNo : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi material-symbols-outlined">barcode</i>
                          <strong>{{ $const.Barcode }}</strong>
                        </td>
                        <td>{{ album.barcode ? album.barcode : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-calendar"></i>
                          <strong>{{ $const.ReleaseDate }}</strong>
                        </td>
                        <td>
                          {{ album.releaseDate ? album.releaseDate : "N/A" }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-tag"></i>
                          <strong>{{ $const.ReleasePrice }}</strong>
                        </td>
                        <td>
                          {{ album.price != 0 ? album.price : "&nbsp;&nbsp;-" }}
                          <span v-if="album.price != 0">
                            <span v-if="album.currencyUnit == 'JPY'" class="ml-1"
                                  style="text-decoration-line: underline;text-decoration-style: dashed;"
                                  v-tooltip.right="{value: $const.TaxInclusive, class: 'region-tooltip'}">JPY</span>
                            <span v-else>{{ album.currencyUnit }}</span>
                            <span class="ml-2 dropdown">
                                <a href="#" class="dropdown-toggle"
                                   data-bs-toggle="dropdown">{{ $const.OtherCurrencyUnit }}</a>
                                <div class="dropdown-menu">
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+CNY'"
                                       class="dropdown-item">CNY</a>
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+USD'"
                                       class="dropdown-item">USD</a>
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+EUR'"
                                       class="dropdown-item">EUR</a>
                                    <a :href="'https://www.bing.com/search?q='+album.price+'+'+album.currencyUnit+'+'+'IN'+'+TWD'"
                                       class="dropdown-item">TWD</a>
                                </div>
                            </span>
                        </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi material-symbols-outlined detail-list-icon">workspace_premium</i>
                          <strong>{{ $const.Bonus }}</strong>
                        </td>
                        <td>
                          <a v-if="album.hasBonus" href="#bonus" class="ml-3">
                            <i class="pi true-icon pi-check-circle"></i>
                          </a>
                          <i v-else class="pi false-icon pi-times-circle"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-print"></i>
                          <strong>{{ $const.PublishFormat }}</strong>
                        </td>
                        <td v-for="format of album.publishFormat" style="display:inline">
                          <a :href="'/db/albums?publishFormat=' + format.value">
                            <Tag class="ml-1" :value="format.label"></Tag>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-zhuanjiguangpan"></i>
                          <strong>{{ $const.MediaFormat }}</strong>
                        </td>
                        <td v-for="format of album.mediaFormat" style="display:inline">
                          <a :href="'/db/albums?mediaFormat=' + format.value">
                            <Tag class="ml-1" :value="format.label"></Tag>
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi iconfont icon-musicfill"></i>
                          <strong>{{ $const.AlbumFormat }}</strong>
                        </td>
                        <td v-for="format of album.albumFormat" style="display:inline">
                          <a :href="'/db/albums?albumFormat=' + format.value">
                            <Tag class="ml-1" :value="format.label"></Tag>
                          </a>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <StatusEditor :status="detailInfo.status" />
                    <ItemLike :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="detail-item-field">
            <!-- companies -->
            <CompaniesInfo :companies="album.companies"/>
            <!-- artists -->
            <TmpPersonsInfo :persons="album.artists"/>
            <PersonsInfo :personnel="personnel"/>
            <!-- tracks info -->
            <TrackInfo :info="album.trackInfo" :catalogNo="album.catalogNo" />
            <!-- description -->
            <DescriptionPad :header="$const.Description" :text="detailInfo.description" :images="itemImageInfo.images" />
            <!-- bonus -->
            <BonusPad id="bonus" v-if="album.hasBonus" :entityType="detailInfo.entityType" :entityId="detailInfo.id"
                      :text="album.bonus" :images="itemImageInfo.images" />
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
      <CategoryInfo :info="detailInfo"/>
      <SideImages :images="itemImageInfo"/>
      <TrafficInfo :info="pageInfo"/>
      <!--      <div class="mt-2" th:insert="~{template/item-detail-template :: index_loading_related_item_panel}"></div>-->
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

import {onBeforeMount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {AxiosHelper} from "@/utils/axiosHelper";
import {useToast} from "primevue/usetoast";
import CategoryInfo from "@/components/common/CategoryInfo.vue";
import SideImages from "@/components/common/SideImages.vue";
import TrafficInfo from "@/components/common/TrafficInfo.vue";
import CompaniesInfo from "@/components/common/CompaniesInfo.vue";
import TmpPersonsInfo from "@/components/special/TmpPersonsInfo.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import DescriptionPad from "@/components/common/DescriptionPad.vue";
import BonusPad from "@/components/common/BonusPad.vue";
import TrackInfo from "@/components/special/AlbumTrackInfo.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/ItemLike.vue";

const router = useRouter();
const toast = useToast();

const album = ref({});
const pageInfo = ref({});
const detailInfo = ref({});
const itemImageInfo = ref({});
const option = ref({});
const relatedItemLoad = ref(true);
const relatedAlbums = ref([]);
const productSet = ref([]);
const productSelect = ref(true);
const audioInfos = ref(null);
const personnel = ref([]);

const displayEditDialog = ref(false);
const displayTrackEditDialog = ref(false);

onBeforeMount(() => {
  album.value = router.currentRoute.value.meta.info.album;
  pageInfo.value = router.currentRoute.value.meta.info.pageInfo;
  detailInfo.value = router.currentRoute.value.meta.info.detailInfo;
  itemImageInfo.value = router.currentRoute.value.meta.info.itemImageInfo;
  option.value = router.currentRoute.value.meta.info.options;
  audioInfos.value = router.currentRoute.value.meta.info.audioInfos;
  personnel.value = router.currentRoute.value.meta.info.personnel;
});

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