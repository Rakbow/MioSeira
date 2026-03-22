import {RouteRecordRaw} from 'vue-router';
import {PERM_KEY} from "@/config/permKey";
import {API} from "@/api/api";

const ManageRouter: Array<RouteRecordRaw> = [
    {
        name: "Management",
        path: "/manage",
        component: () => import('@/views/management/ManageBoard.vue'),
        meta: {
            title: "Manage"
        },
        children: [
            {
                path: 'entry',
                component: () => import('@/views/management/EntryManageBoard.vue'),
                meta: {
                    title: "Entry Management",
                    perm: PERM_KEY.ENTRY.QUERY_LIST
                }
            },
            {
                path: 'item',
                component: () => import('@/views/management/ItemManageBoard.vue'),
                meta: {
                    title: "Item Management",
                    perm: PERM_KEY.ITEM.QUERY_LIST
                }
            },
            {
                path: 'ep',
                component: () => import('@/views/management/EpisodeManageBoard.vue'),
                meta: {
                    title: "Episode Management"
                }
            },
            {
                path: 'role',
                component: () => import('@/views/management/RoleManageBoard.vue'),
                meta: {
                    title: "Role Management",
                    perm: PERM_KEY.ROLE.QUERY_LIST
                }
            },
            {
                path: 'file',
                component: () => import('@/views/management/FileManageBoard.vue'),
                meta: {
                    title: "File Management"
                }
            }
        ],
    },
    {
        path: API.ITEM.CREATE_PATH,
        component: () => import('@/views/management/ItemCreate.vue'),
        meta: {
            title: "New Item"
        }
    },
    {
        path: API.ENTRY.CREATE_PATH,
        component: () => import('@/views/management/EntryCreate.vue'),
        meta: {
            title: "New Entry"
        }
    }
];

export default ManageRouter;
