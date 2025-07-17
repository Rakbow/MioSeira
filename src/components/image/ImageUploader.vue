<script setup lang="ts">
import {PublicHelper} from "@/utils/publicHelper";
import {defineProps, onBeforeMount, ref} from "vue";
import {useOptionStore} from "@/store/modules/option";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const emit = defineEmits(['update:images', 'update:generateThumb']);
const store = useOptionStore();
const images = ref<ImageDTO[]>([]);
const generateThumb = ref(false);
const dt = ref();
const props = defineProps({
  showDetail: {
    type: Boolean,
    required: false,
    default: true
  },
  images: {
    type: Array<ImageDTO>,
    required: false,
    default: []
  },
  generateThumb: {
    type: Boolean,
    required: false,
    default: false
  }
});

onBeforeMount(() => {
  store.fetchOptions();
  images.value = props.images;
  generateThumb.value = props.generateThumb;
})

const selectFile = async (ev: any) => {
  if (!ev.files) return;
  let files: File[] = ev.files.filter(f => !images.value.some(i => i.file!.objectURL === f.objectURL))
  for (let file of files) {

    let image: ImageDTO = {
      name: file.name.replace(/\.[^/.]+$/, ''),
      type: store.options.imageTypeSet[file.name === 'Cover' ? 2 : 0].value,
      size: PublicHelper.formatSize(file.size),
      detail: '',
      file: file,
      objectURL: file.objectURL
    }
    images.value.push(image)
  }
  emit('update:images', images.value);
};

const onImageReorder = (ev: any) => {
  images.value = ev.value;
  emit('update:images', images.value);
};

const onImageCellEdite = (ev: any) => {
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
              :invalidFileSizeMessage="t('InvalidFileSizeMessage')">
    <template #header="{ chooseCallback }">
      <RButton @click="chooseCallback()" icon="image_arrow_up" tip="Upload"/>
      <RButton @click="onImageClear()" action="clear" :disabled="!images || images.length === 0"/>
      <Checkbox v-model="generateThumb" binary @change="changeGenerateThumb" />
      <small class="label-title">{{ t('ImageGenerateThumb') }}</small>
    </template>
    <template #empty>
      <span class="empty-search-result">{{ t('DragFile') }}</span>
    </template>
    <template #content>
      <DataTable v-if="images.length > 0" :value="images"
                 :alwaysShowPaginator="images.length !== 0" paginator :rows="8"
                 editMode="cell" @cellEditComplete="onImageCellEdite"
                 scrollable scrollHeight="flex" size="small" @rowReorder="onImageReorder"
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink
                                 LastPageLink CurrentPageReport RowsPerPageDropdown"
                 currentPageReportTemplate="&nbsp;&nbsp;{first} to {last} of {totalRecords}&nbsp;&nbsp;">
        <Column rowReorder headerStyle="width: 3rem" />
        <Column style="width: 6rem">
          <template #body="{data}">
            <img :src="data.objectURL" draggable="false" oncontextmenu="return false" :alt="data.name"
                 style="max-width: 5rem;max-height: 5rem"/>
          </template>
        </Column>
        <Column :header="t('Name')" field="name" style="max-width: 10rem">
          <template #body="{data}">
            <div class="data-table-field-text-overflow-hidden">{{ data!.name }}</div>
          </template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid/>
          </template>
        </Column>
        <Column :header="t('Type')" field="type" style="width: 8rem">
          <template #body="{data}">
            <Tag :value="PublicHelper.value2Label(data.type, store.options.imageTypeSet)"/>
          </template>
          <template #editor="{ data, field }">
            <Select v-model="data[field]" :options="store.options.imageTypeSet"
                    optionLabel="label" optionValue="value" fluid>
              <template #option="slotProps">
                <Tag :value="slotProps.option.label"/>
              </template>
            </Select>
          </template>
        </Column>
        <Column :header="t('Size')" field="size" style="width: 6rem"/>
        <Column v-if="props.showDetail" :header="t('Description')" field="detail">
          <template #body="{data}">
            <div class="data-table-field-text-overflow-hidden">{{ data!.detail }}</div>
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
</style>