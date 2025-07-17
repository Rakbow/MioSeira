<script setup lang="ts">
import {defineAsyncComponent, defineProps, nextTick, onBeforeMount} from "vue";
import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/store/modules/option";
import {bs} from "@/service/baseService";
import {useDraftStore} from "@/store/modules/draft";

const selector = defineAsyncComponent(() => import('@/components/entry/EntrySelector.vue'));

const props = defineProps<{
  relatedEntries: Array<any>
}>();

const store = useOptionStore();
const draft = useDraftStore();
const {t} = useI18n();
const relatedEntries = defineModel<Array<any>>('relatedEntries');

onBeforeMount(() => {
  store.fetchOptions();
})

const openSelector = () => {
  bs!.dialog.open(selector, {
    props: {
      header: t('Entry'),
      style: {
        width: '60rem'
      },
      modal: true,
      closable: true
    },
    data: {
      entries: relatedEntries.value,
      all: true
    }
  })
};

const onReorder = async (ev: any) => {
  relatedEntries.value = ev.value;
  await nextTick();
};

const onCellEdite = (ev: any) => {
  let {data, newValue, field} = ev;

  switch (field) {
    case 'role':
      data[field] = newValue;
      break;
    case 'relatedRole':
      data[field] = newValue;
      break;

    default:
      if (newValue && newValue.trim().length > 0) {
        data[field] = newValue
      }else {
        data[field] = '';
      }
      break;
  }
};

const onRemove = (index: number) => {
  relatedEntries.value!.splice(index, 1);
};

const onClear = () => {
  relatedEntries.value!.splice(0, relatedEntries.value!.length);
};

//region draft
const getDraft = () => {
  Object.assign(relatedEntries, JSON.parse(JSON.stringify(draft.relatedEntries)))
}

const saveDraft = () => {
  draft.save(relatedEntries.value!);
  bs!.toast.success(`${t('Save')}${t('Draft')}`)
}
</script>

<template>
  <Panel>
    <template #header>
      <span><i class="pi pi-objects-column"/><strong>{{ t('Relation') }}</strong></span>
    </template>

    <DataTable :value="relatedEntries" class="entity-manager-datatable" style="font-size: 1rem"
               reorderableColumns @rowReorder="onReorder"
               editMode="cell" @cellEditComplete="onCellEdite" showGridlines
               stripedRows size="small" scrollable scrollHeight="40rem" responsiveLayout="scroll">
      <template #empty>
        <span class="empty-search-result">{{ t('NoInfo') }}</span>
      </template>
      <template #header>
        <RButton size="small" action="create" @click="openSelector"/>
        <RButton @click="onClear" action="clear" :disabled="!relatedEntries || relatedEntries.length === 0"/>
        <RButton size="small" icon="save" tip="Draft" @click="saveDraft"
                 :disabled="!relatedEntries || relatedEntries.length === 0"/>
        <RButton size="small" icon="draft" tip="Get" @click="getDraft"/>
      </template>

      <Column field="type.value">
        <template #body="{data}">
          <span style="margin-left: 1rem">{{ data.type.label }}</span>
        </template>
      </Column>
      <Column class="text-center" rowReorder headerStyle="width: 3rem"/>
      <Column class="text-center" style="width: 2rem">
        <template #body="{data}">
          <img :alt="data.name" :src="data.thumb"
               style="max-width: 2rem;max-height: 2rem;width: auto;height: auto"/>
        </template>
      </Column>
      <Column style="width: 19rem">
        <template #body="{data}">
          <span class="text-ellipsis-one" :title="data.name">{{ data.name }}</span>
        </template>
      </Column>

      <Column :header="t('Role')" field="role" style="width: 12rem">
        <template #body="{data}">
          <span v-if="data.role" style="margin-left: .6rem">
            {{data.role.label}}
          </span>
        </template>
        <template #editor="{ data, field }">
          <Select size="small" v-model="data[field]" :options="store.options.roleSet" filter
                  optionLabel="label" fluid style="width: 10rem;font-size: 1rem">
            <template #option="{option}">
              {{ option!.label }}
            </template>
          </Select>
        </template>
      </Column>

      <Column :header="t('ReverseRole')" field="relatedRole" style="width: 12rem">
        <template #body="{data}">
          <span v-if="data.relatedRole" style="margin-left: .6rem">
            {{data.relatedRole.label}}
          </span>
        </template>
        <template #editor="{ data, field }">
          <Select size="small" v-model="data[field]" :options="store.options.roleSet" filter
                  optionLabel="label" fluid>
            <template #option="{option}">
              {{ option!.label }}
            </template>
          </Select>
        </template>
      </Column>

      <Column :header="t('Remark')" field="remark" style="width: 10rem">
        <template #body="{data}">
          <div class="data-table-field-text-overflow-hidden">{{ data.remark }}</div>
        </template>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid/>
        </template>
      </Column>

      <Column style="width: 1rem;padding: 0 .3rem">
        <template #body="{ index }">
          <RButton size="small" @click="onRemove(index)" action="clear" style="padding: 0"/>
        </template>
      </Column>
    </DataTable>
  </Panel>
</template>

<style scoped lang="scss">

</style>