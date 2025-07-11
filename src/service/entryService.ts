import editor from "@/components/entry/EntryEditor.vue";
import i18n from "@/locales/i18n";
import { bs } from '@/service/baseService'

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

export const loadEditor = (entry: any) => {
    bs!.dialog.open(editor, {
        props: {
            header: t('Edit'),
            style: {
                width: '50rem',
            },
            modal: true,
            closable: true
        },
        data: {
            entry: entry
        },
        onClose: (options) => {
            if (options!.data !== undefined) {
                if (options!.data.isUpdate) {
                    Object.assign(entry, options!.data.entry);
                }
            }
        }
    });
}