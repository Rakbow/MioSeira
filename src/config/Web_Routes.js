import {AxiosHelper} from "@/utils/axios_helper";
import "@/config/Web_Helper_Strs";
import {API} from "@/config/Web_Helper_Strs";

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
        name: "Login",
        path: API.LOGIN_PAGE,
        component: () => import('@/components/Login.vue'),
        meta: {
            title: "Login"
        }
    },
    {
        name: "AlbumDetail",
        path: API.ALBUM_DETAIL + "/:id",
        component: () => import('@/components/AlbumDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await AxiosHelper.basePost(API.UPDATE_ITEM_STATUS, {id: to.params.id});
                if (res.state === 1) {
                    console.log(res.data);
                    to.meta.album = res.data.album;
                    to.meta.pageInfo = res.data.pageInfo;
                    to.meta.detailInfo = res.data.detailInfo;
                    to.meta.itemImageInfo = res.data.itemImageInfo;
                    to.meta.options = res.data.options;
                    to.meta.audioInfos = res.data.audioInfos;

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
    }
];