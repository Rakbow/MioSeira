import {createRouter, createWebHistory} from "vue-router";
import {DATABASE_ROUTER} from "@/config/Web_Routes";

const router = createRouter({
    history: createWebHistory(),
    routes: DATABASE_ROUTER
});

export default router;