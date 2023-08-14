<script setup>

import {MdEditor} from "md-editor-v3";
</script>

<template>
  <BlockUI :blocked="editBlock">
    <MdEditor v-model="bonusMd" preview-theme="github" />
    <div class="text-end mt-3 mb-2">
      <Button icon="pi pi-times" label="取消" @click="closeBonusEditDialog"
                class="p-button-text" />
      <Button icon="pi pi-save" label="保存" @click="submitBonus" />
    </div>
    <Panel>
      <div v-if="images.length != 0">
        <DataTable :value="images" class="p-datatable-sm" striped-rows>
          <template #header>
            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
              <span class="text-xl text-900 font-bold ml-10">图片列表</span>
            </div>
          </template>
          <Column header-style="width: 5%">
            <template #body="slotProps">
              <Button icon="pi pi-copy" @click="copyImageUrl(slotProps.data.url)"></Button>
            </template>
          </Column>
          <Column header="图片" header-style="width: 8%">
            <template #body="slotProps">
              <img :src="slotProps.data.thumbUrl50" :alt="slotProps.data.nameEn"
                   class="edit-image"/>
            </template>
          </Column>
          <Column field="nameZh" header="名(中)" header-style="width: 10%"></Column>
          <Column field="nameEn" header="名(英)" header-style="width: 10%"></Column>
          <Column field="description" header="描述" header-style="width: 20%"></Column>
        </DataTable>
      </div>
      <div v-else>
        <span class="emptyInfo"><em>暂无图片</em></span>
      </div>
    </Panel>
  </BlockUI>
</template>

<style scoped>

</style>