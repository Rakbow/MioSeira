import {RouteRecordRaw} from 'vue-router';

const ManageRouter: Array<RouteRecordRaw> = [
    {
        name: "Manager",
        path: "/db/manager",
        component: () => import('@/views/manager/Manager.vue'),
        meta: {
            title: "Manager",
        },
        children: [
            {
                path: '/',
                component: () => import('@/views/manager/ManagerIndex.vue'),
                meta: {
                    title: "Manager"
                }
            },
            {
                path: 'entry',
                component: () => import('@/views/manager/EntryManager.vue'),
            },
            {
                path: 'item',
                component: () => import('@/views/manager/ItemManager.vue'),
            },
            {
                path: 'ep',
                component: () => import('@/views/manager/EpisodeManager.vue'),
            },
            {
                path: 'role',
                component: () => import('@/views/manager/RoleManager.vue'),
            },
            {
                path: 'file',
                component: () => import('@/views/manager/FileManager.vue'),
            },


            {
                path: 'item/submit',
                component: () => import('@/views/manager/ItemCreate.vue')
            }
        ],
    }
];

export default ManageRouter;
