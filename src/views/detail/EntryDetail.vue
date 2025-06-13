<template>
  <Toast/>
  <div class="flex flex-wrap justify-content-center gap-3">
    <div class="entity-detail-main-col">
      <div class="entity-header-title">
        <h1 style="display: inline;">{{ entry.name }}</h1>
        <span class="small-font" v-if="entry.type === META.ENTRY_TYPE.PRODUCT">({{ entry.subType.label }})</span>
        <span class="small-font" v-else>({{ entry.type.label }})</span>
        <div v-if="entry.subType.value === META.ENTRY_SUB_TYPE.MAIN_SERIES">
          <span>{{ entry.nameEn }}</span><br>
          <span>{{ entry.nameZh }}</span><br>
        </div>
      </div>
      <div v-if="entry.subType.value !== META.ENTRY_SUB_TYPE.MAIN_SERIES" class="grid mx-2">
        <div class="col-4" style="width: 210px">
          <div class="entity-image-cover-200">
            <img :src="cover" alt="main"/>
          </div>
          <div class="infobox_container">
            <Info :entry="entry"/>
            <div v-if="userStore.user && userStore.user.type > 1">
              <Button class="p-button-link" icon="pi pi-pen-to-square"
                      @click="loadEditor(entry, dialog)"
                      v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}"/>
              <Button class="p-button-link" icon="pi pi-images"
                      @click="openEditImage"
                      v-tooltip.bottom="{value: $t('Images'), class: 'short-tooltip'}"/>
              <Like :likeCount="pageInfo.likeCount" :liked="pageInfo.liked"/>

            </div>
          </div>
        </div>
        <div class="col py-0">
          <DetailPad v-if="entry.subType.value !== META.ENTRY_SUB_TYPE.MAIN_SERIES"
                     :header="$t('Description')" :text="entry.detail"/>
          <RelatedPersons v-if="entry.type.value === META.ENTRY_TYPE.PRODUCT && entry.subType.value !== META.ENTRY_SUB_TYPE.MAIN_SERIES"/>
          <RelatedItems v-if="entry.subType.value !== META.ENTRY_SUB_TYPE.MAIN_SERIES"/>
        </div>
      </div>
      <div class="m-3">
        <SubProductInfo v-if="entry.subType.value === META.ENTRY_SUB_TYPE.MAIN_SERIES"/>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <TrafficInfo :info="pageInfo" :addedTime="entry.addedTime" :editedTime="entry.editedTime"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/entity-detail.scss';
import '@/assets/item-detail.css';
import "@/assets/entity-global.scss";
import "@/assets/entry-detail.scss";
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/store/user";

const {t} = useI18n();
import {useDialog} from "primevue/usedialog";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import RelatedPersons from "@/components/related/RelatedPersons.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import {loadEditor} from "@/logic/entryService";
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import {META} from "@/config/Web_Const";
import SubProductInfo from "@/components/special/SubProductInfo.vue";
import RelatedItems from "@/components/related/RelatedItems.vue";
import Like from "@/components/common/EntityLike.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";

const entryImageEditor = defineAsyncComponent(() => import('@/components/image/EntryImageEditor.vue'));
const Info = defineAsyncComponent(() => import('@/views/detail/info/EntryDetailInfo.vue'));

const meta = ref<any>();
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const entityType = ref();
const entry = ref<any>({});
const pageInfo = ref({});
const cover = ref({});

onBeforeMount(() => {
  meta.value = router.currentRoute.value.meta;
  entityType.value = meta.value.info.type;
  entry.value = meta.value.info.entry;
  pageInfo.value = meta.value.info.traffic;
  cover.value = meta.value.info.cover;
});

const openEditImage = () => {
  dialog.open(entryImageEditor, {
    props: {
      header: t('Edit'),
      style: {
        width: '400px',
      },
      modal: true,
      closable: true
    },
    data: {
      cover: entry.value.cover,
      thumb: entry.value.thumb
    },
    onClose: async (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {

        }
      }
    }
  });
}

</script>

<style lang="scss" scoped>
</style>