<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useI18n} from "vue-i18n";

const loading = ref(false);
const {t} = useI18n();
const extraInfo = ref({
  materials: <any>[],
  classifications: <any>[],
  events: <any>[]
});

onMounted(() => {
  loadExtraInfo();
});

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

const loadExtraInfo = async () => {
  loading.value = true;
  const res = await axios.post(API.ITEM_EXTRA_INFO, {id: props.id});
  if (res.state === axios.SUCCESS) extraInfo.value = res.data;
  loading.value = false;
}

</script>

<template>
  <tr v-if="extraInfo.classifications.length">
    <td>
      <b>{{ t('Classification') }}</b>
    </td>
    <td>
      <div style="display: block;">
        <template v-for="(c, index) in extraInfo.classifications">
          <router-link :to="`${API.ENTRY_DETAIL_PATH}/${c.target.value}`">
            <span style="white-space: nowrap;">{{ c.target.label }}</span>
          </router-link>
          <span v-if="index < extraInfo.classifications.length - 1">, </span>
        </template>
      </div>
    </td>
  </tr>
  <tr v-if="extraInfo.events.length">
    <td>
      <b>{{ t('Event') }}</b>
    </td>
    <td>
      <div style="display: block;">
        <template v-for="(e, index) in extraInfo.events">
          <router-link :to="`${API.ENTRY_DETAIL_PATH}/${e.target.value}`">
            <span style="white-space: nowrap;">{{ e.target.label }}</span>
          </router-link>
          <span v-if="e.remark">&nbsp;({{ (e as any).remark }})</span>
          <span v-if="index < extraInfo.events.length - 1">, </span>
        </template>
      </div>
    </td>
  </tr>
  <tr v-if="extraInfo.materials.length">
    <td>
      <b>{{ t('Material') }}</b>
    </td>
    <td>
      <div style="display: block;">
        <template v-for="(m, index) in extraInfo.materials">
          <router-link :to="`${API.ENTRY_DETAIL_PATH}/${m.target.value}`">
            <span style="white-space: nowrap;">{{ m.target.label }}</span>
          </router-link>
          <span v-if="m.remark">&nbsp;({{ (m as any).remark }})</span>
          <span v-if="index < extraInfo.materials.length - 1">, </span>
        </template>
      </div>
    </td>
  </tr>
</template>

<style scoped>

</style>