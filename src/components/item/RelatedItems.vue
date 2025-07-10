<script setup lang="ts">
import {defineAsyncComponent, inject, onMounted, ref} from "vue";
import {API, Axios} from "@/api";
import {useI18n} from "vue-i18n";
import {EditParam} from "@/service/entityService";

const ItemPopover = defineAsyncComponent(() => import('@/components/item/ItemPopover.vue'));

const {t} = useI18n();
const records = ref(0);
const page = ref(1);
const size = ref(24);
const entity = inject<Entity>('entity')!;
const relatedItems = ref([]);
const param = ref(new EditParam());

onMounted(() => {
  getRelatedItems();
});
const getRelatedItems = async () => {
  param.value.block = true;
  param.value.data = {
    entries: [entity!.id],
    page: page.value,
    size: size.value,
    sortField: 'releaseDate',
    sortOrder: -1
  }
  const res = await Axios.post(API.ITEM.SEARCH, param.value.data);
  if (res.success()) {
    if (res.data.data === null)
      relatedItems.value = [];
    else
      relatedItems.value = res.data.data;
    records.value = res.data.total;
  }
  param.value.block = false;
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
  <BlockUI :blocked="param.block" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-th-large"/>
        <b>{{ t('RelatedItem') }}</b>
      </template>
      <RouterLink v-if="records" class="ml-4" :to="`${$api.ITEM.SEARCH_PATH}?entry=${entity.id}`">
        <span>{{records}}&nbsp;<i class="pi pi-angle-double-right" style="font-size: 1.3rem" /></span>
      </RouterLink>
      <DataView :value="relatedItems" layout="grid">
        <template #empty>
          <span class="empty-search-result"/>
        </template>
        <template #grid="slotProps">
          <div class="flex flex-wrap">
            <div v-for="(item, index) in slotProps.items" :key="index" class="p-2">
              <a :href="`${$api.ITEM.DETAIL_PATH}/${item.id}`" :class="`item-thumb item-thumb-${item.type.value}-${item.subType.value}`">
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