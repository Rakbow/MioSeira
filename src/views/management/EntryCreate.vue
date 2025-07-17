<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, getCurrentInstance, onBeforeMount, ref} from "vue";
import {useOptionStore} from "@/store/modules/option";
import "flag-icons/css/flag-icons.min.css";
import {API, Axios} from "@/api";
import {EntryAdvanceCreateDTO} from "@/service/entryService";
import {MdEditor} from "md-editor-v3";
import {useRouter} from "vue-router";
import {bs} from '@/service/baseService';

import 'md-editor-v3/lib/style.css';
import {EditParam} from "@/service/entityService";

const RelatedEntriesCreator = defineAsyncComponent(() => import('@/components/related/RelatedEntriesCreator.vue'));
const EntryTypeSelector = defineAsyncComponent(() => import('@/components/entry/EntryTypeSelector.vue'));

const router = useRouter();
const {t} = useI18n();
const store = useOptionStore();
const dto = ref(new EntryAdvanceCreateDTO());
const {proxy} = getCurrentInstance()!;
const param = ref(new EditParam());

const relatedEntries = ref<any[]>([])


onBeforeMount(() => {
  store.fetchOptions();
})

const switchEntryType = (value: any) => {
  dto.value.entry.type = value;
}

//region related entities

const handleRelatedEntities = () => {
  dto.value.relatedEntries = [
    ...relatedEntries.value.map(e => ({
      relatedEntitySubType: e.type.value,
      relatedEntityType: proxy!.$const.ENTITY.ENTRY,
      relatedEntityId: e.id,
      remark: e.remark ?? '',

      roleId: e.relatedRole?.value ?? 0,
      relatedRoleId: e.role?.value ?? 0
    }))
  ];
}
//endregion

const submit = async () => {
  param.value.block = true;
  handleRelatedEntities();
  const res = await Axios.post(API.ENTRY.CREATE, dto.value);
  if (res.success())
    await router.push(`${proxy!.$api.ENTRY.DETAIL_PATH}/${res.data}`);
  else
    bs!.toast.error(res.message);
  param.value.block = false;
}
</script>

<template>
  <div class="flex justify-content-center">
    <BlockUI :blocked="param.block" class="entity-creator" style="width: 73rem">
      <Card class="col-12">
        <template #header>
          <div><RIcon name="label"/><strong>{{ t('Category') }}</strong></div>
        </template>
        <template #content>
          <div style="display: flex;justify-content: space-between;align-items: center;height: auto;width: 100%">
            <EntryTypeSelector v-model="dto.entry.type"
                               @update="switchEntryType" :disabled="false" />
            <RButton @click="submit" tip="Save" icon="save"/>
          </div>
        </template>
      </Card>
      <Card class="mt-3 col-12">
        <template #header>
          <div><RIcon name="format_list_bulleted"/><strong>{{ t('BasicInfo') }}</strong></div>
        </template>
        <template #content>
          <div class="entity-editor">
            <Divider align="center"><b>{{ t('BasicInfo') }}</b></Divider>
            <FloatLabel class="field" variant="on">
              <label>{{ t('Name') }}<i class="required-label pi pi-asterisk"/></label>
              <InputText size="large" v-model="dto.entry.name"/>
            </FloatLabel>
            <FloatLabel class="field" variant="on">
              <label>{{ t('NameEn') }}</label>
              <InputText size="large" v-model="dto.entry.nameEn"/>
            </FloatLabel>
            <FloatLabel class="field" variant="on">
              <label>{{ t('NameZh') }}</label>
              <InputText size="large" v-model="dto.entry.nameZh"/>
            </FloatLabel>
            <FloatLabel class="field" variant="on">
              <label>{{ t('Aliases') }}</label>
              <AutoComplete size="large" v-model="dto.entry.aliases" separator="," multiple :typeahead="false"/>
            </FloatLabel>

            <div class="grid" v-if="![$const.ENTRY_TYPE.CLASSIFICATION, $const.ENTRY_TYPE.MATERIAL].includes(dto.entry.type)">
              <FloatLabel variant="on">
                <label>{{ t('Date') }}</label>
                <InputText size="large" v-model="dto.entry.date"/>
              </FloatLabel>
              <FloatLabel variant="on">
                <template v-if="[$const.ENTRY_TYPE.PERSON, $const.ENTRY_TYPE.CHARACTER].includes(dto.entry.type)">
                  <label>{{ t('Gender') }}</label>
                  <Select v-model="dto.entry.gender" :options="store.options.genderSet" filled
                          size="large" optionLabel="label" optionValue="value"/>
                </template>
                <template v-if="dto.entry.type === $const.ENTRY_TYPE.PRODUCT">
                  <label>{{ t('Category') }}</label>
                  <Select v-model="dto.entry.subType" :options="store.options.entrySubTypeSet" filled
                          size="large" optionLabel="label" optionValue="value"/>
                </template>
              </FloatLabel>
            </div>

            <Divider align="center"><b>{{ t('AdvanceInfo') }}</b></Divider>
            <FloatLabel class="field" variant="on">
              <label>{{ t('Link') }}</label>
              <AutoComplete size="large" v-model="dto.entry.links" separator="," multiple :typeahead="false"/>
            </FloatLabel>
            <FloatLabel class="field" variant="on">
              <label>{{ t('Remark') }}</label>
              <Textarea size="large" v-model="dto.entry.remark" rows="4" cols="20"/>
            </FloatLabel>
          </div>
        </template>
      </Card>
      <RelatedEntriesCreator class="mt-3 col-12" v-model:relatedEntries="relatedEntries"/>
      <Card class="mt-3 col-12">
        <template #header>
          <div><RIcon name="article"/><strong>{{ t('Description') }}</strong></div>
        </template>
        <template #content>
          <MdEditor v-model="dto.entry.detail" theme="dark" previewTheme="github"
                    :toolbarsExclude="['save', 'pageFullscreen', 'fullscreen',
                   'preview', 'previewOnly', 'htmlPreview', 'catalog', 'github']"/>
        </template>
      </Card>
    </BlockUI>
  </div>
</template>

<style lang="scss" scoped>
</style>