import {RouteRecordRaw} from "vue-router";
import {API} from "@/api";

const SearchRouter: Array<RouteRecordRaw> = [
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
    }
];

export default SearchRouter;