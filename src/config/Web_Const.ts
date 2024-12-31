export const META = {
    STATIC_DOMAIN: 'https://static.rakbow.com/',
    RELATION_RELATED_DIRECTION: {
        POSITIVE: 1,
        NEGATIVE: -1
    },
    RELATION_RELATED_GROUP: {
        DEFAULT: 0,
        RELATED_PERSON: 1,
        RELATED_ENTRY: 2,
        RELATED_ITEM: 3,
        RELATED_CHAR: 4,
        RELATED_PRODUCT: 5,
        MATERIAL: 6,
        EVENT: 7
    },
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
    PRODUCT_TYPE: {
        ANIME: 0,
        NOVEL: 1,
        COMIC: 2,
        GAME: 3,
        MOVIE: 4,
        TV_SERIES: 5,
        OTHER: 99,
        MAIN_SERIES: 100,
    },
    ENTITY: {
        ITEM: 0,
        ENTRY: 1,
        PERSON: 2,
        CHARACTER: 5,
        PRODUCT: 99,
        FRANCHISE: 100
    },
    ENTRY_SEARCH_TYPE: {
        PRODUCT: 0,
        PERSON: 1,
        CHARACTER: 2,
        CLASSIFICATION: 3,
        MATERIAL: 4,
        EVENT: 5,
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
    },
    RegionSet: [
        {label: "jp", value: "jp"},
        {label: "cn", value: "cn"},
        {label: "tw", value: "tw"},
        {label: "hk", value: "hk"},
        {label: "eu", value: "eu"},
        {label: "us", value: "us"},
        {label: "gb", value: "gb"}
    ],
    ENTITY_ICON_SET: [
        { icon: 'pi pi-bars', value: '1', disabled: false },
        { icon: 'pi pi-users', value: '2', disabled: false },
        { icon: 'pi pi-th-large', value: '99', disabled: false },
    ],
    ITEM_TYPE_SET: [
        { icon: 'music_note', value: '1', disabled: false },
        { icon: 'menu_book', value: '2', disabled: false },
        { icon: 'album', value: '3', disabled: true },
        { icon: 'stadia_controller', value: '4', disabled: true },
        { icon: 'package_2', value: '5', disabled: true },
        { icon: 'package_2', value: '6', disabled: true }
    ]
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

export class EntityInfo {
    type: number = 0;
    id: number = 0;
}