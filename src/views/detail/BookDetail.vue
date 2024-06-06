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
              <div class="book-detail-cover">
                <img :src="cover" alt="main"/>
              </div>
            </div>
            <div class="col detail-item-header-card">
              <Card>
                <template #content>
                  <div class="relative">
                    <div v-if="userStore.user">
                      <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                              @click="loadEditor(dialog, item, option)" style="right: 25%"
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
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/ItemLike.vue";
import Info from "@/views/detail/BookDetailInfo.vue";
import {useI18n} from "vue-i18n";
import {loadEditor} from "@/logic/itemService";

const {t} = useI18n();
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const item = ref<any>({});
const pageInfo = ref({});
const cover = ref({});
const option = ref({});
const personnel = ref([]);

onBeforeMount(() => {
  item.value = props.info.item;
  pageInfo.value = props.info.traffic;
  cover.value = props.info.cover;
  option.value = props.info.options;
  personnel.value = props.info.personnel;
});

</script>

<style scoped>
.book-detail-cover {
  transform: translateY(10px);
  width: 200px;
  height: 200px;
}

.book-detail-cover img {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  transform: translate(-50%, -50%);
  cursor: pointer;
  pointer-events: none;
}
</style>