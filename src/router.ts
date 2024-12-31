import {createRouter, createWebHistory} from "vue-router";
import {DATABASE_ROUTER} from "@/config/Web_Routes";

const router = createRouter({
    history: createWebHistory(),
    routes: DATABASE_ROUTER,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    }
});

export default router;