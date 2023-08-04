import {AxiosHelper} from "@/utils/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
const logout = async () => {
    const res = await AxiosHelper.basePost(API.LOGOUT, null);
    if(res.state === 1) {
        // store.logout();
        localStorage.clear();
        location.reload();
    }
}

export { logout };