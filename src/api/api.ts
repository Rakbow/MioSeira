export const API = {

    ENTITY: {
        UPDATE_STATUS: '/api/db/update-entity-status',
        UPDATE_DETAIL: '/api/db/update-entity-detail',
        GET_OPTION: '/api/db/get-options',
        LIKE: '/api/db/like',
        LINK: '/api/db/links',
        ENTITY_LOCAL_PATH: '/api/db/local-path',
        ENTITY_LOCAL_COMPLETED_FLAG_CHANGE: '/api/db/local-completed-flag-update',
    },

    ITEM: {
        DETAIL_PATH: '/item',
        SEARCH_PATH: '/item',
        CREATE_PATH: '/item/new',

        SEARCH: '/api/db/item/search',
        DETAIL: '/api/db/item/detail',
        LIST: '/api/db/item/list',
        CREATE: '/api/db/item/create',
        UPDATE: '/api/db/item/update',
        EXTRA_INFO: '/api/db/entry/get-extra-info',

        ALBUM_TRACK_LIST: '/api/db/item/album-track-list',
        ALBUM_TRACK_QUICK_CREATE: '/api/db/item/album-track-quick-create',
        ALBUM_TRACK_QUICK_UPLOAD: '/api/db/item/album-track-quick-upload',
        BOOK_CONVERT_ISBN: '/api/db/item/convert-isbn',
    },

    ENTRY: {
        DETAIL_PATH: '/entry',
        SEARCH_PATH: '/entry',
        CREATE_PATH: '/entry/new',

        SEARCH: '/api/db/entry/search',
        MINI: '/api/db/entry/mini',
        DETAIL: '/api/db/entry/detail',
        LIST: '/api/db/entry/list',
        CREATE: '/api/db/entry/create',
        UPDATE: '/api/db/entry/update',
        UPLOAD_IMAGE: '/api/db/entry/upload-image',
        SUB_PRODUCTS: '/api/db/entry/get-sub-products',
    },

    EPISODE: {
        DETAIL_PATH: '/ep',

        LIST: '/api/db/ep/list',
        DETAIL: '/api/db/ep/detail',
        RELATED: '/api/db/ep/related',
    },

    IMAGE: {
        PREVIEW: '/api/db/image/preview',
        LIST: '/api/db/image/list',
        UPLOAD: '/api/db/image/upload',
        UPDATE: '/api/db/image/update',
        DELETE: '/api/db/image/delete',
    },

    RELATION: {
        LIST: '/api/db/relation/list',
        CREATE: '/api/db/relation/create',
        UPDATE: '/api/db/relation/update',
        DELETE: '/api/db/relation/delete',
        PERSONNEL: '/api/db/relation/personnel',
        ITEMS: '/api/db/relation/items',
        ENTRIES: '/api/db/relation/entries',
    },

    ROLE: {
        LIST: '/api/db/role/list',
        CREATE: '/api/db/role/create',
        UPDATE: '/api/db/role/update',
        DELETE: '/api/db/role/delete',
        REFRESH: '/api/db/role/refresh',
    },

    FILE: {
        DETAIL_PATH: '/file',

        LIST: '/api/db/file/list',
        RELATED: '/api/db/file/related',
        UPDATE: '/api/db/file/update',
        UPLOAD: '/api/db/file/upload',
        RELATED_CREATE: '/api/db/file/related-create',
        RELATED_DELETE: '/api/db/file/related-delete',
        SEARCH: '/api/db/file/search',
    },

    CHANGELOG: {
        LIST: '/api/db/changelog-list',
        MINI: '/api/db/changelog-mini',
    },

    INDEX: {
        SEARCH_PATH: '/index',
        DETAIL_PATH: '/index',

        DETAIL: '/api/db/index/detail',
        SEARCH: '/api/db/index/search',
        LIST: '/api/db/index/list',
        CREATE: '/api/db/index/create',
        UPDATE: '/api/db/index/update',
        DELETE: '/api/db/index/delete',

        UPLOAD_IMAGE: '/api/db/index/upload-image',

        ELEMENT_ADD: '/api/db/index/add-items',
        ELEMENT_UPDATE: '/api/db/index/update-element',

        GET_ITEMS: '/api/db/index/get-items',
        GET_ITEMS_TMP: '/api/db/index/get-items',
    },

    AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        VERIFY_CODE: '/api/auth/kaptcha',
    },
    //endregion

    COMMON_EMPTY_COVER_IMAGE: 'https://oss.rakbow.com/common/404.jpg?imageMogr2/auto-orient/thumbnail/160x160',
    COMMON_EMPTY_THUMB_IMAGE: 'https://oss.rakbow.com/common/404.jpg?imageMogr2/auto-orient/thumbnail/60x60',
    STATIC_DOMAIN: 'https://oss.rakbow.com/'
}