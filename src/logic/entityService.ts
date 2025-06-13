import {DynamicDialogInstance, DynamicDialogOptions} from "primevue/dynamicdialogoptions";
import fileEditor from "@/components/entityEditor/FileEditor.vue";
import {META} from "@/config/Web_Const";
import i18n from "@/config/i18n";

const {t} = i18n.global;
let editor = null;

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