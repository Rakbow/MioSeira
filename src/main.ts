import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "@/assets/font.css";
import "@/assets/global.css";
import "@/assets/search.css";
import "@/assets/topbar.css";

import App from "./App.vue";
import {createMetaManager} from "vue-meta";
import {createApp} from "vue";
import router from "./router.js";
import {createPinia} from 'pinia';
import 'material-symbols';

import i18n from '@/config/i18n';
import {registerPrimeVue} from '@/config/primeVueConfig';

import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'tingle.js/src/tingle.css';

import {EnText} from '@/config/Web_Control_Strs_EN'; // 导入英文语言文件
import {CnText} from '@/config/Web_Control_Strs_CN'; // 导入英文语言文件
import {useCookies} from '@vueuse/integrations/useCookies';
import {API} from "@/config/Web_Helper_Strs";

const app = createApp(App);
const metaManager = createMetaManager();
const pinia = createPinia();
const cookie = useCookies();
const locale = cookie.get('locale') || 'zh';

registerPrimeVue(app);
app.use(router);
app.use(MdEditor);
app.use(metaManager);
app.use(i18n);
app.use(pinia);

app.config.globalProperties.$api = API;

if (locale === 'en') {
    app.config.globalProperties.$const = EnText;
} else if (locale === 'zh') {
    app.config.globalProperties.$const = CnText;
}

app.mount("#app");
