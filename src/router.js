import {createRouter, createWebHistory} from "vue-router";
import {DATABASE_ROUTER} from "@/config/Web_Routes";
import {useAuth} from "@/utils/useAuth";

const router = createRouter({
    history: createWebHistory(),
    routes: DATABASE_ROUTER
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = useAuth().checkAuth(); // 自定义函数，用于检查登录状态

    if (isAuthenticated && to.name === "Login") {
        next('/'); // 如果用户已登录且要访问的是登录页面，则重定向到"/index"
    } else {
        next(); // 继续正常导航
    }
});

export default router;