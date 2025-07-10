<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {EntityManageParam} from "@/service/entityService";
import {API, Axios} from "@/api";

const {t} = useI18n();
const index = ref(0);
const dialogRef = inject<any>('dialogRef');

const param = ref(new EntityManageParam());
onBeforeMount(async () => {
  param.value.initFilters({
    entityType: {value: dialogRef.value.data.entityType},
    entityId: {value: dialogRef.value.data.entityId},
    type: {value: -2}
  });
  param.value.initPage(0, 10);
});

onMounted(() => {
  load();
});

const onPage = (ev: any) => {
  param.value.initPage(ev.first, ev.rows);
  load();
};

const load = async () => {
  param.value.load();
  const res = await Axios.post(API.IMAGE.LIST, param.value.query);
  if (res.success()) {
    param.value.data = res.data.data;
    param.value.total = res.data.total;
    index.value = 0;
  }
  param.value.endLoad();
};

</script>

<template>
  <Galleria v-model:value="param.data" :numVisible="param.data.length" v-model:activeIndex="index"
            :showItemNavigators="true" :showThumbnailNavigators="false">
    <template v-if="!param.loading" #item="{item}">
      <img :src="item.display" :alt="item.name"/>
    </template>
    <template v-if="!param.loading" #thumbnail="{item}">
      <img :src="item.thumb" :alt="item.name"/>
    </template>
    <template v-if="!param.loading" #caption="{item}">
      <div class="grid">
        <span class="col-fixed" style="width: 10rem;font-size: 1.3rem;font-weight: 700">{{ `${param.query.first + index + 1}/${param.total}` }}</span>
        <span class="col" style="font-size: 1.5rem">{{ item.name }}</span>
        <span class="col-fixed" style="width: 18rem">{{ `${t('UploadIn')}:&nbsp;&nbsp;${item.addedTime}` }}</span>

      </div>
<!--      <div class="static w-full">-->
<!--        <span class="text-start">{{ item.name }}</span>-->
<!--        <span class="text-end">{{ item.name }}</span>-->
<!--      </div>-->
<!--      <p class="text-white">{{ item.detail }}</p>-->
    </template>
    <template #footer>
      <Paginator v-model:first="param.query.first" :rows="param.query.rows" :totalRecords="param.total"
                 @page="onPage($event)" :alwaysShow="param.total !== 0">
        <template #start>
          <span>search in {{ param.time }}s</span>
        </template>
        <template #end>
          {{ param.total }} images
        </template>
      </Paginator>
    </template>
  </Galleria>
</template>

<style lang="scss" scoped>
</style>