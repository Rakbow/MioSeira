import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const i18n = createI18n({
    locale: 'zh', // 设置默认语言
    fallbackLocale: 'en', // 设置回退语言
    globalInjection: true,
    returnObjects: true,// 启用返回对象
    messages: {
        en,
        zh
    },
    legacy: false
});

export default i18n;