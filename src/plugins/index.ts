import type {App} from 'vue'
import PrimevueComponents from './primevue/components'
import PrimevueTheme from "./primevue/theme";

export const setupPlugins = (app: App) => {
    app.use(PrimevueComponents);
    app.use(PrimevueTheme);
}