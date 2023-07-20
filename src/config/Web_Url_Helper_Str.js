//region entity common

const KUREA_KURUSU_URL = 'http://localhost:8083';

const UPDATE_ITEM_STATUS_URL = KUREA_KURUSU_URL + "/db/update-item-status";
const UPDATE_ITEMS_STATUS_URL = KUREA_KURUSU_URL + "/db/update-items-status";
const LIKE_ITEM_URL = KUREA_KURUSU_URL + "/db/like";
const UPDATE_DESCRIPTION_URL = KUREA_KURUSU_URL + "/db/update-description";
const UPDATE_BONUS_URL = KUREA_KURUSU_URL + "/db/update-bonus";
const UPDATE_SPECS_URL = KUREA_KURUSU_URL + "/db/update-specs";
const UPDATE_COMPANIES_URL = KUREA_KURUSU_URL + "/db/update-companies";
const UPDATE_PERSONNEL_URL = KUREA_KURUSU_URL + "/db/update-personnel";
const INSERT_IMAGES_URL = KUREA_KURUSU_URL + "/db/add-images";
const UPDATE_IMAGES_URL = KUREA_KURUSU_URL + "/db/update-images";

//endregion

//region page
const DATABASE_INDEX_URL = KUREA_KURUSU_URL + "/db";
const DATABASE_LIST_URL = KUREA_KURUSU_URL + "/db/list";

const INDEX_SEARCH_URL = KUREA_KURUSU_URL + "/db/simple-search";

const GET_ENTITY_AMOUNT_INFO_URL = KUREA_KURUSU_URL + "/db/get-entity-amount-info";

const APP_INDEX_URL = KUREA_KURUSU_URL + "/app";
const BLOG_INDEX_URL = KUREA_KURUSU_URL + "/blog";

const GET_INDEX_INIT_DATA_URL = KUREA_KURUSU_URL + "/db/get-index-init-data";
const GET_LIST_INIT_DATA_URL = KUREA_KURUSU_URL + "/db/get-list-init-data";

const FRANCHISE_LIST_URL = KUREA_KURUSU_URL + "/db/franchise/list";
const PRODUCT_LIST_URL = KUREA_KURUSU_URL + "/db/product/list";

const ALBUM_LIST_URL = KUREA_KURUSU_URL + "/db/album/list";
const ALBUM_INDEX_URL = KUREA_KURUSU_URL + "/db/albums";

const DISC_INDEX_URL = KUREA_KURUSU_URL + "/db/discs";
const DISC_LIST_URL = KUREA_KURUSU_URL + "/db/disc/list";

const BOOK_INDEX_URL = KUREA_KURUSU_URL + "/db/books";
const BOOK_LIST_URL = KUREA_KURUSU_URL + "/db/book/list";

const MERCH_INDEX_URL = KUREA_KURUSU_URL + "/db/merchs";
const MERCH_LIST_URL = KUREA_KURUSU_URL + "/db/merch/list";

const GAME_INDEX_URL = KUREA_KURUSU_URL + "/db/games";
const GAME_LIST_URL = KUREA_KURUSU_URL + "/db/game/list";

//endregion

//region entry
const ENTRY_DETAIL_URL = KUREA_KURUSU_URL + "/db/entry/";
const GET_ENTRIES_URL = KUREA_KURUSU_URL + "/db/entry/get-entries";
const DELETE_ENTRY_URL = KUREA_KURUSU_URL + "/db/entry/delete";
const UPDATE_ENTRY_URL = KUREA_KURUSU_URL + "/db/entry/update";
const INSERT_ENTRY_URL = KUREA_KURUSU_URL + "/db/entry/add";
const ENTRY_REFRESH_REDIS_DATA_URL = KUREA_KURUSU_URL + "/db/entry/refresh-redis-data";
//endregion

//region album
const ALBUM_DETAIL_URL = KUREA_KURUSU_URL + "/db/album/";
const DELETE_ALBUM_URL = KUREA_KURUSU_URL + "/db/album/delete";
const UPDATE_ALBUM_URL = KUREA_KURUSU_URL + "/db/album/update";
const INSERT_ALBUM_URL = KUREA_KURUSU_URL + "/db/album/add";
const GET_ALBUMS_URL = KUREA_KURUSU_URL + "/db/album/get-albums";
const GET_RELATED_ALBUMS_URL = KUREA_KURUSU_URL + "/db/album/get-related-albums";
const UPDATE_ALBUM_ARTISTS_URL = KUREA_KURUSU_URL + "/db/album/update-artists";
const UPDATE_ALBUM_TRACK_INFO_URL = KUREA_KURUSU_URL + "/db/album/update-trackInfo";
//endregion

