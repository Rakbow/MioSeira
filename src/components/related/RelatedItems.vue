<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {EntityInfo} from "@/config/Web_Const";
import {API, Axios} from "@/api";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
const ItemPopover = defineAsyncComponent(() => import('@/components/item/ItemPopover.vue'));

const {t} = useI18n();
const records = ref(0);
const page = ref(1);
const size = ref(24);
const entityInfo = ref<EntityInfo>();
const loading = ref(false);
const route = useRoute();
const relatedItems = ref([]);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});

onMounted(() => {
  getRelatedItems();
});
const getRelatedItems = async () => {
  loading.value = true;
  let param = {
    entries: [entityInfo.value?.id],
    page: page.value,
    size: size.value,
    sortField: 'releaseDate',
    sortOrder: -1
  }
  const res = await Axios.post(API.ITEM_SEARCH, param);
  if (res.success()) {
    if (res.data.data === null)
      relatedItems.value = [];
    else
      relatedItems.value = res.data.data;
    records.value = res.data.total;
  }
  loading.value = false;
}

//region pop

const selectedItem = ref();
const op = ref();
const startHover = (event: PointerEvent, item: any) => {
  selectedItem.value = item;
  op.value.show(event);
};

const endHover = () => {
  op.value.hide();
};

//endregion
</script>

<template>
  <BlockUI :blocked="loading" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-th-large"/>
        <b>{{ t('RelatedItem') }}</b>
      </template>
      <RouterLink v-if="records" class="ml-4" :to="`${API.ITEM_SEARCH_PATH}?entry=${entityInfo?.id}`">
        <span>{{records}}&nbsp;<i class="pi pi-angle-double-right" style="font-size: 1.3rem" /></span>
      </RouterLink>
      <DataView :value="relatedItems" layout="grid">
        <template #empty>
          <span class="empty-search-result"/>
        </template>
        <template #grid="slotProps">
          <div class="flex flex-wrap">
            <div v-for="(item, index) in slotProps.items" :key="index" class="p-2">
              <a :href="`${API.ITEM_DETAIL_PATH}/${item.id}`" :class="`item-thumb item-thumb-${item.type.value}-${item.subType.value}`">
                <img role="presentation" :alt="item.id" :src="(item as any).thumb"
                     @pointerover="startHover($event, item)" @pointerleave="endHover"/>
              </a>
            </div>
          </div>
        </template>
      </DataView>
    </Fieldset>
  </BlockUI>

  <Popover ref="op">
    <ItemPopover :item="selectedItem" />
  </Popover>

</template>

<style scoped lang="scss">
</style>