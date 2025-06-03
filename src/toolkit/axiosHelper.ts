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

    // @ts-ignore
    static async post(url: string, data: any = null) {
        try {
            let res = await axios({
                method: 'post',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
            });
            if (res.data.state === this.SUCCESS) {
                return res.data;
            }
            // else {
            //     if(res.data.message && res.data.message.trim() !== '') {
            //         console.log(res.data.message);
            //     }
            // }
            return res.data;
        } catch (error) {
            // console.log(error);
        }
    }

    //axios封装get请求
    static async get(url: string) {
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
        }).catch(() => {
            // console.log(error);
        });
    }

    //axios封装delete请求
    static async delete(url: string, data: any) {
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
        }).catch(() => {
            // console.log(error);
        });
    }

    //axios封装表单提交
    static async form(url: string, data: any) {
        const formData = new FormData();

        // 遍历 data，智能填充字段
        Object.keys(data).forEach(key => {
            const value = data[key];

            if (Array.isArray(value)) {
                // 如果是数组，逐个 append（适用于 files: File[]）
                value.forEach(v => formData.append(key, v));
            } else {
                // 其他字段直接 append
                formData.append(key, value);
            }
        });
        return axios({
            method: 'post',
            url: url,
            data: formData,
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
        }).catch(() => {
            // console.log(error);
        });
    }

}