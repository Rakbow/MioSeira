import fileEditor from "@/components/file/FileEditor.vue";
import {META} from "@/config/Web_Const";
import i18n from "@/locales/i18n";
import {PColumn} from "@/service/frame";
import {PublicHelper} from "@/utils/publicHelper";

import {bs} from '@/service/baseService'

const {t} = i18n.global;
let editor: any = null;

export const findRelationConfig = (key: [number, number]): RelationConfig | undefined => {
    return META.RELATION_CONFIG.find(cfg => cfg.key[0] === key[0] && cfg.key[1] === key[1]);
}

export class FileInfoCreateDTO {
    id: number = 0;
    name: string = "";
    size: string = "";
    file: File | null = null;
    remark: string = "";
}

export class EntitySelectorParam {
    loading: boolean = false;

    keyword: string = "";
    keywords: string[] = [];

    first: number = 0;

    type: number = 0;
    page: number = 1;
    size: number = 7;

    data: any[] = [];
    total: number = 0;
    time: string = "";

    loadResult = (searchResult: any): void => {
        this.data = searchResult.data;
        this.total = searchResult.total;
        this.time = searchResult.searchTime;
    }

    initPage = (): void => {
        this.page = 1;
        this.first = 0;
    }

    initFirst = (): void => {
        this.first = (this.page - 1) * this.size;
    }

    handleKeyword = (): void => {
        this.keywords = PublicHelper.splitAndTrim(this.keyword);
    }

    load = (): void => {
        this.loading = true;
    }

    endLoad(): void {
        this.loading = false;
    }

}

export class EntitySearchQuery {
    page: number = 1;
    size: number = 15;
    sortField: string | null = null;
    sortOrder: number = 1;
    filters: any | null = null;
}

export class EntitySearchParam {
    loading: boolean = false;//loading where search data
    loading2: boolean = false;//loading where search data
    blocking: boolean = false;//component blocked where search data
    total: number = 0;
    time: string = '0';
    data: any[] = [];
    selectedData: any[] = [];
    columns: PColumn[] = [];
    selectedColumns: PColumn[] = [];
    query: EntitySearchQuery = new EntitySearchQuery();
    result: SearchResult = {
        data: [],
        total: 0,
        time: '0'
    };

    loadResult(res: SearchResult): void {
        this.result.data = res.data;
        this.result.total = res.total;
        this.result.time = res.time;
    }

    initPage(page: number = 1): void {
        this.query.page = page;
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

export class EditParam {
    block: boolean = false;
    isUpdate: boolean = false;
    data: any = null;
}

export class RelatedEntitiesSearchParam {

}

export const loadEditor = (type: number, data: any) => {

    if (type === META.ENTITY.FILE) editor = fileEditor;

    bs!.dialog.open(editor, {
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
            if (options!.data !== undefined) {
                if (options!.data.isUpdate) {
                    Object.assign(data, options!.data.entity);
                }
            }
        }
    });
}