//region entity common
export const API = {
    
    //region
    DOMAIN: '/',

    //region user
    CHECK_USER_AUTHORITY: '/api/user/check-authority',
    LOGIN_PAGE: '/login',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    VERIFY_CODE: '/api/kaptcha',
    //endregion

    GET_ALBUM_DETAIL: '/api/db/album/get-album-detail',

    UPDATE_ITEM_STATUS: '/api/db/update-item-status',
    UPDATE_ITEMS_STATUS: '/api/db/update-items-status',
    LIKE_ITEM: '/api/db/like',
    UPDATE_DESCRIPTION: '/api/db/update-description',
    UPDATE_BONUS: '/api/db/update-bonus',
    UPDATE_SPECS: '/api/db/update-specs',
    UPDATE_COMPANIES: '/api/db/update-companies',
    UPDATE_PERSONNEL: '/api/db/update-personnel',
    INSERT_IMAGES: '/api/db/add-images',
    UPDATE_IMAGES: '/api/db/update-images',

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
    ENTRY_DETAIL: '/db/entry/',
    GET_ENTRIES: '/api/db/entry/get-entries',
    DELETE_ENTRY: '/api/db/entry/delete',
    UPDATE_ENTRY: '/api/db/entry/update',
    INSERT_ENTRY: '/api/db/entry/add',
    ENTRY_REFRESH_REDIS_DATA: '/api/db/entry/refresh-redis-data',
    //endregion

    //region album
    ALBUM_DETAIL: '/db/album',
    DELETE_ALBUM: '/api/db/album/delete',
    UPDATE_ALBUM: '/api/db/album/update',
    INSERT_ALBUM: '/api/db/album/add',
    GET_ALBUMS: '/api/db/album/get-albums',
    GET_RELATED_ALBUMS: '/api/db/album/get-related-albums',
    UPDATE_ALBUM_ARTISTS: '/api/db/album/update-artists',
    UPDATE_ALBUM_TRACK_INFO: '/api/db/album/update-trackInfo',
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
    GET_PRODUCTS: '/api/db/product/get-products',
    GET_PRODUCT_SET: '/api/db/product/get-product-set',
    ADD_PRODUCT: '/api/db/product/add',
    UPDATE_PRODUCT: '/api/db/product/update',
    UPDATE_PRODUCT_ORGANIZATIONS: '/api/db/product/update-organizations',
    UPDATE_PRODUCT_STAFF: '/api/db/product/update-staffs',
    GET_RELATED_PRODUCTS: '/api/db/product/get-related-products',
    //endregion

    //region disc
    DISC_DETAIL: '/db/disc',
    DELETE_DISC: '/api/db/disc/delete',
    UPDATE_DISC: '/api/db/disc/update',
    INSERT_DISC: '/api/db/disc/add',
    GET_DISCS: '/api/db/disc/get-discs',
    GET_RELATED_DISCS: '/api/db/disc/get-related-discs',
    //endregion

    //region book
    BOOK_DETAIL: '/db/book',
    DELETE_BOOK: '/api/db/book/delete',
    UPDATE_BOOK: '/api/db/book/update',
    INSERT_BOOK: '/api/db/book/add',
    GET_BOOKS: '/api/db/book/get-books',
    GET_RELATED_BOOKS: '/api/db/book/get-related-books',

    BOOK_GENERATE_ISBN: '/api/db/book/get-isbn',

    UPDATE_BOOK_AUTHORS: '/api/db/book/update-authors',
    //endregion

    //region merch
    MERCH_DETAIL: '/db/merch',
    DELETE_MERCH: '/api/db/merch/delete',
    UPDATE_MERCH: '/api/db/merch/update',
    INSERT_MERCH: '/api/db/merch/add',
    GET_MERCHS: '/api/db/merch/get-merchs',
    GET_RELATED_MERCHS: '/api/db/merch/get-related-merchs',
    //endregion

    //region game
    GAME_DETAIL: '/db/game',
    DELETE_GAME: '/api/db/game/delete',
    UPDATE_GAME: '/api/db/game/update',
    INSERT_GAME: '/api/db/game/add',
    GET_GAMES: '/api/db/game/get-games',
    GET_RELATED_GAMES: '/api/db/game/get-related-games',
    UPDATE_GAME_ORGANIZATIONS: '/api/db/game/update-organizations',
    UPDATE_GAME_STAFFS: '/api/db/game/update-staffs',
    //endregion

    //region franchise
    FRANCHISE_DETAIL: '/db/franchise',
    DELETE_FRANCHISE: '/api/db/franchise/delete',
    UPDATE_FRANCHISE: '/api/db/franchise/update',
    ADD_FRANCHISE: '/api/db/franchise/add',
    GET_FRANCHISES: '/api/db/franchise/get-franchises',
    //endregion
}




