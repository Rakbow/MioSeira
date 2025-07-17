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
            useStorage('relatedEntry', JSON.stringify(relatedEntries)).value = JSON.stringify(relatedEntries);
        }
    },
});