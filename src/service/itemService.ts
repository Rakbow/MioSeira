import editor from "@/components/entityEditor/ItemEditor.vue";
import i18n from "@/config/i18n";
import {META} from "@/config/Web_Const";
import { bs } from '@/service/baseService'

const {t} = i18n.global;

export class ItemCreateDTO {
    type: number = META.ITEM_TYPE.ALBUM;
    subType: number = 0;
    name: string = '';
    aliases: string[] = [];
    releaseDate: string = '';
    releaseType: number = 0;
    price: number = 0;
    region: string = 'jp';
    catalogId: string = '';
    barcode: string = '';
    bonus: boolean = false;

    weight: number = 0;
    width: number = 0;
    length: number = 0;
    height: number = 0;

    //album
    discs: number = 0;
    tracks: number = 0;
    episodes: number = 0;
    runTime: number = 0;
    disc = new AlbumDisc();

    mediaFormat: number[] = [1];

    //book
    pages: number = 0;
    lang: string = 'ja-JP';
    size: string = '';


    remark: string = '';
    detail: string = '';
}

export class ItemAdvanceCreateDTO {
    item = new ItemCreateDTO();
    images: ImageDTO[] = [];
    generateThumb: boolean = false;
    relatedEntities: any[] = [];
}

export class ItemQueryParams {
    entries: any[] = [];
    entityType: number | null | undefined = 0;
    entityId: number | null = 0;
    keyword: string | null = null;
    type: number | null = 0;
    subType: number | null = 0;
    releaseType: number | null = 0;
    barcode: string | null = "";
    catalogId: string | null = "";
    region: string | null = null;
    bonus: number | null = 0;
    page: number | null = 1;
    size: number | null = 60;
    sortField: string | null = null;
    sortOrder: number | null = null;
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

export class AlbumTrack {
    id = 0;
    serial= 0;
    name = '';
    duration = '';
}
export class AlbumDisc {
    id = 0;
    itemId = 0;
    catalogId = '';
    discNo = 1;
    mediaFormat = 1;
    albumFormat: number[] = [];
    tracks: AlbumTrack[] = [];
}

export const parseAlbumTracks = (input: string): AlbumTrack[] => {
    const lines = input.split("\n").filter(line => line.trim() !== ""); // 按行分割并去掉空行
    return lines.map(line => {
        // 使用正则匹配每行的曲目信息
        const match = line.match(/^(\d+)\s+(.*?)\s+(\d+:\d+)$/);
        if (!match) {
            throw new Error(`无法解析的行: ${line}`);
        }

        const serial = parseInt(match[1], 10); // 提取编号并转换为数字
        let name = match[2].replace(/\s*\(M\d+\)\s*/g, "").trim(); // 去掉 (Mx) 部分
        const duration = match[3]; // 提取时长部分
        let track = new AlbumTrack();
        track.serial = serial;
        track.name = name;
        track.duration = duration;
        return track;
    });
}

export const loadEditor = (item: any) => {
    bs!.dialog.open(editor, {
        props: {
            header: t('Edit'),
            style: {
                width: '60rem',
            },
            modal: true,
            closable: true
        },
        data: {
            item: item
        },
        onClose: (options) => {
            if (options!.data !== undefined) {
                if (options!.data.isUpdate) {
                    location.reload();
                }
            }
        }
    });
}
