import {RouteRecordRaw} from 'vue-router';

const ManageRouter: Array<RouteRecordRaw> = [
    {
        name: "Management",
        path: "/db/manage",
        component: () => import('@/views/management/ManageBoard.vue'),
        meta: {
            title: "Manage"
        },
        children: [
            {
                path: 'entry',
                component: () => import('@/views/management/EntryManageBoard.vue'),
                meta: {
                    title: "Entry Management"
                }
            },
            {
                path: 'item',
                component: () => import('@/views/management/ItemManageBoard.vue'),
                meta: {
                    title: "Item Management"
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
                    title: "Role Management"
                }
            },
            {
                path: 'file',
                component: () => import('@/views/management/FileManageBoard.vue'),
                meta: {
                    title: "File Management"
                }
            },
            {
                path: 'item/submit',
                component: () => import('@/views/management/ItemCreate.vue'),
                meta: {
                    title: "Create New Item"
                }
            }
        ],
    }
];

export default ManageRouter;