//region music
const MUSIC_DETAIL_URL = KUREA_KURUSU_URL + "/db/music/";
const UPLOAD_MUSIC_FILE_URL = KUREA_KURUSU_URL + "/db/music/upload-file";
const DELETE_MUSIC_FILE_URL = KUREA_KURUSU_URL + "/db/music/delete-file";
const UPDATE_MUSIC_URL = KUREA_KURUSU_URL + "/db/music/update";
const UPDATE_MUSIC_ARTISTS_URL = KUREA_KURUSU_URL + "/db/music/update-artists";
const UPDATE_MUSIC_LYRICS_TEXT_URL = KUREA_KURUSU_URL + "/db/music/update-lyrics-text";
//endregion

//region user
const CHECK_USER_AUTHORITY_URL = KUREA_KURUSU_URL + "/user/check-authority";
const LOGIN_URL = KUREA_KURUSU_URL + "/login";
const LOGOUT_URL = KUREA_KURUSU_URL + "/logout";
//endregion

//region product
const PRODUCT_DETAIL_URL = KUREA_KURUSU_URL + "/db/product/";
const GET_PRODUCTS_URL = KUREA_KURUSU_URL + "/db/product/get-products";
const GET_PRODUCT_SET_URL = KUREA_KURUSU_URL + "/db/product/get-product-set";
const ADD_PRODUCT_URL = KUREA_KURUSU_URL + "/db/product/add";
const UPDATE_PRODUCT_URL = KUREA_KURUSU_URL + "/db/product/update";
const UPDATE_PRODUCT_ORGANIZATIONS_URL = KUREA_KURUSU_URL + "/db/product/update-organizations";
const UPDATE_PRODUCT_STAFF_URL = KUREA_KURUSU_URL + "/db/product/update-staffs";
const GET_RELATED_PRODUCTS_URL = KUREA_KURUSU_URL + "/db/product/get-related-products";
//endregion

//region disc
const DISC_DETAIL_URL = KUREA_KURUSU_URL + "/db/disc/";
const DELETE_DISC_URL = KUREA_KURUSU_URL + "/db/disc/delete";
const UPDATE_DISC_URL = KUREA_KURUSU_URL + "/db/disc/update";
const INSERT_DISC_URL = KUREA_KURUSU_URL + "/db/disc/add";
const GET_DISCS_URL = KUREA_KURUSU_URL + "/db/disc/get-discs";
const GET_RELATED_DISCS_URL = KUREA_KURUSU_URL + "/db/disc/get-related-discs";
//endregion

//region book
const BOOK_DETAIL_URL = KUREA_KURUSU_URL + "/db/book/";
const DELETE_BOOK_URL = KUREA_KURUSU_URL + "/db/book/delete";
const UPDATE_BOOK_URL = KUREA_KURUSU_URL + "/db/book/update";
const INSERT_BOOK_URL = KUREA_KURUSU_URL + "/db/book/add";
const GET_BOOKS_URL = KUREA_KURUSU_URL + "/db/book/get-books";
const GET_RELATED_BOOKS_URL = KUREA_KURUSU_URL + "/db/book/get-related-books";

const BOOK_GENERATE_ISBN_URL = KUREA_KURUSU_URL + "/db/book/get-isbn";

const UPDATE_BOOK_AUTHORS_URL = KUREA_KURUSU_URL + "/db/book/update-authors";
//endregion

//region merch
const MERCH_DETAIL_URL = KUREA_KURUSU_URL + "/db/merch/";
const DELETE_MERCH_URL = KUREA_KURUSU_URL + "/db/merch/delete";
const UPDATE_MERCH_URL = KUREA_KURUSU_URL + "/db/merch/update";
const INSERT_MERCH_URL = KUREA_KURUSU_URL + "/db/merch/add";
const GET_MERCHS_URL = KUREA_KURUSU_URL + "/db/merch/get-merchs";
const GET_RELATED_MERCHS_URL = KUREA_KURUSU_URL + "/db/merch/get-related-merchs";
//endregion

