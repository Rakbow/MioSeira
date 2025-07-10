<script setup lang="ts">
import {defineAsyncComponent, defineProps, onBeforeMount, ref, toRef, watch} from "vue";
import {useOptionStore} from "@/store/modules/option";
import {useI18n} from "vue-i18n";

const EntrySelector = defineAsyncComponent(() => import('@/components/entry/EntrySelector.vue'));

const props = defineProps({
  relatedEntries: {
    type: Array,
    required: true
  },
  type: {
    type: Number,
    required: true
  }
});
const {t} = useI18n();
const store = useOptionStore();
const emit = defineEmits(['update:relatedEntries']);
const relatedEntries = toRef(props, 'relatedEntries')

onBeforeMount(() => {
  store.fetchOptions();
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
      <RButton @click="displayEntrySelector = true" action="create"/>
      <RButton @click="clearRelatedEntry" action="clear" v-if="relatedEntries.length"/>
    </template>
    <template #grid="{items}">
      <div class="related-create-entity" style="margin: 1rem" v-for="(entry, index) in items as any[]" :key="index">
        <div class="related-create-entity-thumb">
          <img role="presentation" :alt="entry.name" :src="entry.thumb"/>
        </div>
        <div class="related-create-entity-info">
          <span :title="entry.name">{{ entry.name }}</span><br>
          <small :title="entry.subName">{{ entry.subName }}</small>
        </div>
        <Divider type="dashed"/>
        <div class="related-create-entity-action">
          <Select v-model="entry.role" :placeholder="t('Role')" size="small"
              v-if="type === $const.ENTRY_TYPE.PERSON || type === $const.ENTRY_TYPE.CHARACTER"
              :options="store.options.roleSet" optionLabel="label" filter>
            <template #option="{option}">
              {{ option!.label }}
            </template>
          </Select>
        </div>
        <div class="fixed-col">
          <Button size="small" icon="pi pi-trash" severity="danger" variant="text"
                  @click="removeRelatedEntry(index)"/>
        </div>
      </div>
    </template>
  </DataView>
  <Dialog :modal="true" v-model:visible="displayEntrySelector" :style="{width: '60rem'}" :header="t('Add')">
    <EntrySelector :type="type" :entries="relatedEntries"/>
  </Dialog>
</template>

<style scoped lang="scss">
@use "@/styles/entity-manager";
@use "@/styles/entity-global";
</style>