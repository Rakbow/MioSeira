import {bs} from "@/service/baseService";
import editor from "@/components/index/IndexEditor.vue";
import i18n from "@/locales/i18n";

const {t} = i18n.global;

export const loadEditor = (e: any) => {
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
            entity: e
        },
        onClose: (options) => {
            if (options!.data !== undefined) {
                if (options!.data.isUpdate) {
                    Object.assign(e, options!.data.entity);
                }
            }
        }
    });
}