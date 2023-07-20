import {createRouter, createWebHistory} from "vue-router";
import {reactive} from "vue";
import {useLocalStorage} from "@vueuse/core";
import {DATABASE_ROUTER} from "@/config/Web_Routes";

// 创建一个用于存储用户信息的响应式对象
const user = reactive({
    username: '',
    headerUrl: '',
    type: 0
});

// 使用vueuse的useLocalStorage工具函数创建一个localStorage绑定
const localStorageUser = useLocalStorage('user', user);

// 导航守卫的回调函数，在每次路由跳转之前执行
const beforeRouteEnter = (to, from, next) => {
    // 从cookie中读取用户信息并存入localStorage
    const cookie = document.cookie;
    // 解析cookie，获取用户信息
    // 假设cookie格式为 "username=xxx; avatarUrl=xxx"
    const username = /username=(\w+)/.exec(cookie)?.[1];
    const avatarUrl = /avatarUrl=(\S+)/.exec(cookie)?.[1];

    // 更新localStorage中的用户信息
    localStorageUser.value.username = username;
    localStorageUser.value.avatarUrl = avatarUrl;

    next();
};

const router = createRouter({
    history: createWebHistory(),
    routes: DATABASE_ROUTER
});

// 注册全局前置守卫
router.beforeEach(beforeRouteEnter);

export default router;