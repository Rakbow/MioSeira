import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        info: null as User | null,
        ticket: '' as string
    }),
    actions: {
        login(u: User) {
            this.info = u
            this.ticket = u.ticket
        },
        logout() {
            this.info = null
            this.ticket = ''
            localStorage.removeItem('user')
        }
    },
    persist: true
});