<script setup lang="ts">
import '@/assets/entity-detail.scss';
import '@/assets/item-detail.css';
import "@/assets/entity-global.scss";
import "@/assets/entry-detail.scss";
import '@/assets/bootstrap/myBootstrap.min.css';
import '@/lib/bootstrap.bundle.min';

import DetailPad from "@/components/common/DetailPad.vue";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import {getCurrentInstance, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/EntityLike.vue";
import {useUserStore} from "@/store/user.ts";
import {useDialog} from "primevue/usedialog";
import InfoEditor from "@/components/entityEditor/PersonInfoEditor.vue";
import {META} from "@/config/Web_Const.ts";
import RelatedItems from "@/components/common/RelatedItems.vue";
import PersonsInfo from "@/components/common/PersonInfo.vue";
import SubProductInfo from "@/components/special/SubProductInfo.vue";
import SideImages from "@/components/image/SideImages.vue";

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const item = ref();
const cover = ref();
const pageTraffic = ref({});
const detailInfo = ref({});
const option = ref({});

onBeforeMount(() => {
  let info: any = router.currentRoute.value.meta.info;
  item.value = info.item;
  pageTraffic.value = info.traffic;
  detailInfo.value = info.detailInfo;
  option.value = info.options;
  cover.value = info.cover;
});

const openEditDialog = () => {
  // dialog.open(InfoEditor, {
  //   props: {
  //     header: $const.Edit,
  //     style: {
  //       width: '600px',
  //     },
  //     breakpoints:{
  //       '960px': '70vw',
  //       '640px': '60vw'
  //     },
  //     modal: true,
  //     closable: false
  //   },
  //   data: {
  //     item: item.value,
  //     option: option.value,
  //   },
  //   onClose: async (options) => {
  //     if (options.data !== undefined) {
  //       if (options.data.isUpdate) {
  //         await getItems();
  //       }
  //     }
  //   }
  // });
}

const getGenderIcon = (value) => ({
  0: "question",
  1: "mars",
  2: "venus",
}[value]);

</script>

<template>
  <Toast/>
  <div class="flex flex-wrap justify-content-center gap-3">
    <div class="entity-detail-main-col">
      <div class="entity-header-title">
        <h1 style="display: inline;">{{ item.name }}</h1>
      </div>
      <div class="grid mx-2">
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
              <li v-if="item!.birthDate">
                <span class="tip">{{ $t('BirthDate') }}:&nbsp;</span>{{ item!.birthDate }}
              </li>
              <li v-if="item.gender.value">
                <span class="tip">{{ $t('Gender') }}:&nbsp;</span>
                <i :class="'mt-2 pi pi-' + getGenderIcon(item.gender.value)" style="font-size: 12px"
                   v-tooltip.right="{value: item.gender.label, class: 'short-tooltip'}" />
              </li>

              <li v-for="(link, index) in item.links" :key="index" :class="{ 'sub_section': index === 0, sub: index > 0 }">
                <span v-if="index === 0" class="tip">{{ $t('Link') }}:&nbsp;</span>
                <a :href="link.url" target="_blank">
                <span style="display: inline;" class="text-truncate-2 mr-2">
                  <i :class="link.type === META.LINK_TYPE.TWITTER ? 'pi pi-twitter' : 'pi pi-at'" style="font-size: 11px" />
                  <i>{{ link.name }}</i>
                </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="col py-0">
          <DetailPad :header="$t('Description')" :text="item.detail"/>
          <RelatedItems />
        </div>
      </div>
    </div>
    <div class="entity-detail-side-col">
      <TrafficInfo :info="pageTraffic" :addedTime="item.addedTime" :editedTime="item.editedTime"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>