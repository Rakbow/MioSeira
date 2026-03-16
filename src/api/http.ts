import axios, { AxiosError } from 'axios';
import {bs} from '@/service/baseService';
import {useUserStore} from "@/store/modules/user";
axios.defaults.withCredentials = true;

class ApiResult {
    state: number = 1;
    data: any = null;
    total: number = 0;
    message: string = '';
    status: number = 200;

    success(): boolean {
        return this.state === Axios.SUCCESS;
    }
}

//axios拦截器
axios.interceptors.response.use(function (res) {
    if (res.data.state === Axios.SUCCESS) {
        if (res.data.message !== '') {
            bs!.toast.success(res.data.message);
        }
    }
    if (res.data.state === Axios.ERROR) {
        if (res.data.message !== '') {
            bs!.toast.error(res.data.message);
        }
    }
    if (res.status === 401) {
        useUserStore().logout()
    }

    return res;
});

//axios封装post请求
export class Axios {

    static SUCCESS = 1;
    static ERROR = 0;

    // @ts-ignore
    static async post(url: string, data: any = null) : Promise<ApiResult> {
        let res = await axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true,
            validateStatus: (status) => true
        });
        const result = new ApiResult();
        Object.assign(result, res.data);
        result.status = res.status
        return result;
    }

    // @ts-ignore
    static async get(url: string) : Promise<ApiResult> {
        try {
            let res = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });
            const result = new ApiResult();
            Object.assign(result, res.data);
            result.status = res.status
            return result;
        } catch (error) {
            // console.log(error);
        }
    }

    // @ts-ignore
    static async delete(url: string, data: any) : Promise<ApiResult> {
        try{
            let res = await axios({
                method: 'delete',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });
            const result = new ApiResult();
            Object.assign(result, res.data);
            result.status = res.status
            return result;
        } catch (error) {
            // console.log(error);
        }
    }

    // @ts-ignore
    static async form(url: string, data: FormData) : Promise<ApiResult> {
        try{
            let res = await axios({
                method: 'post',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });
            const result = new ApiResult();
            Object.assign(result, res.data);
            result.status = res.status
            return result;
        } catch (error) {
            // console.log(error);
        }
    }

}