//endregion

//region header

// const ENTITY = {
//     ALBUM: 1,
//     DISC: 2,
//     BOOK: 3,
//     MERCH: 4,
//     GAME: 5,
//     FRANCHISE: 6,
//     PRODUCT: 7,
//     MUSIC: 9,
//     ENTRY: 10
// };
//
// const ENTITY_TYPE = [
//     {label: '专辑', labelEn: 'Album', value: '1', icon: 'pi iconfont icon-album'},
//     {label: 'BD/DVD', labelEn: 'Disc', value: '2', icon: 'pi iconfont icon-Video-Disc'},
//     {label: '书籍', labelEn: 'Book', value: '3', icon: 'pi iconfont icon-book'},
//     {label: '周边', labelEn: 'Merch', value: '4', icon: 'pi iconfont icon-yinshuabaozhuang'},
//     {label: '游戏', labelEn: 'Game', value: '5', icon: 'pi iconfont icon-youxi'},
//     // {label: '系列', labelEn: 'Franchise', value: '6', icon: 'pi pi-bookmark'},
//     // {label: '作品', labelEn: 'Product', value: '7', icon: 'pi pi-th-large'},
//     // {label: '文章', labelEn: 'Article', value: '8', icon: 'pi pi-bars'},
//     {label: '音乐', labelEn: 'Music', value: '9', icon: 'pi iconfont icon-music'}
// ];
//
// const PRODUCT_ORGANIZATION_FORMAT = [
//     {label: '名称(默认)', value: 0},
//     {label: '名称/地区', value: 1},
//     {label: '名称/地区/平台', value: 2}
// ];
//
// const NOT_LOGIN_NAVBAR_ITEMS = [
//     {
//         label: '首页', icon: 'pi pi-fw pi-home', url: '/'
//     },
//     {
//         label: '数据库',
//         icon: 'pi pi-fw iconfont icon-database',
//         items: [
//             {
//                 label: '数据库首页',
//                 icon: 'pi pi-fw iconfont icon-database',
//                 url: DATABASE_INDEX
//             },
//             {
//                 label: '数据库(列表)',
//                 icon: 'pi pi-fw iconfont icon-database',
//                 url: DATABASE_LIST
//             }
//         ]
//     },
//     // {
//     //     label: '博客', icon: 'pi pi-fw pi-book', url: BLOG_INDEX
//     // },
//     // {
//     //     label: '应用', icon: 'pi iconfont icon-yingyong', url: APP_INDEX
//     // },
//     {
//         label: '后台', icon: 'pi iconfont icon-login', url: LOGIN
//     }
// ];
//
// const LOGIN_NAVBAR_ITEMS = [
//     {
//         label: '首页',
//         icon: 'pi pi-fw pi-home',
//         url: '/'
//     },
//     {
//         label: '数据库',
//         icon: 'pi pi-fw iconfont icon-database',
//         items: [
//             {
//                 label: '数据库首页',
//                 icon: 'pi pi-fw iconfont icon-database',
//                 url: DATABASE_INDEX
//             },
//             {
//                 label: '数据库(列表)',
//                 icon: 'pi pi-fw iconfont icon-database',
//                 url: DATABASE_LIST
//             }
//         ]
//     },
//     // {
//     //     label: '博客',
//     //     icon: 'pi pi-fw pi-book',
//     //     url: BLOG_INDEX
//     // },
//     // {
//     //     label: '应用',
//     //     icon: 'pi iconfont icon-yingyong',
//     //     url: APP_INDEX
//     // },
//     {
//         label: '登出', icon: 'pi iconfont icon-logout', url: LOGOUT
//     }
// ];
//endregion