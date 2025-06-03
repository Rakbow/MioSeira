<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {EntityInfo, META} from "@/config/Web_Const";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";

const page = ref(1);
const size = ref(40);
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const relatedCharacters = ref([]);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
  getCharacters();
})

const getCharacters = async () => {
  let param = {
    direction: META.RELATION_RELATED_DIRECTION.POSITIVE,
    relatedGroup: META.RELATION_RELATED_GROUP.RELATED_CHAR,
    entityType: entityInfo.value?.type,
    entityId: entityInfo.value?.id
  }
  const res = await axios.post(API.GET_RELATED_ENTITY, param);
  if (res.state === axios.SUCCESS)
    relatedCharacters.value = res.data;
}
</script>

<template>
  <div class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-users"/>
        <b>{{ $t('Character') }}</b>
      </template>
      <DataView :value="relatedCharacters" layout="grid">
        <template #empty>
          <span class="empty-search-result"/>
        </template>
        <template #grid="slotProps">
          <div class="flex flex-wrap">
            <div v-for="(item, index) in slotProps.items" :key="index" style="padding: 1rem 0.5rem 0.5rem 1rem !important;">
              <div class="grid" style="border: 1px solid gray;border-radius: 10px;background: #252525">
                <div class="col-fixed" style="width: 52px;padding: 0.1rem">
                  <a class="entry-thumb-50" :href="`/db/character/${item.target.value}`">
                    <img role="presentation" :alt="item.target.label" :src="(item as any).cover"/>
                  </a>
                </div>
                <div class="col" style="width: 78px;padding: 0.1rem">
                    <span class="mt-1 block data-table-field-text-overflow-hidden text-xs">
                      <a :href="`/db/character/${item.target.value}`" class="no-underline hover:underline" :title="item.target.label">
                      {{ item.target.label }}
                      </a>
                    </span>
                  <small style="color: gray" class="mt-1 block data-table-field-text-overflow-hidden text-xs">
                    {{ item.role.label }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </Fieldset>
  </div>
</template>

<style scoped lang="scss">
@use 'entity-global';
</style>