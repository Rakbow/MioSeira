import { defineStore } from 'pinia';
import {AxiosHelper as axios} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
import {META} from "@/config/Web_Const";

export const useOptionsStore = defineStore('options', {
    state: () => ({
        options: {} as Record<string, any>, // 全局缓存的选项数据
        itemCurrent: 0,
        entryCurrent: 0,
    }),
    actions: {
        async fetchOptions() {
            // this.$reset();
            if (Object.keys(this.options).length === 0) {
                const res = await axios.get(API.GET_ENTITY_OPTION); // 后台 API
                this.options = res.data;
                this.itemCurrent = META.ITEM_TYPE.ALBUM;
                this.entryCurrent = META.ENTRY_TYPE.PRODUCT;
            }
        },
        clear() {
            this.options = {};
        }
    },
    persist: true, // 开启持久化
});