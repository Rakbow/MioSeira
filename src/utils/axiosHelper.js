import axios from 'axios';
axios.defaults.withCredentials = true;

//axios拦截器
axios.interceptors.response.use(function (res) {
    if(res.data.state === AxiosHelper.SUCCESS) {
        if(res.data.message !== '') {
            console.log(res.data.message);
        }
    }
    if(res.data.state === AxiosHelper.ERROR) {
        if(res.data.message !== '') {
            console.error(res.data.message);
        }
    }
    return res;
});

//axios封装post请求
export class AxiosHelper {

    static SUCCESS = 1;
    static ERROR = 0;

    static post(url, data=null) {
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        }).then(res => {
            if(res.data.state === this.SUCCESS) {
                return res.data;
            }
            // else {
            //     if(res.data.message && res.data.message.trim() !== '') {
            //         console.log(res.data.message);
            //     }
            // }
            return res.data;
        }).catch(error => {
            // console.log(error);
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
            if(res.data.state === this.SUCCESS) {
                return res.data;
            }
            // else {
            //     if(res.data.message && res.data.message.trim() !== '') {
            //         console.log(res.data.message);
            //     }
            // }
            return res.data;
        }).catch(error => {
            // console.log(error);
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
            if(res.data.state === this.SUCCESS) {
                return res.data;
            }
            // else {
            //     if(res.data.message && res.data.message.trim() !== '') {
            //         console.log(res.data.message);
            //     }
            // }
            return res.data;
        }).catch(error => {
            // console.log(error);
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
            if(res.data.state === this.SUCCESS) {
                return res.data;
            }
            // else {
            //     if(res.data.message && res.data.message.trim() !== '') {
            //         console.log(res.data.message);
            //     }
            // }
            return res.data;
        }).catch(error => {
            // console.log(error);
        });
    }

}