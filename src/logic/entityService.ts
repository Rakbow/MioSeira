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

export interface RelationConfig {
    key: number[];
    type: number;
    subTypeSets: number[][];
}

export const findRelationConfig = (key: [number, number]): RelationConfig | undefined => {
    return META.RELATION_CONFIG.find(cfg => cfg.key[0] === key[0] && cfg.key[1] === key[1]);
}

export class ImageDTO {
    type: number = 0;
    name: string = "";
    detail: string = "";
    size: string = "";
    file: File | null = null;
}

export class FileInfoCreateDTO {
    id: number = 0;
    name: string = "";
    size: string = "";
    file: File | null = null;
    remark: string = "";
}

export class EntityManageQueryParams {
    first: number = 0;
    rows: number = 15;
    sortField: string | null = null;
    sortOrder: number = 1;
    filters: any | null = null;

}

export class EntityManageParam {
    loading: boolean = false;//loading where search data
    blocking: boolean = false;//component blocked where search data
    total: number = 0;
    data: any[] = [];
    selectedData: any[] = [];
    columns: PColumn[] = [];
    selectedColumns: PColumn[] = [];
    query: EntityManageQueryParams = new EntityManageQueryParams();

    initPage(first: number = 0, rows: number = 15): void {
        this.query.first = first;
        this.query.rows = rows;
    }

    countPage(page: number, rows: number): void {
        this.query.first = (page - 1) * rows
        this.query.rows = rows
    }

    initSort(field: string, order: number): void {
        this.query.sortField = field;
        this.query.sortOrder = order;
    }

    clearSort(): void {
        this.query.sortField = null;
    }

    initFilters(filters: any): void {
        this.query.filters = filters;
    }

    load(): void {
        this.loading = true;
        this.blocking = true;
    }

    endLoad(): void {
        this.loading = false;
        this.blocking = false;
    }

    block(): void {
        this.blocking = true;
    }

    endBlock(): void {
        this.blocking = false;
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
                width: '45rem',
            },
            modal: true,
            closable: true
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
            if (Object.keys(this.options).length === 0) {
                console.log('Fetching options...');
                const {locale} = useI18n();
                this.$reset();

                const res = await axios.get(API.ENTITY_GET_OPTION);
                this.options = res.data;

                this.itemCurrent = META.ITEM_TYPE.ALBUM;
                this.entryCurrent = META.ENTRY_TYPE.PRODUCT;

                this.options.genderSet = i18nConst.genderSet[locale.value];
                this.options.imageTypeSet = i18nConst.imageTypeSet![locale.value];
                this.options.bookTypeSet = i18nConst.bookTypeSet![locale.value];
                this.options.goodsTypeSet = i18nConst.goodsTypeSet![locale.value];
                this.options.figureTypeSet = i18nConst.figureTypeSet![locale.value];
                this.options.releaseTypeSet = i18nConst.releaseTypeSet![locale.value];
                this.options.entrySubTypeSet = i18nConst.entrySubTypeSet![locale.value];
                this.options.languageSet = i18nConst.languageSet![locale.value];
            }
        },
        clear() {
            this.options = {};
        }
    },
    persist: true, // 开启持久化
});