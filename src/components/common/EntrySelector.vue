<template>
  <div class="card">
    <BlockUI :blocked="loading">
      <DataView :value="entries" lazy paginator
                :rows="queryParam.param.row" :first="queryParam.param.first" :totalRecords="totalRecords"
                @update:first="first" @page="page($event)">
        <template #list="slotProps">

          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="grid">
              <div class="edit-img-box col-3"><img class="edit-image " :src="`https://${item.cover}`" :alt="item.name" /></div>
              <div class="col-8">
                <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ (item as any).subName }}</span>
              </div>
              <div class="col-1 flex align-items-center justify-content-center">
                <Button icon="pi pi-check" outlined/>
              </div>
            </div>
          </div>
<!--          <div class="flex flex-col">-->
<!--            <div v-for="(item, index) in slotProps.items" :key="index">-->
<!--              <div class="grid">-->
<!--                <div class="edit-img-box col"><img class="edit-image" :src="`https://${item.cover}`" :alt="item.name" /></div>-->
<!--                <div class="col">-->
<!--                  <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ (item as any).subName }}</span>-->
<!--                  <div class="text-lg font-medium mt-2">{{ item.name }}</div>-->
<!--                </div>-->
<!--                <div class="col">-->
<!--                  <Button icon="pi pi-check" outlined/>-->
<!--                </div>-->
<!--              </div>-->

<!--&lt;!&ndash;              <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-1" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="md:w-40 relative">&ndash;&gt;-->
<!--&lt;!&ndash;                  <img class="block xl:block mx-auto rounded w-full" :src="`https://${item.cover}`" :alt="item.name" />&ndash;&gt;-->
<!--&lt;!&ndash;                  &lt;!&ndash;                <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">&ndash;&gt;-->
<!--&lt;!&ndash;                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">&ndash;&gt;-->
<!--&lt;!&ndash;                    <div>&ndash;&gt;-->
<!--&lt;!&ndash;                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ (item as any).subName }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;                      <div class="text-lg font-medium mt-2">{{ item.name }}</div>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                    &lt;!&ndash;                  <div class="bg-surface-100 p-1" style="border-radius: 30px">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                    &lt;!&ndash;                    <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                    &lt;!&ndash;                      <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                    &lt;!&ndash;                      <i class="pi pi-star-fill text-yellow-500"></i>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                    &lt;!&ndash;                    </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                    &lt;!&ndash;                  </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  <div class="flex flex-col md:items-end gap-8">&ndash;&gt;-->
<!--&lt;!&ndash;                    &lt;!&ndash;                  <span class="text-xl font-semibold">${{ item.price }}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                    <div class="flex flex-row-reverse md:flex-row gap-2">&ndash;&gt;-->
<!--&lt;!&ndash;                      <Button icon="pi pi-check" outlined/>&ndash;&gt;-->
<!--&lt;!&ndash;                      &lt;!&ndash;                    <Button icon="pi pi-heart" outlined></Button>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                      &lt;!&ndash;                    <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--            </div>-->
<!--          </div>-->
        </template>
      </DataView>
    </BlockUI>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {AxiosHelper as axios} from '@/toolkit/axiosHelper';
import {META} from "@/config/Web_Const";
import {API} from "@/config/Web_Helper_Strs";

onMounted(() => {
  getEntries();
});

const entries = ref();
const totalRecords = ref(0);
const loading = ref(false);
const queryParam = ref({
  entityType: META.ENTITY.PERSON,
  param: {
    keyword: "",
    first: 0,
    row: 5
  }
})

const first = (value) => {
  queryParam.value.param.first = value;
  getEntries();
}

const page = (ev) => {
  queryParam.value.param.first = ev.first;
  queryParam.value.param.row = ev.rows;
  getEntries();
}

const getEntries = async () => {
  loading.value = true;
  const res = await axios.post(API.SEARCH_ENTRIES, queryParam.value);
  if(res.state === axios.SUCCESS) {
    totalRecords.value = res.data.total;
    entries.value = res.data.data;
  }
  loading.value = false;
};
</script>

<style lang="scss" scoped>
.edit-img-box {
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red; /* 方便查看边框 */
}
</style>