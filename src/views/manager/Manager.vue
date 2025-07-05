<script setup lang="ts">
import { ref } from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const items = ref([
  {
    label: t('Item'),
    icon: 'pi pi-th-large',
    route: '/db/manager/item'
  },
  {
    label: t('Entry'),
    icon: 'pi pi-list',
    route: '/db/manager/entry'
  },
  {
    label: t('Role'),
    icon: 'pi pi-tags',
    route: '/db/manager/role'
  },
  {
    label: t('Episode'),
    icon: 'pi pi-list',
    route: '/db/manager/ep'
  },
  {
    label: t('File'),
    icon: 'pi pi-file',
    route: '/db/manager/file'
  }
]);
</script>

<template>
  <Toast />
  <div style="display: flex;justify-content: center;">

    <div class="grid" style="width: 150rem">
      <div class="col-2">
        <div class="card flex justify-center">
          <Menu :model="items" class="w-full">
            <template #item="{ item, props }">
              <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                  <span :class="item.icon" style="font-size: 1.5rem" />
                  <span class="ml-2" style="font-size: 1.5rem">{{ item.label }}</span>
                </a>
              </router-link>
              <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
              <Divider class="my-0" />
            </template>
          </Menu>
        </div>


      </div>
      <div class="col-10">
        <router-view />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
</style>