import type { Router } from 'vue-router'
import {useUserStore} from "@/store/modules/user";

export const setupGuards = (router: Router) => {
    router.beforeEach((to, from, next) => {
        const user = useUserStore();

        console.log('跳转了')

        if (to.meta.perm) {
            if(user.roles.includes('admin')){
                next()
                return
            }
            if(!user.perms || !user.perms.includes(to.meta.perm.toString())){
                next("/403")
                return
            }
        } else {
            next()
            return
        }
    })

    router.afterEach((to) => {
        document.title = (to.meta?.title as string) || '默认标题'
    })
}