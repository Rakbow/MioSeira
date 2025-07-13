export const API = {

    ENTITY: {
        UPDATE_STATUS: '/api/db/update-entity-status',
        UPDATE_DETAIL: '/api/db/update-entity-detail',
        GET_OPTION: '/api/db/get-options',
        LIKE: '/api/db/like',
    },

    ITEM: {
        DETAIL_PATH: '/db/item',
        SEARCH_PATH: '/db/item',
        CREATE_PATH: 'item/submit',

        SEARCH: '/api/db/item/search',
        DETAIL: '/api/db/item/detail',
        LIST: '/api/db/item/list',
        CREATE: '/api/db/item/create',
        UPDATE: '/api/db/item/update',
        EXTRA_INFO: '/api/db/entry/get-extra-info',

        ALBUM_TRACK_QUICK_CREATE: '/api/db/item/album-track-quick-create',
        ALBUM_TRACK_LIST: '/api/db/item/album-track-list',
        ALBUM_TRACK_FILES_UPLOAD: '/api/db/item/album-track-files-upload',
        BOOK_CONVERT_ISBN: '/api/db/item/convert-isbn',
    },

    ENTRY: {
        DETAIL_PATH: '/db/entry',
        SEARCH_PATH: '/db/entry',

        SEARCH: '/api/db/entry/search',
        MINI: '/api/db/entry/mini',
        DETAIL: '/api/db/entry/detail',
        LIST: '/api/db/entry/list',
        UPDATE: '/api/db/entry/update',
        UPLOAD_IMAGE: '/api/db/entry/upload-image',
        SUB_PRODUCTS: '/api/db/entry/get-sub-products',
    },

    EPISODE: {
        DETAIL_PATH: '/db/ep',

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
        DETAIL_PATH: '/db/file',

        LIST: '/api/db/file/list',
        RELATED: '/api/db/file/related',
        UPDATE: '/api/db/file/update',
        UPLOAD: '/api/db/file/upload',
        RELATED_CREATE: '/api/db/file/related-create',
        RELATED_DELETE: '/api/db/file/related-delete',
        SEARCH: '/api/db/file/search',
    },

    //region user
    CHECK_USER_AUTHORITY: '/api/user/check-authority',
    LOGIN_PAGE: '/login',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    VERIFY_CODE: '/api/kaptcha',
    //endregion

    COMMON_EMPTY_COVER_IMAGE: 'https://static.rakbow.com/common/404.jpg?imageMogr2/auto-orient/thumbnail/160x160',
    COMMON_EMPTY_THUMB_IMAGE: 'https://static.rakbow.com/common/404.jpg?imageMogr2/auto-orient/thumbnail/60x60',
    STATIC_DOMAIN: 'https://static.rakbow.com/'
}