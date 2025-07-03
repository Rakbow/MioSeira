//region css
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "@/assets/font.css";
import "@/assets/global.css";
import "@/assets/search.css";
import "@/assets/general.scss";
//endregion


import App from "./App.vue";//vue
import {createMetaManager} from "vue-meta";
import {createApp} from "vue";
import router from "./router.js";// vue-router
import {createPinia} from 'pinia';
import piniaPersistedState from 'pinia-plugin-persistedstate';
import 'material-symbols';
import i18n from '@/config/i18n';// vue-i18n
import {registerPrimeVue} from '@/config/primeVueConfig';

// import {useCookies} from '@vueuse/integrations/useCookies';

const app = createApp(App);
const metaManager = createMetaManager();
const pinia = createPinia();
pinia.use(piniaPersistedState); // 使用持久化插件
// const cookie = useCookies();
// const locale = cookie.get('locale') || 'zh';

registerPrimeVue(app);
app.use(router);
app.use(metaManager);
app.use(i18n);
app.use(pinia);

app.mount("#app");
