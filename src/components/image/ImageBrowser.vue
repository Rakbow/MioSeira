<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {EntitySearchParam} from "@/service/entityService";
import {API, Axios} from "@/api";

const {t} = useI18n();
const index = ref(0);
const dialogRef = inject<any>('dialogRef');

const param = ref(new EntitySearchParam());
onBeforeMount(async () => {
  param.value.initFilters({
    entityType: {value: dialogRef.value.data.entityType},
    entityId: {value: dialogRef.value.data.entityId},
    type: {value: -2}
  });
  param.value.query.size = 10;
});

onMounted(() => {
  load();
});

const onPage = (ev: any) => {
  param.value.initPage(ev.page + 1);
  load();
};

const load = async () => {
  param.value.load();
  const res = await Axios.post(API.IMAGE.LIST, param.value.query);
  if (res.success()) {
    param.value.loadResult(res.data);
    index.value = 0;
  }
  param.value.endLoad();
};

</script>

<template>
  <Galleria v-model:value="param.result.data" :numVisible="param.data.length" v-model:activeIndex="index"
            :showItemNavigators="true" :showThumbnailNavigators="false">
    <template v-if="!param.loading" #item="{item}">
      <img :src="item.display" :alt="item.name"/>
    </template>
    <template v-if="!param.loading" #thumbnail="{item}">
      <img :src="item.thumb" :alt="item.name"/>
    </template>
    <template v-if="!param.loading" #caption="{item}">
      <div class="grid">
        <span class="col-fixed" style="width: 10rem;font-size: 1.3rem;font-weight: 700">
          {{ `${(param.query.page - 1) * param.query.size + index + 1}/${param.result.total}` }}
        </span>
        <span class="col" style="font-size: 1.5rem">{{ item.name }}</span>
        <span class="col-fixed" style="width: 20rem">{{ `${t('UploadIn')}:&nbsp;&nbsp;${item.addedTime}` }}</span>

      </div>
    </template>
    <template #footer>
      <RPaginator v-model:page="param.query.page" v-model:size="param.query.size"
                  :total="param.result.total" @page="onPage($event)" :time="param.result.time"/>
    </template>
  </Galleria>
</template>

<style lang="scss" scoped>
</style>