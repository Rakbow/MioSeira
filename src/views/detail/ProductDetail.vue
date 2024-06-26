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
          <h5 v-if="item.nameEn !== ''" class="detail-item-subtitle"><small>{{ item.nameEn }}</small></h5>
          <h5 v-else><small></small></h5>
          <h5 v-if="item.nameZh !== ''" class="detail-item-subtitle"><small>{{ item.nameZh }}</small></h5>
          <h5 v-else><small></small></h5>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-4" style="width: 205px">
              <div class="product-detail-cover">
                <img :src="itemImageInfo.cover.url" :alt="itemImageInfo.cover.name"/>
              </div>
            </div>
            <div class="col detail-item-header-card">
              <Card>
                <template #content>
                  <div class="relative">
                    <div v-if="userStore.user">
                      <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                              @click="openEditDialog" style="right: 25%"
                              v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}" >
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
            <!-- detail -->
            <DetailPad :header="$const.Description" :text="item.detail" />
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
      <SideImages :images="itemImageInfo"/>
      <RelationInfo />
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime" />
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
import {useUserStore} from "@/store/user.ts";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
import {useDialog} from "primevue/usedialog";
import SideImages from "@/components/common/SideImages.vue";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import RelationInfo from "@/components/common/RelationInfo.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/ItemLike.vue";
import Info from "@/views/detail/ProductDetailInfo.vue";
import InfoEditor from "@/components/entityEditor/ProductInfoEditor.vue";

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const item = ref({});
const pageInfo = ref({});
const itemImageInfo = ref({});
const option = ref({});
const personnel = ref([]);

onBeforeMount(() => {
  item.value = router.currentRoute.value.meta.info.item;
  pageInfo.value = router.currentRoute.value.meta.info.traffic;
  itemImageInfo.value = router.currentRoute.value.meta.info.itemImageInfo;
  option.value = router.currentRoute.value.meta.info.options;
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
      item: item.value,
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

.product-detail-cover {
  transform:translateY(7px);
  width: 200px;
  max-height: 150px;
}
</style>