import {defineStore} from 'pinia';
import {useLocalStorage, useStorage} from "@vueuse/core";
import {RelatedEntry} from "@/config/Web_Const";

interface ItemCreateRelatedDraft {
    relatedEntry: RelatedEntry | null
}

export const useDraftStore = defineStore('draft', {
    state: (): ItemCreateRelatedDraft => ({
        relatedEntry: useLocalStorage('relatedEntry', null).value
    }),
    actions: {
        save(relatedEntry: RelatedEntry) {
            this.relatedEntry = relatedEntry;
            useStorage('relatedEntry', JSON.stringify(relatedEntry)).value = JSON.stringify(relatedEntry);
        }
    },
});