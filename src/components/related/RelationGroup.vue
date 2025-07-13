<script setup lang="ts">
import {defineProps, inject, onMounted, ref} from "vue";
import {findRelationConfig} from "@/service/entityService";
import {API, Axios} from "@/api";
import Relation from "@/components/related/Relation.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const config = ref<any>();
const resultSet = ref<any>([]);
const entity = inject<Entity>('entity');
const props = defineProps({
  showRole: {
    type: Boolean,
    required: false,
    default: true
  }
});

onMounted(() => {
  config.value = findRelationConfig([entity!.type, entity!.subType]);
  load();
})

const load = async () => {
  let param = {
    entityType: entity!.type,
    entityId: entity!.id,
    entryTypeSets: [],
    size: 5
  }
  config.value.subConfigs.map(s => param.entryTypeSets.push(s.value));
  const res = await Axios.post(API.RELATION.ENTRIES, param);
  if (res.success()) {
    resultSet.value = res.data;
  }
}


</script>

<template>
  <div v-if="resultSet.length" v-for="(subConfig, index) of config.subConfigs">
    <Relation :header="t(subConfig.label)" :icon="subConfig.icon" :targetSubTypes="subConfig.value" :total="resultSet[index].total"
              :entities="resultSet[index].data" :showRole="props.showRole"/>
  </div>
</template>

<style scoped lang="scss">

</style>