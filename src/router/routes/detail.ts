import {RouteRecordRaw} from 'vue-router';
import {API, Axios} from '@/api';

const DetailRouter: Array<RouteRecordRaw> = [
    {
        name: "EntryDetail",
        path: API.ENTRY.DETAIL_PATH + "/:id",
        component: () => import('@/views/detail/EntryDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const id = to.params.id;
                if (/^\d+$/.test(String(id))) {
                    const res = await Axios.post(`${API.ENTRY.DETAIL}/${id}`);
                    if (res.success()) {
                        to.meta.info = res.data;
                        to.meta.title = res.data.entry.name;
                        next();
                    } else {
                        console.log(res.message);
                    }
                } else {
                    next(false);
                }
            } catch (e) {
                console.error(e);
            }
        }
    },
    {
        name: "ItemDetail",
        path: API.ITEM.DETAIL_PATH + "/:id",
        component: () => import('@/views/detail/ItemDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const id = to.params.id;
                if (/^\d+$/.test(String(id))) {
                    const res = await Axios.post(`${API.ITEM.DETAIL}/${id}`);
                    if (res.success()) {
                        to.meta.info = res.data;
                        to.meta.title = res.data.item.name;
                        next();
                    } else {
                        console.log(res.message);
                    }
                } else {
                    next(false);
                }
            } catch (e) {
                console.error(e);
            }
        }
    },
    {
        name: "EpisodeDetail",
        path: API.EPISODE.DETAIL_PATH + "/:id",
        component: () => import('@/views/detail/EpisodeDetail.vue'),
        beforeEnter: async (to, _from, next) => {
            try {
                const res = await Axios.post(`${API.EPISODE.DETAIL}/${to.params.id}`);
                if (res.success()) {
                    to.meta.info = res.data;
                    to.meta.title = res.data.name;
                    next();
                } else {
                    console.log(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
];

export default DetailRouter;
