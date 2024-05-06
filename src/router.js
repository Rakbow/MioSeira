import {createRouter, createWebHistory} from "vue-router";
import {DATABASE_ROUTER} from "@/config/Web_Routes";
import {AxiosHelper as axios} from "@/utils/axiosHelper.js";
import {API} from "@/config/Web_Helper_Strs.js";
import {META} from "@/config/Web_Const.js";

const router = createRouter({
    history: createWebHistory(),
    routes: DATABASE_ROUTER
});

export default router;