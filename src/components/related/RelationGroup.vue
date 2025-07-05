<script setup lang="ts">
import {defineProps, getCurrentInstance, onMounted, ref} from "vue";
import {findRelationConfig} from "@/logic/entityService";
import {QueryParams} from "@/config/Web_Const";
import {API, Axios} from "@/api";
import Relation from "@/components/related/Relation.vue";
import {useI18n} from "vue-i18n";

const { proxy } = getCurrentInstance();
const {t} = useI18n();
const queryParams = ref(new QueryParams());
const config = ref<any>();
const resultSet = ref<any>([]);
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  subType: {
    type: Number,
    required: true
  },
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
      entityType: {value: props.type},
      entityId: {value: props.id},
      targetEntityType: {value: proxy.$const.ENTITY.ENTRY},
      targetEntitySubTypes: {value: []}
    }
  }
  config.value = findRelationConfig([props.type, props.subType]);
  getData();
})

const getData = async () => {
  const requests = config.value.subConfigs.map(async subConfig => {
        queryParams.value.filters.targetEntitySubTypes.value = subConfig.value;
        return Axios.post(API.RELATION_LIST, queryParams.value);
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
    <Relation :header="t(subConfig.label)" :type="props.type" :id="props.id" :subType="props.subType"
              :targetSubTypes="subConfig.value" :total="resultSet[index].total" :entities="resultSet[index].data"
              :showRole="props.showRole"/>
  </div>
</template>

<style scoped lang="scss">

</style>