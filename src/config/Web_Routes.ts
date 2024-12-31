import {RouteRecordRaw} from 'vue-router';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import "@/config/Web_Helper_Strs";
import {API} from "@/config/Web_Helper_Strs";

export const DATABASE_ROUTER: Array<RouteRecordRaw> = [
    {
        name: "Home",
        path: "/",
        component: () => import('@/views/Index.vue'),
        meta: {
            title: "Home",
        }
    },
    {
        path: '/error',
        component: () => import('@/views/Error.vue'),
        props: true,
        meta: {
            title: "Error"
        }
    },
    {
        name: "PersonDetail",
        path: API.PERSON_DETAIL + "/:id",
        component: () => import('@/views/detail/PersonDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(API.GET_PERSON_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    (to.meta as any).info = res.data;
                    document.title = res.data.item.name;
                    next();
                } else {
                    console.log(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Person Detail"
        }
    },
    {
        name: "EntryDetail",
        path: API.ENTRY_DETAIL + "/:id",
        component: () => import('@/views/detail/EntryDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(API.GET_ENTRY_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    (to.meta as any).info = res.data;
                    document.title = res.data.item.name;
                    next();
                } else {
                    console.log(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Entry Detail"
        }
    },
    {
        name: "ProductDetail",
        path: API.PRODUCT_DETAIL + "/:id",
        component: () => import('@/views/detail/ProductDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(API.GET_PRODUCT_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    (to.meta as any).info = res.data;
                    document.title = res.data.item.name;
                    next();
                } else {
                    console.log(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Product Detail"
        }
    },
    {
        name: "ItemDetail",
        path: API.ITEM_DETAIL + "/:id",
        component: () => import('@/views/detail/ItemDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(API.GET_ITEM_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    (to.meta as any).info = res.data;
                    document.title = res.data.item.name;
                    next();
                } else {
                    console.log(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Item Detail"
        }
    },
    {
        name: "CharacterDetail",
        path: API.CHARACTER_DETAIL + "/:id",
        component: () => import('@/views/detail/CharacterDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(API.GET_CHARACTER_DETAIL, {id: to.params.id});
                if (res.state === axios.SUCCESS) {
                    (to.meta as any).info = res.data;
                    document.title = res.data.target.name;
                    next();
                } else {
                    console.log(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        },
        meta: {
            title: "Character Detail"
        }
    },
    {
        name: "EpisodeDetail",
        path: API.EPISODE_DETAIL + "/:id",
        component: () => import('@/views/detail/EpisodeDetail.vue'),
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
                path: '/',
                component: () => import('@/views/manager/ManagerIndex.vue'),
                // beforeEnter: async (to, _from, next) => {
                //     try {
                //         const res = await axios.post(API.GET_STATISTIC_INFO);
                //         if (res.state === axios.SUCCESS) {
                //             to.meta.items = res.data;
                //             next();
                //         } else {
                //             console.log(res.message);
                //         }
                //     } catch (e) {
                //         console.error(e);
                //     }
                // },
                meta: {
                    title: "Manager"
                }
            },
            {
                path: 'product',
                component: () => import('@/views/manager/ProductManager.vue'),
            },
            {
                path: 'item',
                component: () => import('@/views/manager/ItemManager.vue'),
            },
            {
                path: 'item/add',
                component: () => import('@/views/manager/ItemDetailedCreator.vue')
            },
            {
                path: 'album',
                component: () => import('@/views/manager/AlbumManager.vue'),
            },
            {
                path: 'book',
                component: () => import('@/views/manager/BookManager.vue'),
            },
            {
                path: 'person',
                component: () => import('@/views/manager/PersonManager.vue'),
            },
            {
                path: 'role',
                component: () => import('@/views/manager/RoleManager.vue'),
            }
        ],
    }
];
