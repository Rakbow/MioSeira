<script setup>
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/utils/publicHelper";
import {AxiosHelper as axios} from "@/utils/axiosHelper";
import {useRoute} from "vue-router";


const editor = defineAsyncComponent(() => import('@/components/common/RelationEditor.vue'));
const $const = getCurrentInstance().appContext.config.globalProperties.$const;
const $api = getCurrentInstance().appContext.config.globalProperties.$api;

onBeforeMount(() => {
  // relatedItems.value = props.relations;
});

onMounted(() => {
  getEntityInfo();
  getRelations();
});
// const props = defineProps({
//   relations: {
//     type: Array,
//     required: true,
//   },
// });

const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const entityType = ref();
const entityId = ref();
const relatedItems = ref({});
const editBlock = ref(false);

const openEditDialog = () => {
  dialog.open(editor, {
    props: {
      header: $const.Relation,
      style: {
        width: '60vw',
      },
      breakpoints: {
        '960px': '60vw',
        '640px': '40vw'
      },
      modal: true,
      closable: false
    },
    data: {
      relatedItems: relatedItems.value
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          getRelations();
        }
      }
    }
  });
}

const getRelations = async () => {
  editBlock.value = true;
  let param = {
    entityType: entityType.value,
    entityId: entityId.value
  }
  const res = await axios.post($api.GET_RELATION, param);
  if (res.state === axios.SUCCESS)
    relatedItems.value = res.data;
  editBlock.value = false;
}

const getEntityInfo = () => {
  let typeName = route.path.split('/')[2];
  entityType.value = PublicHelper.getEntityType(typeName);
  entityId.value = route.params.id;
}

</script>

<template>
  <Panel class="mt-2">
    <template #header>
      <span class="text-start side-panel-header">
          <i class="pi pi-list"/><span><strong>{{ $const.RelatedItem }}</strong></span>
      </span>
    </template>
    <template #icons>
      <div v-if="userStore.user">
        <Button v-if="userStore.user.type > 1" class="p-panel-header-icon p-link mr-2" text rounded
                @click="openEditDialog" v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}">
          <span class="pi pi-cog"/>
        </Button>
      </div>
    </template>
    <BlockUI :blocked="editBlock">
      <div class="grid" v-if="relatedItems.length > 0">
          <span class="small_font">
              <div class="info_bit_small small_font grid m-0 p-0"
                   v-if="relatedItems.length !== 0"
                   v-for="item of relatedItems">
                  <div class="sidebar-panel-image-small-div album_info_bit_thumb mt-2">
                      <a :href="'/db/' + PublicHelper.getEntityPath(item.entityType.value) + '/' + item.entityId">
                          <img class="sidebar-panel-image-small" :src="item.cover" alt=""
                               v-tooltip.bottom="item.name + '\n' + item.nameZh + '\n' + item.nameEn">
                      </a>
                  </div>
                  <div class="col p-0" style="height: 80px">
                      <ul class="info_bit_small_other">
                        <li>
                          <span class="small_font col-6 related-item-date">
                              {{ item.relationType.label }}
                          </span>
                        </li>
                        <li>
                            <a class="small_font"
                               :href="'/db/' + PublicHelper.getEntityPath(item.entityType.value) + '/' + item.entityId">
                                <span class="text-truncate-2 mr-2">
                                    {{ `${item.name}(${item.label})` }}
                                </span>
                            </a>
                        </li>
                        <li>
                          <span class="small_font col-6 related-item-catalog">
                              {{ `${item.nameZh}(${item.label})` }}
                          </span>
                        </li>
                      </ul>
                  </div>
              </div>
          </span>
      </div>
      <div v-else>
        <span class="emptyInfo"><em>{{ $const.NoInfo }}</em></span>
      </div>
    </BlockUI>
  </Panel>
</template>

<style scoped>

</style>