<script setup>
import '@/assets/item-detail.css';
import '@/assets/bootstrap/myBootstrap.min.css';

import DescriptionPad from "@/components/common/DescriptionPad.vue";
import TrafficInfo from "@/components/common/TrafficInfo.vue";

import {onBeforeMount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {useToast} from "primevue/usetoast";
import StatusEditor from "@/components/common/StatusEditor.vue";
import ItemLike from "@/components/common/ItemLike.vue";

const router = useRouter();
const toast = useToast();

const item = ref({});
const pageInfo = ref({});
const detailInfo = ref({});
const itemImageInfo = ref({});
const option = ref({});

onBeforeMount(() => {
  item.value = router.currentRoute.value.meta.info.item;
  pageInfo.value = router.currentRoute.value.meta.info.pageInfo;
  detailInfo.value = router.currentRoute.value.meta.info.detailInfo;
});

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
            <!--            <div th:insert="~{template/item-detail-template :: item_common_edit_button}"></div>-->
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
                          <Tag class="ml-1" :value="item.gender.label" />
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
                      </tbody>
                    </table>
                    <StatusEditor :status="item.status" />
                    <ItemLike :likeCount="pageInfo.likeCount" :liked="pageInfo.liked" />
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="detail-item-field">
            <!-- description -->
            <DescriptionPad :header="$const.Detail" :text="item.detail" />
            <!-- bonus -->
          </div>
        </template>
      </Card>
    </div>
    <div class="col-2" style="min-width: 300px">
      <TrafficInfo :info="pageInfo" />
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