import {API, Axios} from "@/api";
import {useUserStore} from "@/store/modules/user";
import {bs} from "@/service/baseService";

const login = async (param: any) => {
    const userStore = useUserStore();
    const res = await Axios.post(API.AUTH.LOGIN, param);
    if (res.success()) {
        userStore.login(res.data);
        location.reload();
    }
}

const logout = async () => {
    const userStore = useUserStore();
    const res = await Axios.post(API.AUTH.LOGOUT);
    if(res.success()) {
        userStore.logout();
        location.reload();
    }
}

export { login, logout };