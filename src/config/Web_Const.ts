export const META = {
    STATIC_DOMAIN: 'https://static.rakbow.com/',
    RELATION_RELATED_DIRECTION: {
        POSITIVE: 1,
        NEGATIVE: -1
    },
    RELATION_RELATED_GROUP: {
        DEFAULT: 0,
        PRODUCT: 1,
        PERSON: 2,
        CHARACTER: 3,
        CLASSIFICATION: 4,
        MATERIAL: 5,
        EVENT: 6,
        ITEM: 10
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
        JPY: 'JPY',
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
        {icon: 'widgets', value: '1', label: 'Product'},
        {icon: 'group', value: '2', label: 'Person'},
        {icon: 'mood', value: '3', label: 'Character'},
        {icon: 'folder', value: '4', label: 'Classification'},
        {icon: 'diamond', value: '5', label: 'Material'},
        {icon: 'distance', value: '6', label: 'Event'}
    ],
    ITEM_TYPE_SET: [
        // {icon: 'filter_alt_off', value: null, disabled: false, label: 'Entity.Album'},
        {icon: 'genres', value: '1', disabled: false, label: 'Entity.Album'},
        {icon: 'book', value: '2', disabled: false, label: 'Entity.Book'},
        {icon: 'hangout_video', value: '3', disabled: false, label: 'Entity.Disc'},
        {icon: 'stadia_controller', value: '4', disabled: true, label: 'Entity.Game'},
        {icon: 'chess_pawn', value: '5', disabled: false, label: 'Entity.Goods'},
        {icon: 'accessibility_new', value: '6', disabled: false, label: 'Entity.Figure'}
    ],
    FILE_CREATE_TYPE_SET: [
        {icon: 'upload_file', label: 'LocalFile', value: '0'},
        {icon: 'cloud_done', label: 'CloudFile', value: '1'}
    ],
    ENTITY_TYPE_SET: {
        O: 'item',
        1: 'entry'
    },

    RELATION_CONFIG: [
        {
            key: [0, 1], type: 1, subConfigs: [
                {
                    label: 'RelatedProduct',
                    icon: 'newsstand',
                    value: [1]
                }
            ]
        },
        {
            key: [0, 2], type: 1, subConfigs: [
                {
                    label: 'RelatedProduct',
                    icon: 'newsstand',
                    value: [1]
                }
            ]
        },
        {
            key: [0, 3], type: 1, subConfigs: [
                {
                    label: 'RelatedProduct',
                    icon: 'newsstand',
                    value: [1]
                }
            ]
        },
        {
            key: [0, 5], type: 1, subConfigs: [{
                label: 'RelatedProduct',
                icon: 'newsstand',
                value: [1]
            }, {
                label: 'RelatedCharacter',
                icon: 'person',
                value: [3]
            }]
        },
        {
            key: [0, 6], type: 1, subConfigs: [{
                label: 'RelatedProduct',
                icon: 'newsstand',
                value: [1]
            }, {
                label: 'RelatedCharacter',
                icon: 'person',
                value: [3]
            }]
        },
        {
            key: [1, 1], type: 1, subConfigs: [{
                label: 'RelatedProduct',
                icon: 'newsstand',
                value: [1]
            }, {
                label: 'RelatedCharacter',
                icon: 'person',
                value: [3]
            }, {
                label: 'RelatedEntry',
                icon: 'lists',
                value: [4, 5, 6]
            }]
        },
        {
            key: [1, 2], type: 1, subConfigs: [{
                label: 'RelatedProduct',
                icon: 'newsstand',
                value: [1]
            }, {
                label: 'RelatedCharacter',
                icon: 'person',
                value: [3]
            }, {
                label: 'RelatedEntry',
                icon: 'lists',
                value: [4, 5, 6]
            }]
        },
        {
            key: [1, 3], type: 1, subConfigs: [{
                label: 'RelatedProduct',
                icon: 'newsstand',
                value: [1]
            }, {
                label: 'RelatedCharacter',
                icon: 'person',
                value: [3]
            }, {
                label: 'RelatedEntry',
                icon: 'lists',
                value: [4, 5, 6]
            }]
        },
        {key: [1, 4], type: 1, subConfigs: [{
                label: 'RelatedEntry',
                icon: 'lists',
                value: [4, 5, 6]
            }]},
        {key: [1, 5], type: 1, subConfigs: [{
                label: 'RelatedEntry',
                icon: 'lists',
                value: [4, 5, 6]
            }]},
        {key: [1, 6], type: 1, subConfigs: [{
                label: 'RelatedEntry',
                icon: 'lists',
                value: [4, 5, 6]
            }]}
    ]
}

export class Attribute {
    label: string = "";
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