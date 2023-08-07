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
        name: "AlbumDetail",
        path: API.ALBUM_DETAIL + "/:id",
        component: () => import('@/views/AlbumDetail.vue'),
        beforeEnter: async (to, from, next) => {
            try {
                const res = await AxiosHelper.post(API.UPDATE_ITEM_STATUS, {id: to.params.id});
                if (res.state === 1) {
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
    }
];
