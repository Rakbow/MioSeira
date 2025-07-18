import type { Router } from 'vue-router'

export const setupGuards = (router: Router) => {
    router.beforeEach((to, from, next) => {
        const isAuthenticated = !!localStorage.getItem('ticket')

        console.log('跳转了')

        if (to.meta.requiresAuth && !isAuthenticated) {
            next({ name: 'Login' })
        } else {
            next()
        }
    })

    router.afterEach((to) => {
        document.title = (to.meta?.title as string) || '默认标题'
    })
}