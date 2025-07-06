import {Axios} from "@/api/http";
import {API, Axios} from "@/api";
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