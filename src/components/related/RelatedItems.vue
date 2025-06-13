<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {EntityInfo} from "@/config/Web_Const";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute, useRouter} from "vue-router";
const ItemPopover = defineAsyncComponent(() => import('@/components/item/ItemPopover.vue'));

const records = ref(0);
const page = ref(1);
const size = ref(24);
const entityInfo = ref<EntityInfo>();
const loading = ref(false);
const route = useRoute();
const router = useRouter();
const relatedItems = ref([]);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
})

onMounted(() => {
  getRelatedItems();
})

const onPage = (ev) => {
  page.value = ev.page + 1;
  getRelatedItems();
}

const getRelatedItems = async () => {
  loading.value = true;
  let param = {
    entries: [{
      entityType: entityInfo.value?.type,
      entityId: entityInfo.value?.id
    }],
    page: page.value,
    size: size.value,
    sortField: 'releaseDate',
    sortOrder: -1
  }
  const res = await axios.post(API.ITEM_SEARCH, param);
  if (res.state === axios.SUCCESS) {
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
        <b>{{ $t('RelatedItem') }}</b>
      </template>
      <RouterLink v-if="records" class="ml-4" :to="`${API.ITEM_SEARCH_PATH}?entry=${entityInfo?.type},${entityInfo?.id}`">
        <span>{{records}}&nbsp;<i class="pi pi-angle-double-right" style="font-size: 11px" /></span>
      </RouterLink>
      <DataView :value="relatedItems" layout="grid">
        <template #empty>
          <span class="empty-search-result"/>
        </template>
        <template #grid="slotProps">
          <div class="flex flex-wrap">
            <div v-for="(item, index) in slotProps.items" :key="index" class="p-2">
              <a :href="`${API.ITEM_DETAIL}/${item.id}`" :class="`item-thumb item-thumb-${item.type.value}-${item.subType.value}`">
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