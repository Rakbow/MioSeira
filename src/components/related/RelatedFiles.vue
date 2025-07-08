<script setup lang="ts">
import {defineAsyncComponent, inject, onMounted, ref} from "vue";
import {API, Axios} from "@/api";
import {useI18n} from "vue-i18n";
import {bs} from '@/service/baseService';

const creator = defineAsyncComponent(() => import('@/components/file/FileCreator.vue'));

const {t} = useI18n();
const loading = ref(false);
const files = ref<any[]>([]);
const size = ref<string>();
const entity = inject<Entity>('entity')!;

onMounted((() => {
  load();
}))

const load = async () => {
  loading.value = true;
  const res = await Axios.post(API.FILE_RELATED, {
    entityType: entity.type,
    entityId: entity.id
  });
  if (res.success()) {
    files.value = res.data.files;
    size.value = res.data.size;
  }
  loading.value = false;
}

const openCreator = () => {
  bs!.dialog.open(creator, {
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
      <div class="related-file">
        <RButton @click="openCreator" icon="note_add" tooltip="Upload" variant="text" class="absolute"
                 style="right: 0"/>
        <p class="related-file-header">
          {{ t('Resource.FileStatistics', [files.length, size]) }}
        </p>
        <table v-if="files.length">
          <tbody>
          <tr v-for="(file, index) in (files as any[])">
            <th>{{ index + 1 }}</th>
            <td nowrap="nowrap"  class="related-file-name">
              <span>{{ file.name }}</span>
            </td>
            <td class="related-file-size">
              {{ file.size }}
            </td>
            <td class="related-file-time">
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
@use '@/styles/general' as g;

.related-file {
  position: relative;

  &-header {
    font-size: 1.2rem;
    margin-top: .5rem;
    text-align: left !important;
  }

  table {
    margin: 1rem 0;
    width: 80rem;
    padding-bottom: 0;
    border: none;
    border-collapse: collapse;

    tr {
      border-bottom: .1rem solid var(--r-bg-indigo-700);
      padding-bottom: .1rem;

      &:hover {
        background-color: var(--r-bg-indigo-700);
      }
    }

    td {
      padding-top: 0;

      span {
        font-size: 1.1rem;
      }

    }

    th {
      width: 2rem;
      color: var(--r-steel-500);
      @extend .small-font;
    }
  }

  &-name {
    span {
      margin-left: 1rem;
      text-overflow: ellipsis !important;
    }
    width: 55rem;
    color: var(--r-steel-300);
  }
  &-size, &-time {
    color: var(--r-gray-300);
  }

  &-time {
    text-align: right !important;
  }

}
</style>