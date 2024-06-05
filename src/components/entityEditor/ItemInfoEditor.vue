<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import * as fs from "node:fs";
import {useDialog} from "primevue/usedialog";
import configJson from '@/components/entityEditor/ItemConfig.json';
const {t} = useI18n();
const dialog = useDialog();
const dialogRef = inject("dialogRef");
const config: ref<ItemConfig> = ref();

const item: ref<any> = ref();

class ItemConfig {
  type: number;
  components: [ItemComp];
}

class ItemComp {
  type: number = 0; // 0-InputText 1-InputNumber 2-InputMask 3-select 4-MultiSelect 5-ToggleSwitch 6-Textarea
  options: any = null;
  label: string = '';
  model: string = '';
  row: number;
  col: number;
  span: number;
  placeholder: string = '';
  required: boolean = false;
}

onBeforeMount(() => {
  config.value = configJson as ItemConfig;
  item.value = dialogRef.value.data.item;
})

onMounted(() => {
})

const editBlock = ref(false);
</script>

<template>
  <BlockUI :blocked="editBlock" class="p-fluid">
    <div class="formgrid grid">
      <div v-for="component of config.components">
        <label>{{ $t(component.label) }}<span v-if="component.required" style="color: red">*</span></label>
        <InputText v-if="component.type === 0" v-model="item![component.model]"
                   :class="'col-' + component.span"
                   :style="'grid-row: ' + component.row + '; grid-column: ' + component.col" />
        <InputNumber v-if="component.type === 1" v-model="item![component.model]"
                     :class="'col-' + component.span"
                     :style="'grid-row: ' + component.row + '; grid-column: ' + component.col" />
        <InputMask v-if="component.type === 2" v-model="item![component.model]" mask="****/**/**"
                   :class="'col-' + component.span"
                   :style="'grid-row: ' + component.row + '; grid-column: ' + component.col" />
        <select v-if="component.type === 3" v-model="item![component.model]" :options="component.options"
                optionLabel="label" optionValue="value" :placeholder="$t(component.placeholder)"
                :class="'col-' + component.span"
                :style="'grid-row: ' + component.row + '; grid-column: ' + component.col" />
        <MultiSelect v-if="component.type === 4" v-model="item![component.model]" :options="component.options"
                     optionLabel="label" optionValue="value" display="chip"
                     :class="'col-' + component.span"
                     :style="'grid-row: ' + component.row + '; grid-column: ' + component.col" />
        <ToggleSwitch v-if="component.type === 5" v-model="item![component.model]"
                      :class="'col-' + component.span"
                      :style="'grid-row: ' + component.row + '; grid-column: ' + component.col" />
        <Textarea v-if="component.type === 6" v-model="item![component.model]"
                  rows="3" cols="20" :autoResize="true"
                  :class="'col-' + component.span"
                  :style="'grid-row: ' + component.row + '; grid-column: ' + component.col" />
      </div>
    </div>
  </BlockUI>
</template>

<style scoped>

</style>