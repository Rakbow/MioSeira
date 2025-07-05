import {defineStore} from "pinia";
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {META} from "@/config/Web_Const";
import {i18nConst} from "@/config/i18nConst";

export const useOptionStore = defineStore('options', {
    state: () => ({
        options: {} as Record<string, any>, // 全局缓存的选项数据
        itemCurrent: 1,
        entryCurrent: 1,
    }),
    actions: {
        async fetchOptions() {
            if (Object.keys(this.options).length === 0) {
                console.log('Fetching options...');
                const {locale} = useI18n();
                this.$reset();

                const res = await Axios.get(API.ENTITY_GET_OPTION);
                this.options = res.data;

                this.itemCurrent = META.ITEM_TYPE.ALBUM;
                this.entryCurrent = META.ENTRY_TYPE.PRODUCT;

                this.options.genderSet = i18nConst.genderSet[locale.value];
                this.options.imageTypeSet = i18nConst.imageTypeSet![locale.value];
                this.options.bookTypeSet = i18nConst.bookTypeSet![locale.value];
                this.options.goodsTypeSet = i18nConst.goodsTypeSet![locale.value];
                this.options.figureTypeSet = i18nConst.figureTypeSet![locale.value];
                this.options.releaseTypeSet = i18nConst.releaseTypeSet![locale.value];
                this.options.entrySubTypeSet = i18nConst.entrySubTypeSet![locale.value];
                this.options.languageSet = i18nConst.languageSet![locale.value];
            }
        },
        clear() {
            this.options = {};
        }
    },
    persist: true, // 开启持久化
});