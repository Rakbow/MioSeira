import {defineStore} from 'pinia';
import {useLocalStorage, useStorage} from "@vueuse/core";

interface EntityCreateRelatedDraft {
    relatedEntries: Array<any>
}

export const useDraftStore = defineStore('draft', {
    state: (): EntityCreateRelatedDraft => ({
        relatedEntries: useLocalStorage('relatedEntries', []).value
    }),
    actions: {
        save(relatedEntries: Array<any>) {
            this.relatedEntries = relatedEntries;
            useStorage('relatedEntries', JSON.stringify(relatedEntries)).value = JSON.stringify(relatedEntries);
        }
    },
    persist: true, // 开启持久化
});