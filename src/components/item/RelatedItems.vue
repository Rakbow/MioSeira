<script setup lang="ts">
import {defineAsyncComponent, inject, onMounted, ref} from "vue";
import {API, Axios} from "@/api";
import {useI18n} from "vue-i18n";
import {EditParam} from "@/service/entityService";

const ItemPopover = defineAsyncComponent(() => import('@/components/item/ItemPopover.vue'));

const {t} = useI18n();
const entity = inject<Entity>('entity')!;
const param = ref(new EditParam());
const result = ref<SearchResult>({
  data: [],
  total: 0,
  time: ''
});

onMounted(() => {
  load();
});
const load = async () => {
  param.value.block = true;
  param.value.data = {
    id: entity!.id,
    size: 24
  }
  const res = await Axios.post(API.RELATION.ITEMS, {id: entity!.id, size: 24});
  if (res.success()) {
    result.value = res.data;
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
  <BlockUI :blocked="param.block" class="entity-detail-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-th-large"/>
        <b>{{ t('RelatedItem') }}</b>
      </template>
      <RouterLink v-if="result.total" class="ml-4" :to="`${$api.ITEM.SEARCH_PATH}?entries=${entity.id}`">
        <span>{{result.total}}&nbsp;<i class="pi pi-angle-double-right" style="font-size: 1.3rem" /></span>
      </RouterLink>
      <DataView :value="result.data" layout="grid">
        <template #empty>
          <span class="empty-search-result"/>
        </template>
        <template #grid="{items}">
          <div class="flex flex-wrap">
            <div v-for="(item, index) in items" :key="index" class="p-2">
              <router-link :to="`${$api.ITEM.DETAIL_PATH}/${item.id}`"
                           @pointerover="startHover($event, item)" @pointerleave="endHover"
                           :class="`item-thumb-grid item-thumb-grid-${item.type.value}-${item.subType.value}`">
                <img role="presentation" :alt="item.id" :src="item.thumb"/>
              </router-link>
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
@import "@/styles/entity-search";
</style>