import editor from "@/components/entry/EntryEditor.vue";
import i18n from "@/locales/i18n";
import { bs } from '@/service/baseService'
import {META} from "@/config/Web_Const";

const {t} = i18n.global;

export class EntryCreateDTO {
    type: number = META.ENTRY_TYPE.PRODUCT;
    subType: number = 0;

    name: string = '';
    nameZh: string = '';
    nameEn: string = '';
    aliases: string[] = [];
    links: string[] = [];

    gender: number = 0;
    date: string = '';

    remark: string = '';
    detail: string = '';
}

export class EntryAdvanceCreateDTO {
    entry = new EntryCreateDTO();
    images: ImageDTO[] = [];
    relatedEntries: any[] = [];
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