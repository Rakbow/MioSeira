import {definePreset} from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import {App} from "vue";
import PrimeVue from "primevue/config";

const MyPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            dark: {
                semantic: {
                    surface: {
                        0: '#000000'
                    }
                }
            }
        }
    },
    components: {
        datatable: {
            root: {
                header: {
                    background: 'var(--r-bg-neutral-950)',
                    color: 'white'
                }
            },
            css: () => `
                .p-datatable {
                    border: none;
                }
            `
        },
        popover: {
            root: {
                background: 'var(--r-bg-neutral-950)',
                color: 'white'
            },
            css: () => `
                .p-popover {
                    border: none;
                }
            `
        },
        card : {
            root: {
                background: 'var(--r-bg-neutral-950)'
            }
        },
        fieldset : {
            root: {
                color: 'white'
            },
            css: () => `
                .p-fieldset {
                    border: none;
                }
            `
        },
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
        },
        dialog: {
            root: {
                background: 'var(--r-bg-neutral-950)',
                color: 'white'
            },
            css: ({dt}: any) => `
                .p-dialog {
                    border: none;
                }
                .p-dialog-mask {
                    //background: black !important;
                }
            `
        },
        tooltip: {
            root: {
            },
            css: ({dt}: any) => `
                .p-tooltip-text {
                    font-size: .9rem;
                }
            `
        },
    }

});

export default {
    install(app: App) {
        app.use(PrimeVue, {
            ripple: true,
            theme: {
                preset: MyPreset,
                options: {
                    darkModeSelector: '.p-dark',
                    cssLayer: {
                        name: 'primevue',
                        order: 'tailwind-base, primevue, tailwind-utilities'
                    }
                }
            }
        });
    }
}