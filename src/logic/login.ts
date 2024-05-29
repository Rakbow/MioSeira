import {AxiosHelper} from "@/toolkit/axiosHelper";
import {API} from "@/config/Web_Helper_Strs";
const logout = async () => {
    // const res = await AxiosHelper.post(API.LOGOUT, null);
    // if(res.state === 1) {
    //     localStorage.clear();
    //     location.reload();
    // }
    localStorage.clear();
    location.reload();
}

export { logout };