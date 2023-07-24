//region entity common

const ORIGIN_DOMAIN = 'http://localhost:8081';

export const API = {
    
    //region
    DOMAIN: ORIGIN_DOMAIN,

    //region user
    CHECK_USER_AUTHORITY: ORIGIN_DOMAIN + "/user/check-authority",
    LOGIN_PAGE: "/login",
    LOGIN: ORIGIN_DOMAIN + "/login",
    LOGOUT: ORIGIN_DOMAIN + "/logout",
    VERIFY_CODE: ORIGIN_DOMAIN + "/kaptcha",
    //endregion

    GET_ALBUM_DETAIL: ORIGIN_DOMAIN + '/db/album/get-album-detail',

    UPDATE_ITEM_STATUS: ORIGIN_DOMAIN + "/db/album/get-album-detail",
    UPDATE_ITEMS_STATUS: ORIGIN_DOMAIN + "/db/update-items-status",
    LIKE_ITEM: ORIGIN_DOMAIN + "/db/like",
    UPDATE_DESCRIPTION: ORIGIN_DOMAIN + "/db/update-description",
    UPDATE_BONUS: ORIGIN_DOMAIN + "/db/update-bonus",
    UPDATE_SPECS: ORIGIN_DOMAIN + "/db/update-specs",
    UPDATE_COMPANIES: ORIGIN_DOMAIN + "/db/update-companies",
    UPDATE_PERSONNEL: ORIGIN_DOMAIN + "/db/update-personnel",
    INSERT_IMAGES: ORIGIN_DOMAIN + "/db/add-images",
    UPDATE_IMAGES: ORIGIN_DOMAIN + "/db/update-images",

    //endregion

    //region page
    DATABASE_INDEX: ORIGIN_DOMAIN + "/db",
    DATABASE_LIST: ORIGIN_DOMAIN + "/db/list",

    INDEX_SEARCH: ORIGIN_DOMAIN + "/db/simple-search",

    GET_ENTITY_AMOUNT_INFO: ORIGIN_DOMAIN + "/db/get-entity-amount-info",

    APP_INDEX: ORIGIN_DOMAIN + "/app",
    BLOG_INDEX: ORIGIN_DOMAIN + "/blog",

    GET_INDEX_INIT_DATA: ORIGIN_DOMAIN + "/db/get-index-init-data",
    GET_LIST_INIT_DATA: ORIGIN_DOMAIN + "/db/get-list-init-data",

    FRANCHISE_LIST: ORIGIN_DOMAIN + "/db/franchise/list",
    PRODUCT_LIST: ORIGIN_DOMAIN + "/db/product/list",

    ALBUM_LIST: ORIGIN_DOMAIN + "/db/album/list",
    ALBUM_INDEX: ORIGIN_DOMAIN + "/db/albums",

    DISC_INDEX: ORIGIN_DOMAIN + "/db/discs",
    DISC_LIST: ORIGIN_DOMAIN + "/db/disc/list",

    BOOK_INDEX: ORIGIN_DOMAIN + "/db/books",
    BOOK_LIST: ORIGIN_DOMAIN + "/db/book/list",

    MERCH_INDEX: ORIGIN_DOMAIN + "/db/merchs",
    MERCH_LIST: ORIGIN_DOMAIN + "/db/merch/list",

    GAME_INDEX: ORIGIN_DOMAIN + "/db/games",
    GAME_LIST: ORIGIN_DOMAIN + "/db/game/list",

    //endregion

    //region entry
    ENTRY_DETAIL: ORIGIN_DOMAIN + "/db/entry/",
    GET_ENTRIES: ORIGIN_DOMAIN + "/db/entry/get-entries",
    DELETE_ENTRY: ORIGIN_DOMAIN + "/db/entry/delete",
    UPDATE_ENTRY: ORIGIN_DOMAIN + "/db/entry/update",
    INSERT_ENTRY: ORIGIN_DOMAIN + "/db/entry/add",
    ENTRY_REFRESH_REDIS_DATA: ORIGIN_DOMAIN + "/db/entry/refresh-redis-data",
    //endregion

    //region album
    ALBUM_DETAIL: "/db/album",
    DELETE_ALBUM: ORIGIN_DOMAIN + "/db/album/delete",
    UPDATE_ALBUM: ORIGIN_DOMAIN + "/db/album/update",
    INSERT_ALBUM: ORIGIN_DOMAIN + "/db/album/add",
    GET_ALBUMS: ORIGIN_DOMAIN + "/db/album/get-albums",
    GET_RELATED_ALBUMS: ORIGIN_DOMAIN + "/db/album/get-related-albums",
    UPDATE_ALBUM_ARTISTS: ORIGIN_DOMAIN + "/db/album/update-artists",
    UPDATE_ALBUM_TRACK_INFO: ORIGIN_DOMAIN + "/db/album/update-trackInfo",
    //endregion

    //region music
    MUSIC_DETAIL: "/db/music",
    UPLOAD_MUSIC_FILE: ORIGIN_DOMAIN + "/db/music/upload-file",
    DELETE_MUSIC_FILE: ORIGIN_DOMAIN + "/db/music/delete-file",
    UPDATE_MUSIC: ORIGIN_DOMAIN + "/db/music/update",
    UPDATE_MUSIC_ARTISTS: ORIGIN_DOMAIN + "/db/music/update-artists",
    UPDATE_MUSIC_LYRICS_TEXT: ORIGIN_DOMAIN + "/db/music/update-lyrics-text",
    //endregion

    //region product
    PRODUCT_DETAIL: "/db/product",
    GET_PRODUCTS: ORIGIN_DOMAIN + "/db/product/get-products",
    GET_PRODUCT_SET: ORIGIN_DOMAIN + "/db/product/get-product-set",
    ADD_PRODUCT: ORIGIN_DOMAIN + "/db/product/add",
    UPDATE_PRODUCT: ORIGIN_DOMAIN + "/db/product/update",
    UPDATE_PRODUCT_ORGANIZATIONS: ORIGIN_DOMAIN + "/db/product/update-organizations",
    UPDATE_PRODUCT_STAFF: ORIGIN_DOMAIN + "/db/product/update-staffs",
    GET_RELATED_PRODUCTS: ORIGIN_DOMAIN + "/db/product/get-related-products",
    //endregion

    //region disc
    DISC_DETAIL: "/db/disc",
    DELETE_DISC: ORIGIN_DOMAIN + "/db/disc/delete",
    UPDATE_DISC: ORIGIN_DOMAIN + "/db/disc/update",
    INSERT_DISC: ORIGIN_DOMAIN + "/db/disc/add",
    GET_DISCS: ORIGIN_DOMAIN + "/db/disc/get-discs",
    GET_RELATED_DISCS: ORIGIN_DOMAIN + "/db/disc/get-related-discs",
    //endregion

    //region book
    BOOK_DETAIL: "/db/book",
    DELETE_BOOK: ORIGIN_DOMAIN + "/db/book/delete",
    UPDATE_BOOK: ORIGIN_DOMAIN + "/db/book/update",
    INSERT_BOOK: ORIGIN_DOMAIN + "/db/book/add",
    GET_BOOKS: ORIGIN_DOMAIN + "/db/book/get-books",
    GET_RELATED_BOOKS: ORIGIN_DOMAIN + "/db/book/get-related-books",

    BOOK_GENERATE_ISBN: ORIGIN_DOMAIN + "/db/book/get-isbn",

    UPDATE_BOOK_AUTHORS: ORIGIN_DOMAIN + "/db/book/update-authors",
    //endregion

    //region merch
    MERCH_DETAIL: "/db/merch",
    DELETE_MERCH: ORIGIN_DOMAIN + "/db/merch/delete",
    UPDATE_MERCH: ORIGIN_DOMAIN + "/db/merch/update",
    INSERT_MERCH: ORIGIN_DOMAIN + "/db/merch/add",
    GET_MERCHS: ORIGIN_DOMAIN + "/db/merch/get-merchs",
    GET_RELATED_MERCHS: ORIGIN_DOMAIN + "/db/merch/get-related-merchs",
    //endregion

    //region game
    GAME_DETAIL: "/db/game",
    DELETE_GAME: ORIGIN_DOMAIN + "/db/game/delete",
    UPDATE_GAME: ORIGIN_DOMAIN + "/db/game/update",
    INSERT_GAME: ORIGIN_DOMAIN + "/db/game/add",
    GET_GAMES: ORIGIN_DOMAIN + "/db/game/get-games",
    GET_RELATED_GAMES: ORIGIN_DOMAIN + "/db/game/get-related-games",
    UPDATE_GAME_ORGANIZATIONS: ORIGIN_DOMAIN + "/db/game/update-organizations",
    UPDATE_GAME_STAFFS: ORIGIN_DOMAIN + "/db/game/update-staffs",
    //endregion

    //region franchise
    FRANCHISE_DETAIL: "/db/franchise",
    DELETE_FRANCHISE: ORIGIN_DOMAIN + "/db/franchise/delete",
    UPDATE_FRANCHISE: ORIGIN_DOMAIN + "/db/franchise/update",
    ADD_FRANCHISE: ORIGIN_DOMAIN + "/db/franchise/add",
    GET_FRANCHISES: ORIGIN_DOMAIN + "/db/franchise/get-franchises",
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
//         label: '首页', icon: 'pi pi-fw pi-home', url: "/"
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
//         url: "/"
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