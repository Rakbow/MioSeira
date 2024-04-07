<script setup>
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';
import DetailPad from "@/components/common/DetailPad.vue";
import TrafficInfo from "@/components/common/PageTraffic.vue";
import {getCurrentInstance, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/ItemLike.vue";
import {useUserStore} from "@/store/user.js";
import {useDialog} from "primevue/usedialog";
import InfoEditor from "@/components/common/entityEditor/PersonInfoEditor.vue";
import {META} from "@/config/Web_Const.js";

const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const dialog = useDialog();

const item = ref({});
const pageTraffic = ref({});
const detailInfo = ref({});
const option = ref({});

onBeforeMount(() => {
  item.value = router.currentRoute.value.meta.info.item;
  pageTraffic.value = router.currentRoute.value.meta.info.traffic;
  detailInfo.value = router.currentRoute.value.meta.info.detailInfo;
  option.value = router.currentRoute.value.meta.info.options;
});

const openEditDialog = () => {
  dialog.open(InfoEditor, {
    props: {
      header: $const.Edit,
      style: {
        width: '600px',
      },
      breakpoints:{
        '960px': '70vw',
        '640px': '60vw'
      },
      modal: true,
      closable: false
    },
    data: {
      item: item.value,
      option: option.value,
    },
    onClose: async (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          await getItems();
        }
      }
    }
  });
}

const getGenderIcon = (value) => ({
  0: "question",
  1: "mars",
  2: "venus",
}[value]);

</script>

<template>
  <div id="main" class="grid mt-2">
    <Toast />
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
              <div class="person-detail-cover">
                <img v-if="item.cover" :src="'https://' + item.cover" :alt="item.name" style="width: 160px" />
                <img v-else src="https://img.rakbow.com/common/error/404.jpg" :alt="item.name" style="width: 160px" />
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
                    <table class="table-borderless table-sm ml-2">
                      <tbody class="detail-item-header-table">
                      <tr>
                        <td>
                          <i class="pi pi-calendar"></i>
                          <strong>{{ $const.BirthDate }}</strong>
                        </td>
                        <td>
                          {{ item.birthDate }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-user" />
                          <strong>{{ $const.Gender }}</strong>
                        </td>
                        <td style="display:inline">
                          <i :class="'ml-1 mt-2 pi pi-' + getGenderIcon(item.gender.value)"
                             v-tooltip.right="{value: item.gender.label, class: 'short-tooltip'}" />
<!--                          <Tag class="ml-1" :value="item.gender.label" />-->
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-tags" />
                          <strong>{{ $const.Aliases }}</strong>
                        </td>
                        <td v-if="item.aliases" style="display:inline">
                          <ul class="px-4">
                            <li v-for="alias in item.aliases">
                              {{ alias }}
                            </li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="pi pi-link" />
                          <strong>{{ $const.Link }}</strong>
                        </td>
                        <td v-if="item.links" style="display:inline">
                          <ul class="px-4">
                            <li v-for="link in item.links">
                              <a v-if="link.type === META.LINK_TYPE.TWITTER" target="_blank"
                                 :href="link.url">
                                <span class="text-truncate-2 mr-2">
                                  <i class="pi pi-twitter" />
                                  <i>{{ link.name }}</i>
                                </span>
                              </a>
                              <a v-else target="_blank"
                                 :href="link.url">
                                <span class="text-truncate-2 mr-2">
                                  <i class="pi pi-at" />
                                  <i>{{ link.name }}</i>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <StatusEditor :status="item.status" />
                    <ItemLike :likeCount="pageTraffic.likeCount" :liked="pageTraffic.liked" />
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="detail-item-field">
            <!-- description -->
            <DetailPad :header="$const.Detail" :text="item.detail" />
            <!-- bonus -->
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
      <TrafficInfo :info="pageTraffic" :addedTime="item.addedTime" :editedTime="item.editedTime" />
    </div>
  </div>
</template>

<style scoped>
.person-detail-cover {
  transform:translateY(7px);
  width: 150px;
  //height: 200px;
}
</style>