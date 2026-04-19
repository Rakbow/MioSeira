import {RouteRecordRaw} from "vue-router";
import {API} from "@/api";

const SearchRouter: Array<RouteRecordRaw> = [
    {
        name: "IndexSearch",
        path: API.INDEX.SEARCH_PATH,
        component: () => import('@/views/browser/IndexBrowser.vue'),
        meta: {
            title: "Indexes"
        }
    },
    {
        name: "ItemSearch",
        path: API.ITEM.SEARCH_PATH,
        component: () => import('@/views/browser/ItemBrowser.vue'),
        meta: {
            title: "Items"
        }
    },
    {
        name: "EntrySearch",
        path: API.ENTRY.SEARCH_PATH,
        component: () => import('@/views/browser/EntryBrowser.vue'),
        meta: {
            title: "Entries"
        }
    },
    {
        name: "Test lib",
        path: '/test-lib',
        component: () => import('@/components/image/ImageCropperDemo.vue'),
        meta: {
            title: "Test lib"
        }
    }
];

export default SearchRouter;