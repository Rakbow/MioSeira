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
        ROLE: 3,
        EPISODE: 4,
        FILE: 98,
        FRANCHISE: 100
    },
    ENTRY_TYPE: {
        PRODUCT: 1,
        PERSON: 2,
        CHARACTER: 3,
        CLASSIFICATION: 4,
        MATERIAL: 5,
        EVENT: 6
    },
    ENTRY_SUB_TYPE: {
        OTHER: 0,
        ANIME: 1,
        NOVEL: 2,
        COMIC: 3,
        GAME: 4,
        MOVIE: 5,
        TV_SERIES: 6,
        MAIN_SERIES: 100
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
    ENTRY_TYPE_SET: [
        {icon: 'list', value: '1'},
        {icon: 'group', value: '2'},
        {icon: 'mood', value: '3'},
        {icon: 'folder', value: '4'},
        {icon: 'diamond', value: '5'},
        {icon: 'home', value: '6'}
    ],
    ITEM_TYPE_SET: [
        { icon: 'genres', value: '1', disabled: false },
        { icon: 'book_5', value: '2', disabled: false },
        { icon: 'hangout_video', value: '3', disabled: false },
        { icon: 'stadia_controller', value: '4', disabled: true },
        { icon: 'package_2', value: '5', disabled: false },
        { icon: 'accessibility_new', value: '6', disabled: false }
    ],
    FILE_CREATE_TYPE_SET: [
        {icon: 'upload_file', value: '0'},
        {icon: 'cloud_done', value: '1'}
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

export class RelatedEntry {
    products: any[] = [];
    persons: any[] = [];
    characters: any[] = [];
    classifications: any[] = [];
    materials: any[] = [];
    events: any[] = [];
}

export class EntityInfo {
    type: number = 0;
    id: number = 0;
}