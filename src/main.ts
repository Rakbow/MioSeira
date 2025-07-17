//region css
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "@/styles/font.css";
import "@/styles/general.scss";
import "@/styles/entity-global.scss";
//endregion


import App from "@/App.vue";//vue
import {createMetaManager} from "vue-meta";
import {createApp} from "vue";
import router from "@/router";// vue-router
import pinia from '@/store';
import 'material-symbols';
import i18n from '@/locales/i18n';// vue-i18n
import {API} from "@/api";
import {META} from "@/config/Web_Const";
import {setupPlugins} from "@/plugins";
import RIcon from "@/components/global/RIcon.vue";
import RButton from "@/components/global/RButton.vue";
import RPaginator from "@/components/global/RPaginator.vue";

// import {useCookies} from '@vueuse/integrations/useCookies';

const app = createApp(App);
const metaManager = createMetaManager();
// const cookie = useCookies();
// const locale = cookie.get('locale') || 'zh';

// 全局挂载 $api
app.config.globalProperties.$api = API
app.config.globalProperties.$const = META

const savedLocale = localStorage.getItem('locale')
if (savedLocale) {
    document.cookie = `lang=${savedLocale}; path=/`;
    i18n.global.locale.value = savedLocale as 'zh' | 'en';
}

setupPlugins(app);
app.use(router);
app.use(metaManager);
app.use(i18n);
app.use(pinia);

app.component('RIcon', RIcon);
app.component('RButton', RButton);
app.component('RPaginator', RPaginator);

app.mount("#app");
