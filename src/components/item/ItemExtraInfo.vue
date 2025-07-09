<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {API, Axios} from "@/api";
import {useI18n} from "vue-i18n";

const entity = inject<Entity>('entity');
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

const loadExtraInfo = async () => {
  loading.value = true;
  const res = await Axios.post(API.ITEM.EXTRA_INFO, {id: entity!.id});
  if (res.success()) extraInfo.value = res.data;
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
          <router-link :to="`${$api.ENTRY.DETAIL_PATH}/${c.target.entityId}`">
            <span style="white-space: nowrap;">{{ c.target.name }}</span>
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
          <router-link :to="`${$api.ENTRY.DETAIL_PATH}/${e.target.entityId}`">
            <span style="white-space: nowrap;">{{ e.target.name }}</span>
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
          <router-link :to="`${$api.ENTRY.DETAIL_PATH}/${m.target.entityId}`">
            <span style="white-space: nowrap;">{{ m.target.name }}</span>
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