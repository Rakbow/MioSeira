import {DynamicDialogInstance, DynamicDialogOptions} from "primevue/dynamicdialogoptions";
import editor from "@/components/entityEditor/EntryEditor.vue";
import i18n from "@/config/i18n";

const {t} = i18n.global;

export class EntryQueryParams {
    searchType: number | null | undefined;
    keyword: string;
    keywords: string[];
    page: number | null = 1;
    size: number | null = 10;
    sortField: string | null;
    sortOrder: number | null;
}

export const loadEditor = (type: number, data: any, dialog: {
    open: (content: any, options?: (DynamicDialogOptions | undefined)) => DynamicDialogInstance
}) => {
    dialog.open(editor, {
        props: {
            header: t('Edit'),
            style: {
                width: '600px',
            },
            breakpoints: {
                '960px': '80vw',
                '640px': '70vw'
            },
            modal: true,
            closable: false
        },
        data: {
            entry: data,
            type: type
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