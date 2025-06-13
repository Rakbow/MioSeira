export const API = {

    ITEM_SEARCH_PATH: '/db/items',
    ITEM_SEARCH: '/api/db/item/search',
    ENTRY_SEARCH_PATH: '/db/entries',

    //region item

    ITEM_DETAIL: '/db/item',
    GET_ITEM_DETAIL: '/api/db/item/detail',
    GET_ITEM_LIST: '/api/db/item/list',
    ADD_ITEM: '/api/db/item/add',
    ADVANCE_CREATE_ITEM: '/api/db/item/advance-create',
    UPDATE_ITEM: '/api/db/item/update',
    UPDATE_BONUS: '/api/db/item/update-bonus',
    GET_EXC_RELATED_ENTRIES: '/api/db/item/get-exc-related-entries',

    BOOK_GENERATE_ISBN: '/api/db/item/get-isbn',

    QUICK_CREATE_ALBUM_TRACK: '/api/db/item/quick-create-album-disc',
    UPDATE_ALBUM_TRACK_INFO: '/api/db/item/update-album-track-info',
    GET_ALBUM_TRACK_INFO: '/api/db/item/get-album-track-info',
    UPLOAD_ALBUM_TRACK_FILES: '/api/db/item/upload-album-track-files',

    //endregion

    //region entry
    ENTRY_DETAIL: '/db/entry',
    GET_MINI_ENTRY: '/api/db/entry/mini',
    GET_ENTRY_DETAIL: '/api/db/entry/detail',
    UPDATE_ENTRY: '/api/db/entry/update',
    ENTRY_SEARCH: '/api/db/entry/search',
    UPLOAD_ENTRY_IMAGE: '/api/db/entry/upload-image',
    GET_ENTRY_LIST: '/api/db/entry/list',
    GET_SUB_PRODUCTS: '/api/db/entry/get-sub-entries',
    //endregion

    //region episode
    GET_EPISODE_LIST: '/api/db/ep/list',
    GET_EPISODE_DETAIL: '/api/db/ep/detail',
    EPISODE_DETAIL: '/db/ep',
    GET_EPISODE_RELATED: '/api/db/ep/get-related',

    //endregion

    //region file
    GET_FILE_LIST: '/api/db/file/list',
    GET_RELATED_FILES: '/api/db/related-files',
    FILE_UPDATE: '/api/db/file/update',
    FILE_DETAIL: '/db/file',
    UPLOAD_FILES: '/api/db/file/upload',
    CREATE_FILE_RELATED: '/api/db/file/create-related',
    FILE_SEARCH: '/api/db/file/search',
    //endregion

    //region
    DOMAIN: '/',

    GET_STATISTIC_INFO: '/api/db/statistic-info',

    GET_ENTITY_OPTION: '/api/db/get-options',

    //region user
    CHECK_USER_AUTHORITY: '/api/user/check-authority',
    LOGIN_PAGE: '/login',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    VERIFY_CODE: '/api/kaptcha',
    //endregion

    //region image

    GET_DISPLAY_IMAGES: '/api/db/get-display-images',
    GET_IMAGES: '/api/db/get-images',
    UPLOAD_IMAGE: '/api/db/upload-image',
    UPDATE_IMAGE: '/api/db/update-image',
    DELETE_IMAGE: '/api/db/delete-images',

    //endregion

    //region relation
    GET_ROLE_LIST: '/api/db/relation/get-roles',
    ADD_ROLE: '/api/db/relation/add-role',
    UPDATE_ROLE: '/api/db/relation/update-role',
    DELETE_ROLE: '/api/db/relation/delete-role',
    REFRESH_ROLE: '/api/db/refresh-role',

    GET_RELATION: '/api/db/relation/get-relations',
    ADD_RELATION: '/api/db/relation/add-relations',
    UPDATE_RELATION: '/api/db/relation/update-relation',
    DELETE_RELATION: '/api/db/relation/delete-relations',

    GET_RELATED_ENTITY: '/api/db/relation/get-related-entity',
    GET_RELATED_ENTITIES: '/api/db/relation/get-related-entities',
    //endregion

    UPDATE_ENTITY_STATUS: '/api/db/update-entity-status',
    LIKE_ENTITY: '/api/db/like',
    UPDATE_ENTITY_DETAIL: '/api/db/update-entity-detail',

    //endregion

    //region page
    DATABASE_INDEX: '/db',
    DATABASE_LIST: '/db/list',

    INDEX_SEARCH: '/api/db/simple-search',

    GET_ENTITY_AMOUNT_INFO: '/api/db/get-entity-amount-info',

    APP_INDEX: '/app',
    BLOG_INDEX: '/blog',

    GET_INDEX_INIT_DATA: '/api/db/get-index-init-data',
    GET_LIST_INIT_DATA: '/api/db/get-list-init-data',
    //endregion

    COMMON_EMPTY_COVER_IMAGE: 'https://static.rakbow.com/common/404.jpg?imageMogr2/auto-orient/thumbnail/160x160',
    COMMON_EMPTY_THUMB_IMAGE: 'https://static.rakbow.com/common/404.jpg?imageMogr2/auto-orient/thumbnail/60x60'
}