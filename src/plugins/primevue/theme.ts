import {definePreset} from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import {App} from "vue";
import PrimeVue from "primevue/config";

const MyPreset = definePreset(Aura, {
    components: {
        panel: {
            root: {
                background: '#2F364F',
                border: {
                    radius: '1rem',
                    extend: {
                        width: 0
                    }
                },
                header: {
                    background: '#1B273D',
                    color: '#BEB993',
                    border: {
                        radius: '1rem 1rem 0 0'
                    }
                },
                content: {
                    extend: {
                        border: {
                            radius: '0 0 1rem 1rem'
                        }
                    }
                },
            },
            css: ({dt}: any) => `
                .p-panel {
                    border-width: ${dt('panel.border.width')};
                }
                .p-panel-content {
                    border-radius: ${dt('panel.content.border.radius')};
                }
            `
        },
        tag: {
            root: {
                font: {
                    size: '1rem',
                    weight: 500
                }
            }
        },
        select: {
            root: {
                option: {
                    extend: {
                        label: {
                            font: {
                                size: '1rem'
                            }
                        }
                    }
                }
            },
            css: ({dt}: any) => `
                .p-select-option-label {
                    font-size: ${dt('select.option.label.font.size')};
                }
            `
        }
    }

});

export default {
    install(app: App) {
        app.use(PrimeVue, {
            ripple: true,
            theme: {
                preset: MyPreset,
                option: {
                    darkModeSelector: true
                }
            }
        });
    }
}