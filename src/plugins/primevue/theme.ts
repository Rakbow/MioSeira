import {definePreset} from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import {App} from "vue";
import PrimeVue from "primevue/config";

const MyPreset = definePreset(Aura, {
});

export default {
    install(app: App) {
        app.use(PrimeVue, {
            ripple: true,
            theme: {preset: MyPreset}
        });
    }
}