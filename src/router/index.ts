import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import DetailRouter from "@/router/routes/detail";
import ManageRouter from "@/router/routes/manage";
import SearchRouter from "@/router/routes/search";
import {setupGuards} from "@/router/guards";

const routers: Array<RouteRecordRaw> = [
    ...DetailRouter,
    ...ManageRouter,
    ...SearchRouter,
    {
        name: "Home",
        path: "/",
        component: () => import('@/views/Index.vue'),
        meta: {
            title: "Home",
        }
    },
    {
        path: '/error',
        component: () => import('@/views/Error.vue'),
        props: true,
        meta: {
            title: "Error"
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    }
});

setupGuards(router) // 注册路由守卫

export default router;