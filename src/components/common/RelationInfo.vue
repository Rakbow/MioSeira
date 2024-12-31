<script setup lang="ts">
import '@/assets/entity-detail.scss';
import {defineAsyncComponent, onBeforeMount, ref} from 'vue';
import {useUserStore} from "@/store/user.ts";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper.ts";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper.ts";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {API} from "@/config/Web_Helper_Strs";
import {EntityInfo, META} from "@/config/Web_Const";
const editor = defineAsyncComponent(() => import('@/components/common/RelationEditor.vue'));

const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
  getRelations();
});

const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const relatedEntities = ref({});
const editBlock = ref(false);

const openEditDialog = () => {
  dialog.open(editor, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '900px',
      },
      modal: true,
      closable: true
    },
    data: {
      relatedGroup: META.RELATION_RELATED_GROUP.RELATED_PRODUCT,
      direction: META.RELATION_RELATED_DIRECTION.POSITIVE
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
    relatedGroup: META.RELATION_RELATED_GROUP.RELATED_PRODUCT,
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id,
    direction: META.RELATION_RELATED_DIRECTION.POSITIVE,
  }
  const res = await axios.post(API.GET_RELATED_ENTITY, param);
  if (res.state === axios.SUCCESS)
    relatedEntities.value = res.data;
  editBlock.value = false;
}

const relatedEntitiesTotal = 0;

</script>

<template>
  <div class="mt-2 entity-detail-side-panel">
    <Panel>
      <template #header>
        <span>
            <i class="pi pi-list"/><span><strong>{{ $t('RelatedProduct') }}</strong></span>
        </span>
      </template>
      <template #icons>
        <Button v-if="userStore.user && userStore.user.type > 1" class="p-panel-header-icon p-link ml-2" text rounded
                @click="openEditDialog" v-tooltip.bottom="{value: $t('Edit'), class: 'short-tooltip'}">
          <span class="pi pi-cog"/>
        </Button>
        <Button :label="relatedEntitiesTotal.toString()" severity="success" size="small" outlined class="mr-2"
                @click="" :disabled="!relatedEntities.length"
                v-tooltip.bottom="{value: $t('ViewAll'), class: 'common-tooltip'}" />
      </template>
      <BlockUI :blocked="editBlock">
        <div class="grid" v-if="relatedEntities.length > 0">
            <span class="small_font">
                <div class="info_bit_small small_font grid m-0 p-0"
                     v-if="relatedEntities.length !== 0"
                     v-for="entity of relatedEntities">
                    <div class="sidebar-panel-image-small-div item_info_bit_thumb mt-2">
                        <a :href="`/db/${(entity as any).relatedTypeName}/${entity.target.value}`">
                            <img class="sidebar-panel-image-small" :src="entity.cover" alt="">
                        </a>
                    </div>
                    <div class="col p-0" style="height: 80px">
                        <ul class="info_bit_small_other">
                          <li>
                              <a class="small_font"
                                 :href="`/db/${(entity as any).relatedTypeName}/${entity.target.value}`">
                                  <span class="text-truncate-2 mr-2">
                                      {{ `${entity.target.label}(${(entity as any).remark})` }}
                                  </span>
                              </a>
                          </li>
                          <li>
                            <Tag class="small-font" :value="entity.role.label" />
                          </li>
                          <!--                        <li>-->
                          <!--                          <span class="small_font col-6 related-item-catalog">-->
                          <!--                              {{ `${entity.nameZh}(${entity.label})` }}-->
                          <!--                          </span>-->
                          <!--                        </li>-->
                        </ul>
                    </div>
                </div>
            </span>
        </div>
        <div class="pt-2" v-else>
          <span class="empty-search-result">{{ $t('NoInfo') }}</span>
        </div>
      </BlockUI>
    </Panel>
  </div>
</template>

<style scoped lang="scss">
</style>