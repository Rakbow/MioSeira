import editor from "@/components/entityEditor/ItemEditor.vue";
import i18n from "@/config/i18n";
import {DynamicDialogInstance, DynamicDialogOptions} from "primevue/dynamicdialogoptions";

const {t} = i18n.global;
export const loadEditor = (dialog: {
    open: (content: any, options?: (DynamicDialogOptions | undefined)) => DynamicDialogInstance
}, item: any, option: any) => {
    dialog.open(editor, {
        props: {
            header: t('Edit'),
            style: {
                width: '800px',
            },
            breakpoints: {
                '960px': '80vw',
                '640px': '70vw'
            },
            modal: true,
            closable: false
        },
        data: {
            item: item,
            option: option
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