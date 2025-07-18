import { App, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

export default {
    install(app: App) {
        app.directive('permission', {
            // mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
            mounted(el: HTMLElement) {
                const userStore = useUserStore()
                if (!userStore.info) {
                    el.remove() // 没权限就从 DOM 中移除
                }
            }
        })
    }
}