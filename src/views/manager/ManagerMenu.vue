<template>
  <Menu :model="items">
    <template #item="{ label, item, props }">
      <router-link v-if="item.route" v-slot="routerProps" :to="item.route" custom>
        <a :href="routerProps.href" v-bind="props.action" @click="() => routerProps.navigate($event)" @keydown.enter.space="() => routerProps.navigate($event)">
          <span v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
        </a>
      </router-link>
      <a v-else :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const toast = useToast();

const items = ref([
  {
    label: 'Item',
    icon: 'pi pi-th-large',
    route: '/db/manager/item'
  },
  {
    label: 'Entry',
    icon: 'pi pi-list',
    route: '/db/manager/entry'
  },
  {
    label: t('Role'),
    icon: 'pi pi-tags',
    route: '/db/manager/role'
  }
]);
</script>

<style scoped>

</style>