import {AxiosHelper as axios} from "@/utils/axiosHelper";
import "@/config/Web_Helper_Strs";
import {API} from "@/config/Web_Helper_Strs";

export const DATABASE_ROUTER = [
    {
        name: "Home",
        path: "/",
        component: () => import('@/views/Index.vue'),
        meta: {
            title: "Home",
        }
    },
    {
        name: "Home",
        path: "/db/entry/:id",
        component: () => import('@/views/Index.vue'),
        meta: {
            title: "Home",
        }
    },

    {
        name: "PersonDetail",
        path: API.PERSON_DETAIL + "/:id",
        component: () => import('@/views/detail/PersonDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await axios.post(API.GET_PERSON_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;

                    document.title = res.data.item.name;
                    next();
                }else {
                    console.log(res.message);
                }
            }catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Person Detail"
        }
    },
    {
        name: "FranchiseDetail",
        path: API.FRANCHISE_DETAIL + "/:id",
        component: () => import('@/views/detail/FranchiseDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await axios.post(API.GET_FRANCHISE_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;
                    document.title = res.data.item.name;
                    next();
                }else {
                    console.log(res.message);
                }
            }catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Franchise Detail"
        }
    },
    {
        name: "ProductDetail",
        path: API.PRODUCT_DETAIL + "/:id",
        component: () => import('@/views/detail/ProductDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await axios.post(API.GET_PRODUCT_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;
                    document.title = res.data.item.name;
                    next();
                }else {
                    console.log(res.message);
                }
            }catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Product Detail"
        }
    },
    {
        name: "AlbumDetail",
        path: API.ALBUM_DETAIL + "/:id",
        component: () => import('@/views/detail/AlbumDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await axios.post(API.GET_ALBUM_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;
                    document.title = res.data.item.name;
                    next();
                }else {
                    console.log(res.message);
                }
            }catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Album Detail"
        }
    },
    {
        name: "BookDetail",
        path: API.BOOK_DETAIL + "/:id",
        component: () => import('@/views/detail/BookDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await axios.post(API.GET_BOOK_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;
                    document.title = res.data.item.title;
                    next();
                }else {
                    console.log(res.message);
                }
            }catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Book Detail"
        }
    },
    {
        name: "EpisodeDetail",
        path: API.EPISODE_DETAIL + "/:id",
        component: () => import('@/views/detail/EpisodeDetail.vue'),
        // beforeEnter: async (to, from, next) => {
        //     try {
        //         const res = await axios.post(API.GET_ALBUM_DETAIL, {id: to.params.id});
        //         if (res.state === axios.SUCCESS) {
        //             to.meta.info = res.data;
        //
        //             document.title = res.data.album.name;
        //             next();
        //         }else {
        //             console.log(res.message);
        //         }
        //     }catch (e) {
        //         console.error(e);
        //     }
        // },
        meta: {
            title: "Episode Detail"
        }
    },
    {
        name: "Manager",
        path: "/db/manager",
        component: () => import('@/views/manager/Manager.vue'),
        meta: {
            title: "Manager",
        },
        children: [
            {
                path: 'franchise',
                component: () => import('@/views/manager/FranchiseManager.vue'),
            },
            {
                path: 'product',
                component: () => import('@/views/manager/ProductManager.vue'),
            },
            {
                path: 'album',
                component: () => import('@/views/manager/AlbumManager.vue'),
            },
            {
                path: 'person',
                component: () => import('@/views/manager/PersonManager.vue'),
            },
            {
                path: 'person-role',
                component: () => import('@/views/manager/PersonRoleManager.vue'),
            }
        ],
    }
];
