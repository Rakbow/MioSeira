import {API, Axios} from "@/api";
import {useUserStore} from "@/store/modules/user";
import {bs} from "@/service/baseService";

const login = async (param: any) => {
    const userStore = useUserStore();
    const res = await Axios.post(API.LOGIN, param);
    if (res.success()) {
        userStore.login(res.data.user, res.data.ticket);
        location.reload();
    } else {
        bs!.toast.error(res.message);
    }
}

const logout = async () => {
    const userStore = useUserStore();
    const res = await Axios.post(API.LOGOUT);
    if(res.success()) userStore.logout();
}

export { login, logout };