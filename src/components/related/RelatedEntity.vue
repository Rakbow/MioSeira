<script setup lang="ts">
import {defineProps, onBeforeMount, ref} from "vue";

onBeforeMount(() => {
  if(props.entity.target.entityType === 0) {
    path.value = 'item';
  }else if(props.entity.target.entityType === 1) {
    path.value = 'entry';
  }
})

const props = defineProps({
  entity: {
    type: Object,
    required: true
  } as any,
  showRole: {
    type: Boolean,
    default: false
  }
});
const path = ref();
</script>

<template>
  <div class="related-entity" style="background: var(--r-bg-neutral-950)">
    <div class="related-entity-thumb">
      <img role="presentation" :alt="entity.target.name" :src="entity.target.thumb"/>
    </div>
    <div class="related-entity-info">
      <a :href="`/db/${path}/${entity.target.entityId}`" :title="entity.target.name">
        {{ entity.target.name }}
      </a>
      <small :title="entity.target.subName">
        {{ (entity as any).target.subName }}
      </small>
    </div>
    <div class="related-entity-role">
      <Tag v-if="showRole" :value="entity.target.role.label"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>