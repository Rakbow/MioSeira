<template>
  <div id="main" class="flex flex-wrap justify-content-center gap-3">
    <Toast></Toast>
    <div class="entity-detail-main-col card">
      <div class="entity-header-title">
        <h1 style="display: inline;">{{ item.name }}</h1><span style="display: inline;">({{ item.type.label }})</span>
        <div style="padding: 0 5px"><span>{{ item!.nameEn }}</span><br></div>
        <div v-for="alias in item.aliases" style="padding: 0 5px">
          <span>{{ alias }}</span><br>
        </div>
      </div>
      <div class="grid border-round-sm m-3">
        <div class="col-4" style="width: 200px;height: 200px;text-align: center;vertical-align: middle;">
          <img :src="cover" alt="main"/>
        </div>
        <div class="col card" style="background: #2f364f;">
          <div class="relative">
            <div v-if="userStore.user">
              <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                      @click="openEditDialog" style="right: 10%"
                      v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}" >
                <template #icon>
                  <span class="material-symbols-outlined">edit_note</span>
                </template>
              </Button>
            </div>
            <table class="table-borderless table-sm ml-2">
              <tbody class="entity-info-table">
              <tr>
                <td>
                  <i class="pi pi-tag"></i>
                  <strong>{{ $t('Type') }}</strong>
                </td>
                <td style="display:inline">
                  <Tag class="ml-1" :value="item.type.label"/>
                </td>
              </tr>
              <tr>
                <td>
                  <i class="pi pi-calendar"></i>
                  <strong>{{ $t('Date') }}</strong>
                </td>
                <td>
                  {{ item!.date ? item!.date : "N/A" }}
                </td>
              </tr>
              </tbody>
            </table>
<!--            <Info :item="item" />-->
            <StatusEditor :status="item.status" />
            <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
          </div>
        </div>
      </div>
      <div class="m-3">
<!--        <PersonsInfo />-->
        <DetailPad :header="$t('Description')" :text="item.detail" />
      </div>
    </div>
    <div class="entity-detail-side-col">
<!--      <SideImages v-if="item.type.value !== META.PRODUCT_TYPE.MAIN_SERIES"-->
<!--                  :images="meta.info.images" :count="meta.info.imageCount" />-->
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime" />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user.ts";
const {t} = useI18n();
import {useDialog} from "primevue/usedialog";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import InfoEditor from "@/components/entityEditor/ProductInfoEditor.vue";
import Like from "@/components/common/EntityLike.vue";
import {useI18n} from "vue-i18n";
import {onBeforeMount, ref} from "vue";

const meta = ref<any>();
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const item = ref<any>({});
const pageInfo = ref({});
const cover = ref({});
const option = ref({});

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  item.value = meta.value.info.item;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
  option.value = meta.value.info.options;
});

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

<style lang="scss" scoped>
@use "@/assets/entity-detail";

.item-detail-header h5 {
  /*font-family: "Comic Sans MS", "serif";*/
  text-align: left !important;
  margin-top: 0.2em;
  margin-bottom: 0;
  color: #788990;
}
</style>