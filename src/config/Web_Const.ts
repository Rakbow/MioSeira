export const META = {
    ACTION: {
        NO_ACTION: 0,
        INSERT: 1,
        UPDATE: 2,
        REAL_DELETE: 3,
        FAKE_DELETE: 4,
        ALL_DELETE: 5,
    },
    TEXT_TYPE: {
        BONUS: 'bonus',
        DETAIL: 'detail'
    },
    IMAGE_TYPE: {
        DEFAULT: 0,
        THUMB: 1,
        MAIN: 2,
        OTHER: 99
    },
    ITEM_TYPE: {
        ALBUM: 1,
        BOOK: 2,
        DISC: 3,
        GAME: 4,
        GOODS: 5,
        FIGURE: 6,
    },
    ENTITY: {
        ITEM: 0,
        ENTRY: 1,
        PERSON: 2,
        PRODUCT: 99,
        FRANCHISE: 100
    },
    LINK_TYPE: {
        OFFICIAL: 0,
        BLOG: 1,
        TWITTER: 2,
        FACEBOOK: 3,
        FAN_CLUB: 4,
        OTHER: 99
    },
    CURRENCIES: {
        CNY: 'CNY',
        USD: 'USD',
        EUR: 'EUR',
        TWD: 'TWD'
    }
}

export interface ItemFormConfig {
    type: number;
    cells: [ItemFormCell];
}

export interface ItemFormCell {
    type: number; // 0-InputText 1-InputNumber 2-InputMask 3-select 4-MultiSelect 5-ToggleSwitch 6-Textarea
    options: string;
    label: string;
    model: string;
    row: number;
    col: number;
    span: number;
    placeholder: string;
    required: boolean;
}

export interface Attribute {
    label: string;
    value: any;
}