import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', {
    state() {
        return {
            user: JSON.parse(useLocalStorage('user', null).value),
            ticket: useLocalStorage('ticket', null).value,
        };
    },
    getters: {
        isAuthenticated() {
            return this.user !== null;
        }
    },
    actions: {
        login(user, ticket) {
            useLocalStorage('user', user);
            useLocalStorage('ticket', ticket);
        },
        logout() {
            useLocalStorage('user', null);
            useLocalStorage('ticket', null);
        },
    },
});