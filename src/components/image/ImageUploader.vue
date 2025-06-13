<script setup lang="ts">
import {PublicHelper} from "@/toolkit/publicHelper";
import {defineProps, onBeforeMount, ref, watch} from "vue";
import {META} from "@/config/Web_Const";
import {usePrimeVue} from "primevue/config";
import {useOptionsStore} from "@/store/entityOptions";

const emit = defineEmits(['update:images', 'update:generateThumb']);
const optionsStore = useOptionsStore();
const $primevue = usePrimeVue();
const images = ref([]);
const generateThumb = ref(false);
const dt = ref();
const props = defineProps({
  showDetail: {
    type: Boolean,
    required: false,
    default: () => true
  },
  images: {
    type: Array,
    required: false,
    default: () => ([])
  },
  generateThumb: {
    type: Boolean,
    required: false,
    default: () => false
  }
});

onBeforeMount(async () => {
  await optionsStore.fetchOptions();
  images.value = props.images;
  generateThumb.value = props.generateThumb;
})

const selectFile = async (ev) => {
  if (!ev.files) return;
  for (let file of ev.files) {
    let image = {
      type: META.IMAGE_TYPE.DEFAULT,
      name: file.name.replace(/\.[^/.]+$/, ''),
      detail: '',
      size: PublicHelper.formatSize(file.size),
      file: file
    }
    images.value.push(image)
  }
  emit('update:images', images.value);
};

const onImageCellEdite = (ev) => {
  let {data, newValue, field} = ev;

  switch (field) {
    case 'type':
      data[field] = newValue;
      break;

    default:
      if (newValue.trim().length > 0) data[field] = newValue;
      break;
  }
  emit('update:images', images.value);
};
const onImageRemove = (index: number) => {
  images.value.splice(index, 1);
  emit('update:images', images.value);
};
const onImageClear = () => {
  dt.value.files = [];
  images.value = [];
  emit('update:images', images.value);
};

const changeGenerateThumb = () => {
  console.log('generateThumb: ', generateThumb.value)
  emit('update:generateThumb', generateThumb.value);
}
</script>

<template>
  <FileUpload ref="dt" accept="image/*" auto multiple :customUpload="true"
              :showUploadButton="false"
              :showCancelButton="false"
              chooseIcon="pi pi-image" @select="selectFile($event)"
              :maxFileSize="30000000" :previewWidth="100"
              :invalidFileSizeMessage="$t('ImageInvalidFileSizeMessage')">
    <template #header="{ chooseCallback }">
      <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined/>
      <Button @click="onImageClear()" icon="pi pi-times" rounded outlined severity="danger"
              :disabled="!images || images.length === 0"/>
      <Checkbox v-model="generateThumb" binary @change="changeGenerateThumb" />
      <small class="label-title">{{ $t('ImageGenerateThumb') }}</small>
    </template>
    <template #empty>
      <span class="empty-search-result">{{ $t('DragImage') }}</span>
    </template>
    <template #content="{ files, removeUploadedFileCallback, removeFileCallback }">
      <DataTable v-if="images.length > 0" :value="images" class="p-datatable-sm"
                 :alwaysShowPaginator="images.length !== 0" paginator :rows="5"
                 editMode="cell" @cellEditComplete="onImageCellEdite"
                 scrollable scrollHeight="flex" size="small"
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
                 currentPageReportTemplate="{first} to {last} of {totalRecords}">
        <Column style="width: 6rem">
          <template #body="slotProps">
            <div class="image-thumb-50">
              <img role="presentation" :alt="slotProps.data.name" :src="slotProps.data.file.objectURL"/>
            </div>
          </template>
        </Column>
        <Column :header="$t('Name')" field="name" style="max-width: 10rem">
          <template #body="slotProps">
            <div class="data-table-field-text-overflow-hidden">{{ slotProps.data.name }}</div>
          </template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid/>
          </template>
        </Column>
        <Column :header="$t('Type')" field="type" style="width: 8rem">
          <template #body="slotProps">
            <Tag :value="PublicHelper.value2Label(slotProps.data.type, optionsStore.options.imageTypeSet)"/>
          </template>
          <template #editor="{ data, field }">
            <Select v-model="data[field]" :options="optionsStore.options.imageTypeSet"
                    optionLabel="label" optionValue="value" fluid>
              <template #option="slotProps">
                <Tag :value="slotProps.option.label"/>
              </template>
            </Select>
          </template>
        </Column>
        <Column :header="$t('ImageSize')" field="size" style="width: 6rem"/>
        <Column v-if="props.showDetail" :header="$t('Description')" field="detail">
          <template #body="slotProps">
            <div class="data-table-field-text-overflow-hidden">{{ slotProps.data.detail }}</div>
          </template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid/>
          </template>
        </Column>
        <Column style="width: 1rem">
          <template #body="{ index }">
            <Button size="small" icon="pi pi-times" outlined rounded severity="danger"
                    @click="onImageRemove(index)"/>
          </template>
        </Column>
      </DataTable>
    </template>
  </FileUpload>
</template>

<style scoped lang="scss">
@use "@/assets/entity-global";
</style>