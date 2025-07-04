import {DynamicDialogInstance, DynamicDialogOptions} from "primevue/dynamicdialogoptions";
import editor from "@/components/entityEditor/EntryEditor.vue";
import i18n from "@/config/i18n";

const {t} = i18n.global;

export class EntryQueryParams {
    type: number | null | undefined;
    keyword: string | null = "";
    keywords: string[] | null = [];
    page: number | null = 1;
    size: number | null = 10;
    sortField: string | null = "";
    sortOrder: number | null = null;
}

export const loadEditor = (data: any, dialog: {
    open: (content: any, options?: (DynamicDialogOptions | undefined)) => DynamicDialogInstance
}) => {
    dialog.open(editor, {
        props: {
            header: t('Edit'),
            style: {
                width: '50rem',
            },
            modal: true,
            closable: true
        },
        data: {
            entry: data
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