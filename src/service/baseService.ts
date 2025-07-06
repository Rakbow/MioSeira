import {DialogServiceMethods} from "primevue/dialogservice";
import {ConfirmationServiceMethods, ToastServiceMethods} from "primevue";

let bs: BaseService | null = null;

class PrimevueToast {
    toast: ToastServiceMethods | null = null;

    constructor(toast:  ToastServiceMethods) {
        this.toast = toast;
    }

    success(message: string): void {
        this.toast!.add({ severity: 'success', summary: 'success', detail: message, life: 3000 })
    }

    error(message: string): void {
        this.toast!.add({ severity: 'error', summary: 'error', detail: message, life: 3000 })
    }

    warn(message: string): void {
        this.toast!.add({ severity: 'warn', summary: 'warn', detail: message, life: 3000 })
    }

    info(message: string): void {
        this.toast!.add({ severity: 'info', summary: 'info', detail: message, life: 3000 })
    }


}

interface BaseService {
    dialog: DialogServiceMethods;
    toast: PrimevueToast;
    confirm: ConfirmationServiceMethods;

}

export function registerPrimevueService(dialog: DialogServiceMethods, toast:  ToastServiceMethods, confirm: ConfirmationServiceMethods) {
    bs = {
        dialog: dialog,
        confirm: confirm,
        toast: new PrimevueToast(toast)
    };
}

export {bs};