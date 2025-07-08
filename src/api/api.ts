export const API = {

    //region entity
    ENTITY_UPDATE_STATUS: '/api/db/update-entity-status',
    ENTITY_UPDATE_DETAIL: '/api/db/update-entity-detail',
    ENTITY_GET_OPTION: '/api/db/get-options',
    ENTITY_LIKE: '/api/db/like',
    //endregion

    //region item
    ITEM_SEARCH_PATH: '/db/item',
    ITEM_CREATE_PATH: 'item/submit',
    ITEM_SEARCH: '/api/db/item/search',
    ITEM_DETAIL_PATH: '/db/item',
    ITEM_GET_DETAIL: '/api/db/item/detail',
    ITEM_LIST: '/api/db/item/list',
    ITEM_CREATE: '/api/db/item/create',
    ITEM_UPDATE: '/api/db/item/update',

    ITEM_EXTRA_INFO: '/api/db/entry/get-extra-info',
    ITEM_CONVERT_ISBN: '/api/db/item/convert-isbn',

    ALBUM_TRACK_QUICK_CREATE: '/api/db/item/album-track-quick-create',
    ALBUM_TRACK_LIST: '/api/db/item/album-track-list',
    ALBUM_TRACK_FILES_UPLOAD: '/api/db/item/album-track-files-upload',
    //endregion

    //region entry
    ENTRY_SEARCH_PATH: '/db/entry',
    ENTRY_SEARCH: '/api/db/entry/search',
    ENTRY_DETAIL_PATH: '/db/entry',
    ENTRY_GET_MINI: '/api/db/entry/mini',
    ENTRY_GET_DETAIL: '/api/db/entry/detail',
    ENTRY_GET_LIST: '/api/db/entry/list',
    ENTRY_UPDATE: '/api/db/entry/update',
    ENTRY_UPLOAD_IMAGE: '/api/db/entry/upload-image',
    ENTRY_GET_SUB_PRODUCTS: '/api/db/entry/get-sub-products',
    //endregion

    //region episode
    EPISODE_DETAIL: '/db/ep',
    EPISODE_GET_LIST: '/api/db/ep/list',
    EPISODE_GET_DETAIL: '/api/db/ep/detail',
    EPISODE_GET_RELATED: '/api/db/ep/related',
    //endregion

    //region image
    IMAGES_DEFAULT_DISPLAYED: '/api/db/image/default-displayed',
    IMAGE_LIST: '/api/db/image/list',
    IMAGE_UPLOAD: '/api/db/image/upload',
    IMAGE_UPDATE: '/api/db/image/update',
    IMAGE_DELETE: '/api/db/image/delete',
    //endregion

    //region relation
    RELATION_LIST: '/api/db/relation/list',
    RELATION_CREATE: '/api/db/relation/create',
    RELATION_UPDATE: '/api/db/relation/update',
    RELATION_DELETE: '/api/db/relation/delete',
    RELATION_PERSONNEL: '/api/db/relation/personnel',
    //endregion

    //region role
    ROLE_LIST: '/api/db/role/list',
    ROLE_CREATE: '/api/db/role/create',
    ROLE_UPDATE: '/api/db/role/update',
    ROLE_DELETE: '/api/db/role/delete',
    ROLE_REFRESH: '/api/db/role/refresh',
    //endregion

    //region file
    FILE_DETAIL_PATH: '/db/file',
    FILE_LIST: '/api/db/file/list',
    FILE_RELATED: '/api/db/file/related',
    FILE_UPDATE: '/api/db/file/update',
    FILE_UPLOAD: '/api/db/file/upload',
    FILE_RELATED_CREATE: '/api/db/file/create-related',
    FILE_SEARCH: '/api/db/file/search',
    //endregion

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