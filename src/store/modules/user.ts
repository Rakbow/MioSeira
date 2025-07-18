import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        info: null as User | null,
        ticket: '' as string
    }),
    actions: {
        login(u: User, t: string) {
            this.info = u
            this.ticket = t
        },
        logout() {
            this.info = null
            this.ticket = ''
        }
    },
    persist: true
});