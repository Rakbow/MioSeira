import { App, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

export default {
    install(app: App) {
        app.directive('permission', {
            mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
                const user = useUserStore();
                const perm = binding.value;

                if (perm === '') return;

                if (!user.info) {
                    el.remove()
                }else {
                    if (user.roles && user.roles.includes('admin')) {
                        return
                    }
                    if (user.perms && user.perms.includes(perm)) {
                        return
                    }
                    el.remove()
                }
            }
        })
    }
}