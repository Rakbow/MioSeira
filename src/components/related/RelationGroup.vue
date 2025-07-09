<script setup lang="ts">
import {defineProps, getCurrentInstance, inject, onMounted, ref} from "vue";
import {findRelationConfig} from "@/service/entityService";
import {QueryParams} from "@/config/Web_Const";
import {API, Axios} from "@/api";
import Relation from "@/components/related/Relation.vue";
import {useI18n} from "vue-i18n";

const { proxy } = getCurrentInstance()!;
const {t} = useI18n();
const queryParams = ref(new QueryParams());
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
  queryParams.value = {
    first: 0,
    rows: 5,
    sortField: null,
    sortOrder: null,
    filters: {
      entityType: {value: entity!.type},
      entityId: {value: entity!.id},
      targetEntityType: {value: proxy!.$const.ENTITY.ENTRY},
      targetEntitySubTypes: {value: []}
    }
  }
  config.value = findRelationConfig([entity!.type, entity!.subType]);
  getData();
})

const getData = async () => {
  const requests = config.value.subConfigs.map(async subConfig => {
        queryParams.value.filters.targetEntitySubTypes.value = subConfig.value;
        return Axios.post(API.RELATION.LIST, queryParams.value);
      }
  );
  const responses = await Promise.all(requests);
  responses.forEach((res) => {
    resultSet.value.push(
        {
          data: res.data.data,
          total: res.data.total
        }
    )
  });
}


</script>

<template>
  <div v-if="resultSet.length" v-for="(subConfig, index) of config.subConfigs">
    <Relation :header="t(subConfig.label)" :targetSubTypes="subConfig.value" :total="resultSet[index].total"
              :entities="resultSet[index].data" :showRole="props.showRole"/>
  </div>
</template>

<style scoped lang="scss">

</style>