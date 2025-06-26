import {DynamicDialogInstance, DynamicDialogOptions} from "primevue/dynamicdialogoptions";
import fileEditor from "@/components/entityEditor/FileEditor.vue";
import {META} from "@/config/Web_Const";
import i18n from "@/config/i18n";
import {defineStore} from "pinia";
import {useI18n} from "vue-i18n";
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {i18nConst} from "@/config/i18nConst";
import {PColumn} from "@/logic/frame";

const {t} = i18n.global;
let editor: any = null;

export class ImageDTO {
    type: number = 0;
    name: string = "";
    detail: string = "";
    size: string = "";
    file: File | null = null;
}

export class EntityManageQueryParams {
    first: number = 0;
    rows: number = 10;
    sortField: string | null = null;
    sortOrder: number = -1;
    filters: any | null = null;

    initPage(size: number = 10): void {
        this.first = 0;
        this.rows = size;
    }

    clearSort(): void {
        this.sortField = null;
    }

    initFilters(filters: any): void {
        this.filters = filters;
    }

}

export class EntityManageParam {
    first: number = 0;
    loading: boolean = false;//loading where search data
    block: boolean = false;//component blocked where search data
    total: number = 0;
    data: any[] = [];
    selectedData: any[] = [];
    columns: PColumn[] = [];
    selectedColumns: PColumn[] = [];
    query: EntityManageQueryParams = new EntityManageQueryParams();

    load(): void {
        this.loading = true;
        this.block = true;
    }

    endLoad(): void {
        this.loading = false;
        this.block = false;
    }

    initColumns(columns: PColumn[]): void {
        this.columns = columns;
    }
}

export const loadEditor = (type: number, data: any, dialog: {
    open: (content: any, options?: (DynamicDialogOptions | undefined)) => DynamicDialogInstance
}) => {

    if(type === META.ENTITY.FILE) editor = fileEditor;

    dialog.open(editor, {
        props: {
            header: t('Edit'),
            style: {
                width: '450px',
            },
            breakpoints: {
                '960px': '80vw',
                '640px': '70vw'
            },
            modal: true,
            closable: false
        },
        data: {
            entity: data
        },
        onClose: (options) => {
            // @ts-ignore
            if (options.data !== undefined) {
                // @ts-ignore
                if (options.data.isUpdate) {
                    location.reload();
                }
            }
        }
    });
}

export const useEntityStore = defineStore('options', {
    state: () => ({
        options: {} as Record<string, any>, // 全局缓存的选项数据
        itemCurrent: 1,
        entryCurrent: 1,
    }),
    actions: {
        async fetchOptions() {
            console.log('Fetching options...');
            if (Object.keys(this.options).length === 0) {
                const {locale} = useI18n();
                this.$reset();

                const res = await axios.get(API.ENTITY_GET_OPTION);
                this.options = res.data;

                this.itemCurrent = META.ITEM_TYPE.ALBUM;
                this.entryCurrent = META.ENTRY_TYPE.PRODUCT;

                this.options.genderSet = i18nConst.genderSet[locale.value!];
                this.options.imageTypeSet = i18nConst.imageTypeSet[locale.value!];
                this.options.bookTypeSet = i18nConst.bookTypeSet[locale.value!];
                this.options.goodsTypeSet = i18nConst.goodsTypeSet[locale.value!];
                this.options.figureTypeSet = i18nConst.figureTypeSet[locale.value!];
                this.options.releaseTypeSet = i18nConst.releaseTypeSet[locale.value!];
                this.options.entrySubTypeSet = i18nConst.entrySubTypeSet[locale.value!];
            }
        },
        clear() {
            this.options = {};
        }
    },
    persist: true, // 开启持久化
});