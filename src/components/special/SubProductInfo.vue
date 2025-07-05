<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from 'vue';
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
import {PublicHelper} from "@/toolkit/publicHelper";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {EntityInfo, META} from "@/config/Web_Const";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";

const manager = defineAsyncComponent(() => import('@/components/related/RelatedEntitiesManager.vue'));
const {t} = useI18n();
const entityInfo = ref<EntityInfo>();
const route = useRoute();
const dialog = useDialog();
const userStore = useUserStore();
const subProducts = ref<any>([]);
const editBlock = ref(false);

onBeforeMount(() => {
  entityInfo.value = PublicHelper.getEntityInfo(route);
});

onMounted(() => {
  getSubProduct()
});


const openEditDialog = () => {
  dialog.open(manager, {
    props: {
      header: `${t('RelatedEntity')}-${t('Edit')}`,
      style: {
        width: '900px',
      },
      modal: true,
      closable: true
    },
    data: {
      direction: META.RELATION_RELATED_DIRECTION.NEGATIVE
    },
    onClose: (options) => {
      if (options.data !== undefined) {
        if (options.data.isUpdate) {
          getSubProduct();
        }
      }
    }
  });
}

const getSubProduct = async () => {
  editBlock.value = true;
  const res = await axios.post(API.ENTRY_GET_SUB_PRODUCTS, {id: entityInfo.value?.id});
  if (res.state === axios.SUCCESS)
    subProducts.value = res.data;
  editBlock.value = false;
}

</script>

<template>
  <BlockUI :blocked="editBlock" class="entity-fieldset">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-th-large"/>
        <b>{{ t('Product') }}</b>
      </template>
      <div class="relative">
        <div v-if="userStore.user">
          <Button v-if="userStore.user.type > 1" class="p-button-link absolute top-0"
                  @click="openEditDialog" style="right: 0"
                  v-tooltip.bottom="{value: t('Edit'), class: 'short-tooltip'}">
            <template #icon>
              <MaterialIcon name="edit_note" />
            </template>
          </Button>
        </div>

        <div class="ml-2 mt-1" v-if="subProducts.length !== 0">
          <table class="table-borderless">
            <tbody class="person-table">
            <tr>
              <td><h4>{{ t('Date') }}</h4></td>
              <td><h4>{{ t('Product') }}</h4></td>
            </tr>
            <tr v-for="entry in subProducts">
              <td style="color: #788990;">{{ (entry as any).date }}</td>
              <td class="a_with_underline">
                <a :href="`${API.ENTRY_DETAIL_PATH}/${entry.id}`" :key="entry.id">
                  <span style="white-space: nowrap;" :class="'product-type-' + entry.subType.value">{{ entry.name }}</span>
                </a>
                <small>&nbsp;({{ (entry as any).subType.label }})</small>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <span class="emptyInfo"><em>{{ t('NoPerson') }}</em></span>
        </div>
      </div>
    </Fieldset>
  </BlockUI>
</template>

<style scoped lang="scss">

.person-table td {
  padding-left: 6px;
  padding-right: 6px;
  font-size: 9pt;
}

.person-table h4 {
  font-size: 9pt;
  color: #beb993;
  margin: 5px 0;
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