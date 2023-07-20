import App from "@/App.vue";
import AlbumDetail from "@/components/AlbumDetail.vue";
import { createMetaManager } from 'vue-meta';

export const DATABASE_ROUTER = [
    {
        name: "Home",
        path: "/",
        component: App,
        meta: {
            title: "Home"
        }
    },
    {
        name: "AlbumDetail",
        path: "/db/album/:id",
        component: AlbumDetail,
        meta: {
            title: "Album Detail"
        }
    }
];