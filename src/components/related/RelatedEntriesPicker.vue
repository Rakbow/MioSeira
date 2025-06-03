<script setup lang="ts">
import {defineAsyncComponent, defineProps, onBeforeMount, ref, toRef, watch} from "vue";
import {META} from "@/config/Web_Const";
import {useOptionsStore} from "@/store/entityOptions";
import {useI18n} from "vue-i18n";

const EntrySelector = defineAsyncComponent(() => import('@/components/common/EntrySelector.vue'));

const props = defineProps({
  relatedEntries: {
    type: Array,
    required: true
  },
  entrySearchType: {
    type: Number,
    required: true
  }
});
const {t} = useI18n();
const options = ref<any>({});
const optionsStore = useOptionsStore();
const emit = defineEmits(['update:relatedEntries']);
const relatedEntries = toRef(props, 'relatedEntries')

onBeforeMount(async () => {
  await optionsStore.fetchOptions();
  options.value = optionsStore.options;
})

watch(relatedEntries, (val) => {
  emit('update:relatedEntries', val)
}, {deep: true})

const clearRelatedEntry = () => {
  relatedEntries.value.splice(0, relatedEntries.value?.length);
  emit('update:relatedEntries', relatedEntries.value)
}
const removeRelatedEntry = (index: number) => {
  relatedEntries.value.splice(index, 1);
  emit('update:relatedEntries', relatedEntries.value)
}

const displayEntrySelector = ref(false);
</script>

<template>
  <DataView :value="relatedEntries" layout="grid">
    <template #empty>
      <span class="empty-search-result"/>
    </template>
    <template #header>
      <Button variant="text" outlined @click="displayEntrySelector = true">
        <template #icon>
          <span class="material-symbols-outlined">add_box</span>
        </template>
      </Button>
      <Button v-if="relatedEntries.length" variant="text" severity="danger"
              outlined @click="clearRelatedEntry()">
        <template #icon>
          <span class="material-symbols-outlined">delete_forever</span>
        </template>
      </Button>
    </template>
    <template #grid="slotProps">
      <div class="flex flex-wrap">
        <div v-for="(entry, index) in slotProps.items" :key="index" class="p-3">
          <div class="grid" style="border: 1px solid gray;border-radius: 5px;">
            <div class="col-fixed p-1" style="width: 45px">
              <div class="entry-thumb">
                <img role="presentation" :alt="entry.name" :src="entry.thumb"/>
              </div>
            </div>
            <div class="col p-1" style="width: 120px">
                    <span class="mt-1 block data-table-field-text-overflow-hidden text-sm">
                      {{ entry.name }}
                    </span>
              <small style="color: gray" class="mt-1 block data-table-field-text-overflow-hidden">
                {{ (entry as any).subName }}
              </small>
            </div>
            <Divider type="dashed" class="mt-0 mb-0"/>
            <div class="col p-1">
              <Select
                  v-if="entrySearchType === META.ENTRY_SEARCH_TYPE.PERSON || entrySearchType === META.ENTRY_SEARCH_TYPE.CHARACTER"
                  size="small"
                  v-model="entry.role" :options="options.roleSet" optionLabel="label" filter
                  :placeholder="$t('Role')" style="width: 100px;" class="w-full">
                <template #option="slotProps">
                  {{ slotProps.option.label }}
                </template>
              </Select>
            </div>
            <div class="col-fixed p-1">
              <Button size="small" icon="pi pi-trash" severity="danger" variant="text"
                      @click="removeRelatedEntry(index)"/>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DataView>
  <Dialog :modal="true" v-model:visible="displayEntrySelector" :style="{width: '600px'}" :header="$t('Add')">
    <EntrySelector :type="entrySearchType" :entries="relatedEntries"/>
  </Dialog>
</template>

<style scoped lang="scss">
@use "@/assets/entity-manager";
@use "@/assets/entity-global";
</style>