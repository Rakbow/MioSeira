<template>
  <Toast/>
  <div class="flex flex-wrap justify-content-center gap-3">
    <div class="entity-detail-main-col">
      <div class="entity-header-title">
        <h1 style="display: inline;">{{ item.name }}</h1><span>({{ item.type.label }})</span>
      </div>
      <div v-if="item.type.value !== META.PRODUCT_TYPE.MAIN_SERIES" class="grid mx-2">
        <div class="col-4" style="width: 210px">
          <div class="entity-image-cover-200">
            <img :src="cover" alt="main"/>
          </div>
          <div class="infobox_container">
            <ul id="infobox">
              <li v-if="item.nameZh">
                <span class="tip">{{ $t('PersonNameZh') }}:&nbsp;</span>{{ item!.nameZh }}
              </li>
              <li v-if="item.nameEn">
                <span class="tip">{{ $t('PersonNameEn') }}:&nbsp;</span>{{ item!.nameEn }}
              </li>
              <li v-if="item.aliases.length" class="sub_container">
                <ul>
                  <li v-for="(alias, index) in item.aliases" :key="index" :class="{ 'sub_section': index === 0, sub: index > 0 }">
                    <span v-if="index === 0" class="tip">{{ $t('Aliases') }}:&nbsp;</span>{{ alias }}
                  </li>
                </ul>
              </li>
              <li>
                <span class="tip">{{ $t('Category') }}:&nbsp;</span>
                <Tag class="ml-1" :value="item.type.label"/>
              </li>
              <li v-if="item.date">
                <span class="tip">{{ $t('ReleaseDate') }}:&nbsp;</span>{{ item.date }}
              </li>
            </ul>
          </div>
        </div>
        <div class="col py-0">
          <DetailPad v-if="item.type.value !== META.PRODUCT_TYPE.MAIN_SERIES" :header="$t('Description')"
                     :text="item.detail"/>
          <PersonsInfo v-if="item.type.value !== META.PRODUCT_TYPE.MAIN_SERIES"/>
          <RelatedItems />
        </div>
      </div>
      <div class="m-3">
        <SubProductInfo v-if="item.type.value == META.PRODUCT_TYPE.MAIN_SERIES"/>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <SideImages v-if="item.type.value !== META.PRODUCT_TYPE.MAIN_SERIES"
                  :images="meta.info.images" :count="meta.info.imageCount"/>
      <TrafficInfo :info="pageInfo" :addedTime="item.addedTime" :editedTime="item.editedTime"/>
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
import {useUserStore} from "@/store/user.ts";

const {t} = useI18n();
import {useDialog} from "primevue/usedialog";
import SideImages from "@/components/image/SideImages.vue";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import DetailPad from "@/components/common/DetailPad.vue";
import StatusEditor from "@/components/common/StatusEditor.vue";
import Info from "@/views/detail/info/ProductDetailInfo.vue";
import InfoEditor from "@/components/entityEditor/ProductInfoEditor.vue";
import {loadEditor} from "@/logic/itemService.js";
import Like from "@/components/common/EntityLike.vue";
import {useI18n} from "vue-i18n";
import {onBeforeMount, ref} from "vue";
import {META} from "@/config/Web_Const";
import SubProductInfo from "@/components/special/SubProductInfo.vue";
import RelatedItems from "@/components/common/RelatedItems.vue";

const meta = ref<any>();
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const item = ref({});
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
      breakpoints: {
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
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          location.reload();
        }
      }
    }
  });
}

</script>

<style lang="scss" scoped>
</style>