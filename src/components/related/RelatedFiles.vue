<script setup lang="ts">
import {defineAsyncComponent, defineProps, onMounted, ref} from "vue";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {useDialog} from "primevue/usedialog";
import {useI18n} from "vue-i18n";

const Edit = defineAsyncComponent(() => import('@/components/common/EntityEditButton.vue'));
const creator = defineAsyncComponent(() => import('@/components/file/FileCreator.vue'));

const {t} = useI18n();
const records = ref(0);
const loading = ref(false);
const files = ref([]);
const dialog = useDialog();

onMounted((() => {
  load();
}))

const props = defineProps({
  type: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});

const load = async () => {
  loading.value = true;
  const res = await axios.post(API.FILE_LIST, {
    first: 0,
    rows: 0,
    filters: {
      entityType: {value: props.type},
      entityId: {value: props.id}
    }
  });
  if (res.state === axios.SUCCESS) {
    files.value = res.data.data;
    records.value = res.data.total
  }
  loading.value = false;
}

const openCreator = () => {
  dialog.open(creator, {
    props: {
      header: t('Upload'),
      style: {
        width: '80rem'
      },
      modal: true,
      closable: true
    },
    onClose: (options: any) => {
      if (options.data) {
        if (options.data.isUpdate) {
          load();
        }
      }
    }
  });
}

//endregion
</script>

<template>
  <BlockUI :blocked="loading" class="entity-fieldset related-file">
    <Fieldset :toggleable="true">
      <template #legend>
        <i class="pi pi-file"/>
        <b>{{ t('RelatedFiles') }}</b>
      </template>
      <div class="relative">
        <Edit :func="openCreator" icon="note_add" label="Upload"/>
        <table v-if="files.length" class="related-file-table table table-sm table-hover" style="width: 70rem">
          <tbody>
          <tr v-for="(file, index) in (files as any[])">
            <td style="width: 2rem">{{ index + 1 }}</td>
            <td style="width: 50rem" nowrap="nowrap">
              <span class="text-overflow-ellipsis">{{ file.name }}</span>
            </td>
            <td>
              {{ file.size }}
            </td>
            <td style="color: gray" class="text-end">
              {{ file.editedTime }}
            </td>
          </tr>
          </tbody>
        </table>
        <span v-else class="empty-search-result">{{ t('NoFile') }}</span>
      </div>

    </Fieldset>
  </BlockUI>
</template>

<style scoped lang="scss">
@use '@/assets/general' as g;

.related-file {

  &-table {

    margin: .5rem 2rem 0 0 !important;

    td {
      padding: 0 0 .2rem 0;
      border-bottom: .1rem solid g.$common-border-bottom;
      color: #B0C4DE;
    }
  }

}
</style>