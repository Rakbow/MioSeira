import { createPinia } from 'pinia'
import piniaPersistedState from "pinia-plugin-persistedstate";

const pinia = createPinia()

pinia.use(piniaPersistedState); // 使用持久化插件

export default pinia