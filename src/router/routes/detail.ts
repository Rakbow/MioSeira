import {RouteRecordRaw} from 'vue-router';
import { API, Axios } from '@/api';

const DetailRouter: Array<RouteRecordRaw> = [
    {
        name: "EntryDetail",
        path: API.ENTRY_DETAIL_PATH + "/:id",
        component: () => import('@/views/detail/EntryDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await Axios.post(`${API.ENTRY_GET_DETAIL}/${to.params.id}`);
                if (res.success()) {
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
                const res = await Axios.post(`${API.ITEM_GET_DETAIL}/${to.params.id}`);
                if (res.success()) {
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
                const res = await Axios.post(`${API.EPISODE_GET_DETAIL}/${to.params.id}`);
                if (res.success()) {
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
    }
];

export default DetailRouter;
