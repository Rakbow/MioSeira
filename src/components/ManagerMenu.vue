<template>
  <div class="flex justify-content-center">
    <Menu :model="items">
      <template #item="{ label, item, props }">
        <router-link v-if="item.route" v-slot="routerProps" :to="item.route" custom>
          <a :href="routerProps.href" v-bind="props.action" @click="($event) => routerProps.navigate($event)" @keydown.enter.space="($event) => routerProps.navigate($event)">
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import {getCurrentInstance} from "vue";
const $const = getCurrentInstance().appContext.config.globalProperties.$const;

const toast = useToast();

const items = ref([
  {
    label: $const.Person,
    items: [
      {
        label: $const.Person,
        icon: 'pi pi-users',
        route: '/db/manager/person'
      }
    ]
  }
]);
</script>

<style scoped>

</style>