import axios from 'axios';
axios.defaults.withCredentials = true;
// import {useToast} from "primevue/usetoast";
//
// const toast = useToast();

//axios封装post请求
export class AxiosHelper {
    static post(toast, url, data) {
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        }).then(res => {
            if(res.data.state === 1) {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'success', summary: 'Success', detail: res.data.message, life: 3000});
                }
            }else {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'error', summary: 'Error', detail: res.data.message, life: 3000});
                }
            }
            return res.data;
        }).catch(error => {
            console.log(error);
        });
    }

    //axios封装get请求
    static get(url) {
        return axios({
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        }).then(res => {
            if(res.data.state === 1) {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'success', summary: 'Success', detail: res.data.message, life: 3000});
                }
            }else {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'error', summary: 'Error', detail: res.data.message, life: 3000});
                }
            }
            return res.data;
        }).catch(error => {
            console.log(error);
        });
    }

    //axios封装delete请求
    static delete(url, data) {
        return axios({
            method: 'delete',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        }).then(res => {
            if(res.data.state === 1) {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'success', summary: 'Success', detail: res.data.message, life: 3000});
                }
            }else {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'error', summary: 'Error', detail: res.data.message, life: 3000});
                }
            }
            return res.data;
        }).catch(error => {
            console.log(error);
        });
    }

    //axios封装表单提交
    static form(url, data) {
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest'
            },
        }).then(res => {
            if(res.data.state === 1) {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'success', summary: 'Success', detail: res.data.message, life: 3000});
                }
            }else {
                if(res.data.message && res.data.message.trim() !== '') {
                    toast.add({severity: 'error', summary: 'Error', detail: res.data.message, life: 3000});
                }
            }
            return res.data;
        }).catch(error => {
            console.log(error);
        });
    }

    static basePost(url, data) {
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        }).then(res => {
            if(res.data.state === 1) {
                return res.data;
            }else {
                if(res.data.message && res.data.message.trim() !== '') {
                    console.log(res.data.message);
                }
            }
            return res.data;
        }).catch(error => {
            console.log(error);
        });
    }

}