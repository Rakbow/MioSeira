<script setup lang="ts">
import {defineAsyncComponent, defineProps, onBeforeMount, ref, toRef, watch} from "vue";
import {META} from "@/config/Web_Const";
import {useEntityStore} from "@/logic/entityService";
import {useI18n} from "vue-i18n";

const EntrySelector = defineAsyncComponent(() => import('@/components/selector/EntrySelector.vue'));

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
const store = useEntityStore();
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
      <Button variant="text" outlined @click="displayEntrySelector = true">
        <template #icon>
          <MaterialIcon name="add_box" />
        </template>
      </Button>
      <Button v-if="relatedEntries.length" variant="text" severity="danger"
              outlined @click="clearRelatedEntry()">
        <template #icon>
          <MaterialIcon name="delete_forever" />
        </template>
      </Button>
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
              v-if="type === META.ENTRY_TYPE.PERSON || type === META.ENTRY_TYPE.CHARACTER"
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
@use "@/assets/entity-manager";
@use "@/assets/entity-global";
</style>