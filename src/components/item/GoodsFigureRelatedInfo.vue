<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";

const loading = ref(false);

onMounted(() => {
  getExcRelatedEntries();
});

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

const materials = ref([]);
const classifications = ref([]);
const events = ref([]);

const getExcRelatedEntries = async () => {
  loading.value = true;
  const res = await axios.post(API.GET_EXC_RELATED_ENTRIES, {id: props.id});
  if (res.state === axios.SUCCESS) {
    classifications.value = res.data.classifications;
    events.value = res.data.events;
    materials.value = res.data.materials;
  }
  loading.value = false;
}

</script>

<template>
  <tr v-if="classifications.length">
    <td>
      <b>{{ $t('Classification') }}</b>
    </td>
    <td>
      <div style="display: block;">
        <template v-for="(c, index) in classifications">
          <router-link :to="`${API.SUBJECT_DETAIL}/${c.target.value}`">
            <span style="white-space: nowrap;">{{ c.target.label }}</span>
          </router-link>
          <span v-if="index < classifications.length - 1">, </span>
        </template>
      </div>
    </td>
  </tr>
  <tr v-if="events.length">
    <td>
      <b>{{ $t('Event') }}</b>
    </td>
    <td>
      <div style="display: block;">
        <template v-for="(e, index) in events">
          <router-link :to="`${API.SUBJECT_DETAIL}/${e.target.value}`">
            <span style="white-space: nowrap;">{{ e.target.label }}</span>
          </router-link>
          <span v-if="e.remark">&nbsp;({{ (e as any).remark }})</span>
          <span v-if="index < events.length - 1">, </span>
        </template>
      </div>
    </td>
  </tr>
  <tr v-if="materials.length">
    <td>
      <b>{{ $t('Material') }}</b>
    </td>
    <td>
      <div style="display: block;">
        <template v-for="(m, index) in materials">
          <router-link :to="`${API.SUBJECT_DETAIL}/${m.target.value}`">
            <span style="white-space: nowrap;">{{ m.target.label }}</span>
          </router-link>
          <span v-if="m.remark">&nbsp;({{ (m as any).remark }})</span>
          <span v-if="index < materials.length - 1">, </span>
        </template>
      </div>
    </td>
  </tr>
</template>

<style scoped>

</style>