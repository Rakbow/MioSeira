import {RouteRecordRaw} from 'vue-router';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import "@/config/Web_Helper_Strs";
import {API} from "@/config/Web_Helper_Strs";
import {META} from "@/config/Web_Const";

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
        name: "ItemSearch",
        path: API.ITEM_SEARCH_PATH,
        component: () => import('@/views/search/ItemSearch.vue'),
        meta: {
            title: "Items"
        }
    },
    {
        name: "EntrySearch",
        path: API.ENTRY_SEARCH_PATH,
        component: () => import('@/views/search/EntrySearch.vue'),
        meta: {
            title: "Entries"
        }
    },
    {
        name: "EntryDetail",
        path: API.ENTRY_DETAIL_PATH + "/:id",
        component: () => import('@/views/detail/EntryDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(`${API.ENTRY_GET_DETAIL}/${to.params.id}`);
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;
                    document.title = res.data.entry.name;
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
        name: "ItemDetail",
        path: API.ITEM_DETAIL_PATH + "/:id",
        component: () => import('@/views/detail/ItemDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(`${API.ITEM_GET_DETAIL}/${to.params.id}`);
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;
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
        name: "EpisodeDetail",
        path: API.EPISODE_DETAIL + "/:id",
        component: () => import('@/views/detail/EpisodeDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await axios.post(`${API.EPISODE_GET_DETAIL}/${to.params.id}`);
                if (res.state === axios.SUCCESS) {
                    to.meta.info = res.data;
                    document.title = res.data.name;
                    next();
                } else {
                    console.log(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        },
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
                meta: {
                    title: "Manager"
                }
            },
            {
                path: 'entry',
                component: () => import('@/views/manager/EntryManager.vue'),
            },
            {
                path: 'item',
                component: () => import('@/views/manager/ItemManager.vue'),
            },
            {
                path: 'ep',
                component: () => import('@/views/manager/EpisodeManager.vue'),
            },
            {
                path: 'role',
                component: () => import('@/views/manager/RoleManager.vue'),
            },
            {
                path: 'file',
                component: () => import('@/views/manager/FileManager.vue'),
            },


            {
                path: 'item/add',
                component: () => import('@/views/manager/ItemCreate.vue')
            }
        ],
    }
];
