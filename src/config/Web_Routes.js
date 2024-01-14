import {AxiosHelper} from "@/utils/axiosHelper";
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
                const res = await AxiosHelper.post(API.GET_PERSON_DETAIL, {id: to.params.id});
                if (res.state === AxiosHelper.SUCCESS) {
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
        name: "AlbumDetail",
        path: API.ALBUM_DETAIL + "/:id",
        component: () => import('@/views/detail/AlbumDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await AxiosHelper.post(API.GET_ALBUM_DETAIL, {id: to.params.id});
                if (res.state === AxiosHelper.SUCCESS) {
                    to.meta.info = res.data;
                    document.title = res.data.album.name;
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
        name: "EpisodeDetail",
        path: API.EPISODE_DETAIL + "/:id",
        component: () => import('@/views/detail/EpisodeDetail.vue'),
        // beforeEnter: async (to, from, next) => {
        //     try {
        //         const res = await AxiosHelper.post(API.GET_ALBUM_DETAIL, {id: to.params.id});
        //         if (res.state === AxiosHelper.SUCCESS) {
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
