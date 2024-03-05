<template>
  <div class="flex justify-content-center">
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
        label: $const.Franchise,
        icon: 'pi pi-tags',
        route: '/db/manager/franchise'
      },
      {
        label: $const.Product,
        icon: 'pi pi-th-large',
        route: '/db/manager/product'
      },
      {
        label: $const.Album,
        icon: 'pi pi-th-large',
        route: '/db/manager/album'
      },
      {
        label: $const.Book,
        icon: 'pi pi-book',
        route: '/db/manager/book'
      }
    ]
  },
  {
    label: $const.Person,
    items: [
      {
        label: $const.Person,
        icon: 'pi pi-users',
        route: '/db/manager/person'
      },
      {
        label: $const.PersonRole,
        icon: 'pi pi-tags',
        route: '/db/manager/person-role'
      }
    ]
  }
]);
</script>

<style scoped>

</style>