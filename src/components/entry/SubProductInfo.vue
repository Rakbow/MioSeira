<script setup lang="ts">
import {defineAsyncComponent, getCurrentInstance, inject, onMounted, ref} from 'vue';
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const manager = defineAsyncComponent(() => import('@/components/related/RelationManager.vue'));
const {t} = useI18n();
const entity = inject<Entity>('entity')!;
const subProducts = ref<any>([]);
const param = ref(new EditParam());
const { proxy } = getCurrentInstance()!;

onMounted(() => {
  getSubProduct()
});


const openEditDialog = () => {
  bs!.dialog.open(manager, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '90rem',
      },
      modal: true,
      closable: true
    },
    data: {
      direction: proxy!.$const.RELATION_RELATED_DIRECTION.NEGATIVE
    },
    onClose: (options: any) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          getSubProduct();
        }
      }
    }
  });
}

const getSubProduct = async () => {
  param.value.block = true;
  const res = await Axios.post(API.ENTRY.SUB_PRODUCTS, {id: entity!.id});
  if (res.success())
    subProducts.value = res.data;
  param.value.block = false;
}

</script>

<template>
  <BlockUI :blocked="param.block" class="entity-detail-fieldset" style="margin: 1rem">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-th-large"/>
        <b>{{ t('Product') }}</b>
      </template>
      <div class="relative">
        <Button v-permission class="p-button-link absolute top-0"
                @click="openEditDialog" style="right: 0"
                v-tooltip.bottom="{value: t('Edit')}">
          <template #icon>
            <RIcon name="edit_note" />
          </template>
        </Button>

        <div class="ml-2 mt-1" v-if="subProducts.length !== 0">
          <table class="table-borderless">
            <tbody class="person-table">
            <tr>
              <td><h4>{{ t('Date') }}</h4></td>
              <td><h4>{{ t('Product') }}</h4></td>
            </tr>
            <tr v-for="entry in subProducts">
              <td style="color: var(--r-steel-500)">{{ (entry as any).date }}</td>
              <td class="a_with_underline">
                <a :href="`${$api.ENTRY.DETAIL_PATH}/${entry.id}`" :key="entry.id">
                  <span style="white-space: nowrap;" :class="'product-type-' + entry.subType.value">{{ entry.name }}</span>
                </a>
                <small>&nbsp;({{ (entry as any).subType.label }})</small>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <span class="empty-search-result"><em>{{ t('NoInfo') }}</em></span>
        </div>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<style scoped lang="scss">

.person-table td {
  padding-left: .6rem;
  padding-right: .6rem;
  font-size: 9pt;
}

.person-table h4 {
  font-size: 9pt;
  color: #beb993;
  margin: .5rem 0;
}

$product-colors: (
    0: silver,
    1: yellowgreen,
    2: #00BFFF,
    3: violet,
    4: orange,
    5: #0FFFFF,
    6: #FFFFFF
);

@each $key, $value in $product-colors {
  .product-type-#{$key} {
    color: $value;
  }
}
</style>