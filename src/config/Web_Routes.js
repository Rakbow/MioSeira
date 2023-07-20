import {AxiosHelper} from "@/utils/axios_helper";

export const DATABASE_ROUTER = [
    {
        name: "Home",
        path: "/",
        component: () => import('@/App.vue'),
        meta: {
            title: "Home"
        }
    },
    {
        name: "AlbumDetail",
        path: "/db/album/:id",
        component: () => import('@/components/AlbumDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await AxiosHelper.basePost('http://localhost:8081/db/album/get-album-detail', {id: to.params.id});
                if (res.state === 1) {
                    console.log(res.data);
                    to.meta.album = res.data.album;
                    to.meta.pageInfo = res.data.pageInfo;
                    to.meta.detailInfo = res.data.detailInfo;
                    to.meta.itemImageInfo = res.data.itemImageInfo;
                    to.meta.options = res.data.options;
                    to.meta.audioInfos = res.data.audioInfos;
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
    }
];