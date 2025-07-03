<script setup lang="ts">
import {defineProps, onBeforeMount, onMounted, ref} from "vue";
import {findRelationConfig} from "@/logic/entityService";
import {META, QueryParams} from "@/config/Web_Const";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import Relation from "@/components/related/Relation.vue";
import {useI18n} from "vue-i18n";

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
      targetEntityType: {value: META.ENTITY.ENTRY},
      targetEntitySubTypes: {value: []}
    }
  }
  config.value = findRelationConfig([props.type, props.subType]);
  getData();
})

const getData = async () => {
  const requests = config.value.subTypeSets.map(async subTypes => {
        queryParams.value.filters.targetEntitySubTypes.value = subTypes;
        return axios.post(API.RELATION_LIST, queryParams.value);
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
  <div v-if="resultSet.length" v-for="(subTypes, index) of config.subTypeSets">
    <Relation :header="t('RelatedEntry')" :type="props.type" :id="props.id" :subType="props.subType"
              :targetSubTypes="subTypes" :total="resultSet[index].total" :entities="resultSet[index].data"
              :showRole="props.showRole"/>
  </div>
</template>

<style scoped lang="scss">

</style>