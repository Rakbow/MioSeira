import editor from "@/components/entityEditor/ItemEditor.vue";
import creator from "@/components/entityEditor/ItemCreator.vue";
import i18n from "@/config/i18n";
import {DynamicDialogInstance, DynamicDialogOptions} from "primevue/dynamicdialogoptions";

const {t} = i18n.global;

export class ItemQueryParams {
    entries: Array;
    entityType: number | null | undefined;
    entityId: number | null;
    keyword: string | null;
    type: number | null;
    subType: number | null;
    releaseType: number | null;
    barcode: string | null;
    catalogId: string | null;
    region: string | null;
    bonus: number | null;
    page: number | null = 1;
    size: number | null = 60;
    sortField: string | null;
    sortOrder: number | null;
}

// 定义商品参数接口
export interface ItemSpecParams {
    length: number; // 长度（单位 mm）
    width: number;  // 宽度（单位 mm）
    height: number; // 高度（单位 mm）
    weight: number; // 重量（单位 g）
}

export const loadEditor = (item: any, dialog: {
    open: (content: any, options?: (DynamicDialogOptions | undefined)) => DynamicDialogInstance
}) => {
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
            item: item
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

export const loadCreator = (dialog: {
    open: (content: any, options?: (DynamicDialogOptions | undefined)) => DynamicDialogInstance
}) => {
    dialog.open(creator, {
        props: {
            header: t('Add'),
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
        data: {},
        onClose: (options) => {
            // @ts-ignore
            if (options.data !== undefined) {
                // @ts-ignore
                return options.data.isUpdate;
            }
        }
    });
}

/**
 * 解析商品参数字符串
 * @param input 输入的商品参数字符串
 * @returns 包含长度、宽度、高度和重量的对象
 */
export const parseItemSpecParams = (input: string): ItemSpecParams => {
    const result: ItemSpecParams = {
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
    };

    // 匹配尺寸部分，例如 "14.09 x 12.63 x 1.37 cm" 或 "14.09 x 12.63 x 1.37 mm"
    const dimensionMatch = input.match(/(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)\s*(cm|mm)/i);
    if (dimensionMatch) {
        const length = parseFloat(dimensionMatch[1]);
        const width = parseFloat(dimensionMatch[3]);
        const height = parseFloat(dimensionMatch[5]);
        const unit = dimensionMatch[7].toLowerCase();

        const conversionFactor = unit === "cm" ? 10 : 1; // cm 转换为 mm

        result.length = parseFloat((length * conversionFactor).toFixed(2));
        result.width = parseFloat((width * conversionFactor).toFixed(2));
        result.height = parseFloat((height * conversionFactor).toFixed(2));
    }

    // 匹配重量部分，例如 "80.32 g" 或 "0.08 kg"
    const weightMatch = input.match(/(\d+(\.\d+)?)\s*(g|kg)/i);
    if (weightMatch) {
        const weight = parseFloat(weightMatch[1]);
        const unit = weightMatch[3].toLowerCase();

        result.weight = unit === "kg"
            ? parseFloat((weight * 1000).toFixed(2)) // kg 转换为 g
            : parseFloat(weight.toFixed(2)); // 保留两位小数
    }

    return result;
}
