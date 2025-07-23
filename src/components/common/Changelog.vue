<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {defineAsyncComponent, inject, onMounted, ref} from "vue";
import {bs} from "@/service/baseService";
import {API, Axios} from "@/api";

const browser = defineAsyncComponent(() => import('@/components/common/ChangelogBrowser.vue'));

const {t} = useI18n();
const entity = inject<Entity>('entity')!;
const block = ref(false);
const target = ref({
  createTime: '',
  lastModifyTime: '',
  total: 0
});

onMounted(() => {
  load();
})

const load = async () => {
  block.value = true;
  const res = await Axios.post(API.CHANGELOG.MINI, {entityType: entity!.type, entityId: entity!.id});
  if (res.success()) {
    target.value.createTime = res.data.createTime;
    target.value.lastModifyTime = res.data.lastModifyTime;
    target.value.total = res.data.total;
  }
  block.value = false;
}

const openBrowser = () => {
  bs!.dialog.open(browser, {
    props: {
      header: t('Changelog'),
      style: {
        width: '75rem'
      },
      modal: true,
      closable: true
    },
    data: {
      type: entity!.type,
      id: entity!.id,
    }
  });
}
</script>

<template>
  <Panel>
    <template #header>
      <span><RIcon name="acute"/><strong>{{ t('Changelog') }}</strong></span>
    </template>
    <template #icons>
      <Button :label="target.total.toString()" outlined @click="openBrowser"/>
    </template>

    <div class="content-space-between">
      <div class="mb-2">
        <RIcon name="calendar_add_on" :size="1.3"/>
        <strong>{{ t('AddedTime') }}</strong>
      </div>
      <span>{{ target.createTime }}</span>
    </div>
    <div class="content-space-between">
      <div>
        <RIcon name="edit_calendar" :size="1.3"/>
        <strong>{{ t('EditedTime') }}</strong>
      </div>
      <span>{{ target.lastModifyTime }}</span>
    </div>
  </Panel>
</template>

<style scoped lang="scss">

.content-space-between {
  > div {
    display: flex !important;
    align-items: center !important;
    color: var(--r-steel-500)
  }
}
strong {
  margin-left: .2rem !important;
  transform: translateY(-3%);
}
</style>