//region game
const GAME_DETAIL_URL = KUREA_KURUSU_URL + "/db/game/";
const DELETE_GAME_URL = KUREA_KURUSU_URL + "/db/game/delete";
const UPDATE_GAME_URL = KUREA_KURUSU_URL + "/db/game/update";
const INSERT_GAME_URL = KUREA_KURUSU_URL + "/db/game/add";
const GET_GAMES_URL = KUREA_KURUSU_URL + "/db/game/get-games";
const GET_RELATED_GAMES_URL = KUREA_KURUSU_URL + "/db/game/get-related-games";
const UPDATE_GAME_ORGANIZATIONS_URL = KUREA_KURUSU_URL + "/db/game/update-organizations";
const UPDATE_GAME_STAFFS_URL = KUREA_KURUSU_URL + "/db/game/update-staffs";
//endregion

//region franchise
const FRANCHISE_DETAIL_URL = KUREA_KURUSU_URL + "/db/franchise/";
const DELETE_FRANCHISE_URL = KUREA_KURUSU_URL + "/db/franchise/delete";
const UPDATE_FRANCHISE_URL = KUREA_KURUSU_URL + "/db/franchise/update";
const ADD_FRANCHISE_URL = KUREA_KURUSU_URL + "/db/franchise/add";
const GET_FRANCHISES_URL = KUREA_KURUSU_URL + "/db/franchise/get-franchises";


//endregion

//region header

const ENTITY = {
    ALBUM: 1,
    DISC: 2,
    BOOK: 3,
    MERCH: 4,
    GAME: 5,
    FRANCHISE: 6,
    PRODUCT: 7,
    MUSIC: 9,
    ENTRY: 10
};

const ENTITY_TYPE = [
    {label: '专辑', labelEn: 'Album', value: '1', icon: 'pi iconfont icon-album'},
    {label: 'BD/DVD', labelEn: 'Disc', value: '2', icon: 'pi iconfont icon-Video-Disc'},
    {label: '书籍', labelEn: 'Book', value: '3', icon: 'pi iconfont icon-book'},
    {label: '周边', labelEn: 'Merch', value: '4', icon: 'pi iconfont icon-yinshuabaozhuang'},
    {label: '游戏', labelEn: 'Game', value: '5', icon: 'pi iconfont icon-youxi'},
    // {label: '系列', labelEn: 'Franchise', value: '6', icon: 'pi pi-bookmark'},
    // {label: '作品', labelEn: 'Product', value: '7', icon: 'pi pi-th-large'},
    // {label: '文章', labelEn: 'Article', value: '8', icon: 'pi pi-bars'},
    {label: '音乐', labelEn: 'Music', value: '9', icon: 'pi iconfont icon-music'}
];

const PRODUCT_ORGANIZATION_FORMAT = [
    {label: '名称(默认)', value: 0},
    {label: '名称/地区', value: 1},
    {label: '名称/地区/平台', value: 2}
];

const NOT_LOGIN_NAVBAR_ITEMS = [
    {
        label: '首页', icon: 'pi pi-fw pi-home', url: "/"
    },
    {
        label: '数据库',
        icon: 'pi pi-fw iconfont icon-database',
        items: [
            {
                label: '数据库首页',
                icon: 'pi pi-fw iconfont icon-database',
                url: DATABASE_INDEX_URL
            },
            {
                label: '数据库(列表)',
                icon: 'pi pi-fw iconfont icon-database',
                url: DATABASE_LIST_URL
            }
        ]
    },
    // {
    //     label: '博客', icon: 'pi pi-fw pi-book', url: BLOG_INDEX_URL
    // },
    // {
    //     label: '应用', icon: 'pi iconfont icon-yingyong', url: APP_INDEX_URL
    // },
    {
        label: '后台', icon: 'pi iconfont icon-login', url: LOGIN_URL
    }
];

const LOGIN_NAVBAR_ITEMS = [
    {
        label: '首页',
        icon: 'pi pi-fw pi-home',
        url: "/"
    },
    {
        label: '数据库',
        icon: 'pi pi-fw iconfont icon-database',
        items: [
            {
                label: '数据库首页',
                icon: 'pi pi-fw iconfont icon-database',
                url: DATABASE_INDEX_URL
            },
            {
                label: '数据库(列表)',
                icon: 'pi pi-fw iconfont icon-database',
                url: DATABASE_LIST_URL
            }
        ]
    },
    // {
    //     label: '博客',
    //     icon: 'pi pi-fw pi-book',
    //     url: BLOG_INDEX_URL
    // },
    // {
    //     label: '应用',
    //     icon: 'pi iconfont icon-yingyong',
    //     url: APP_INDEX_URL
    // },
    {
        label: '登出', icon: 'pi iconfont icon-logout', url: LOGOUT_URL
    }
];
//endregion