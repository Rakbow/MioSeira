import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        info: null as User | null,
        ticket: '' as string,
        roles: [] as string[],
        perms: [] as string[]
    }),
    actions: {
        login(u: User) {
            this.info = u
            this.ticket = u.ticket
            this.roles = u.roles
            this.perms = u.permissions
        },
        logout() {
            this.info = null
            this.ticket = ''
            this.roles = []
            this.perms = []
            localStorage.removeItem('user')
        }
    },
    persist: true
});