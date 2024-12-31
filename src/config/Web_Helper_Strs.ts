export const API = {

    //region

    ITEM_DETAIL: '/db/item',
    GET_ITEM_DETAIL: '/api/db/item/detail',
    GET_ITEM_LIST: '/api/db/item/list',
    ADD_ITEM: '/api/db/item/add',
    UPDATE_ITEM: '/api/db/item/update',
    UPDATE_BONUS: '/api/db/item/update-bonus',
    GET_EXC_RELATED_ENTRIES: '/api/db/item/get-exc-related-entries',
    GET_RELATED_ITEMS: '/api/db/item/related-items',

    BOOK_GENERATE_ISBN: '/api/db/item/get-isbn',

    QUICK_ADD_ALBUM_DISC: '/api/db/item/quick-add-album-disc',
    UPDATE_ALBUM_TRACK_INFO: '/api/db/item/update-album-track-info',
    GET_ALBUM_TRACK_INFO: '/api/db/item/get-album-track-info',

    //endregion

    //region
    DOMAIN: '/',

    GENERAL_SEARCH: '/api/db/search',
    GET_STATISTIC_INFO: '/api/db/statistic-info',

    GET_ENTITY_OPTION: '/api/db/get-options',
    SEARCH_ENTRIES: '/api/db/search',

    //region user
    CHECK_USER_AUTHORITY: '/api/user/check-authority',
    LOGIN_PAGE: '/login',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    VERIFY_CODE: '/api/kaptcha',
    //endregion

    //region image

    GET_IMAGES: '/api/db/get-images',
    ADD_IMAGE: '/api/db/add-image',
    UPDATE_IMAGE: '/api/db/update-image',
    DELETE_IMAGE: '/api/db/delete-images',

    //endregion

    //region person
    PERSON_DETAIL: '/db/person',
    GET_PERSON_LIST: '/api/db/person/list',
    ADD_PERSON: '/api/db/person/add',
    UPDATE_PERSON: '/api/db/person/update',
    DELETE_PERSON: '/api/db/person/delete',
    GET_PERSON_DETAIL: '/api/db/person/detail',
    SEARCH_PERSON: '/api/db/person/search',

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
    //endregion

    UPDATE_ITEMS_STATUS: '/api/db/update-entry-status',
    LIKE_ITEM: '/api/db/like',
    UPDATE_DETAIL: '/api/db/update-entry-detail',

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

    //region entry
    ENTRY_DETAIL: '/db/entry',
    GET_ENTRY_DETAIL: '/api/db/entry/detail',
    DELETE_ENTRY: '/api/db/entry/delete',
    UPDATE_ENTRY: '/api/db/entry/update',
    INSERT_ENTRY: '/api/db/entry/add',
    ENTRY_REFRESH_REDIS_DATA: '/api/db/entry/refresh-redis-data',
    //endregion

    //region character
    CHARACTER_DETAIL: '/db/character',
    GET_CHARACTER_DETAIL: '/api/db/character/detail',
    //endregion


    //region episode
    EPISODE_DETAIL: '/db/ep',
    //endregion

    //region music
    MUSIC_DETAIL: '/db/music',
    UPLOAD_MUSIC_FILE: '/api/db/music/upload-file',
    DELETE_MUSIC_FILE: '/api/db/music/delete-file',
    UPDATE_MUSIC: '/api/db/music/update',
    UPDATE_MUSIC_ARTISTS: '/api/db/music/update-artists',
    UPDATE_MUSIC_LYRICS_TEXT: '/api/db/music/update-lyrics-text',
    //endregion

    //region product
    PRODUCT_DETAIL: '/db/product',
    GET_PRODUCT_DETAIL: '/api/db/product/detail',
    GET_PRODUCTS: '/api/db/product/list',
    GET_PRODUCT_SET: '/api/db/product/get-product-set',
    ADD_PRODUCT: '/api/db/product/add',
    UPDATE_PRODUCT: '/api/db/product/update',
    UPDATE_PRODUCT_ORGANIZATIONS: '/api/db/product/update-organizations',
    UPDATE_PRODUCT_STAFF: '/api/db/product/update-staffs',
    GET_RELATED_PRODUCTS: '/api/db/product/get-related-products',

    GET_SUB_PRODUCTS: '/api/db/product/get-sub-product'
    //endregion
}