import { defineStore } from 'pinia';
import { useLocalStorage, useStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: JSON.parse(useLocalStorage('user', 'null').value) as User | null,
        ticket: useLocalStorage('ticket', 'null').value
    }),
    getters: {
        isAuthenticated(state: UserState): boolean {
            return state.user !== null;
        }
    },
    actions: {
        login(user: User, ticket: string) {
            // useLocalStorage('user', user);
            // useLocalStorage('ticket', ticket);
            // this.user = user;
            // this.ticket = ticket;
            this.user = user;
            this.ticket = ticket;
            useStorage('user', JSON.stringify(user)).value = JSON.stringify(user);
            useStorage('ticket', ticket).value = ticket;
        },
        logout() {
            // useLocalStorage('user', null);
            // useLocalStorage('ticket', null);
            // this.user = null;
            // this.ticket = null;
            this.user = null;
            this.ticket = null;
            useStorage('user', 'null').value = 'null';
            useStorage('ticket', 'null').value = 'null';
        },
    },
});