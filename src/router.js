import {createRouter, createWebHistory} from "vue-router";
import App from "./App.vue";
import AlbumDetail from "./components/AlbumDetail.vue";
import {reactive} from "vue";
import {useLocalStorage} from "@vueuse/core";

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

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: App},
        {path: "/album", component: AlbumDetail}
    ]
});