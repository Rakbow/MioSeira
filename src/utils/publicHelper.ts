import {Attribute} from "@/config/Web_Const";

export class PublicHelper {

    static copyToClip = (content: any) => {
        const aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }

    static deepCopy = (data: any) => {
        return JSON.parse(JSON.stringify(data))
    }

    static value2Label = (value: any, xSet: any[]) => {
        for (let item of xSet) {
            if (value === item.value) {
                return item.label;
            }
        }
    };

    static getEntityType = (name: string) => {
        for (let item of this.ENTITY) {
            if (name === item.name) {
                return item.id;
            }
        }
        return 0;
    };

    static getEntityPath = (id: number): string => {
        for (let item of this.ENTITY) {
            if (id === item.id) {
                return item.name;
            }
        }
        return 'item';
    };

    static ENTITY = [
        {id: 0, name: 'item'},
        {id: 1, name: 'entry'},
        {id: 4, name: 'ep'},
        {id: 98, name: 'file'},
        {id: 100, name: 'franchise'}
    ]

    static handleAttributes = (obj: Record<string, any>) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                if (Array.isArray(value)) {
                    if (value.every(item => this.isAttribute(item))) {
                        obj[key] = value.map(i => i.value);
                    }
                } else {
                    if (PublicHelper.isAttribute(value)) {
                        obj[key] = value['value'];
                    }
                }
            }
        }
    }

    static isAttribute = (item: any): item is Attribute => {
        return item && typeof item === 'object' && 'label' in item && 'value' in item;
    }


    static secondsToTimeFormat = (seconds: number): string => {
        const pad = (num: number): string => num.toString().padStart(2, '0');

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }

    static fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string; // 读取结果是 Base64 字符串
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file); // 将文件读取为 Base64 数据URL
        });
    }

    static isValidDateFormat = (dateString: string): boolean => {
        // 可以根据实际需求调整正则
        const datePattern = /^[A-Za-z]+ \d{1,2}, \d{4}$/;
        return datePattern.test(dateString);
    }
    // 将日期字符串转为 "yyyy/MM/dd" 格式
    static convertToDateFormat = (dateString: string): string => {
        const datePattern = /^[A-Za-z]+ \d{1,2}, \d{4}$/;
        if (!datePattern.test(dateString)) return dateString;
        const date = new Date(dateString); // 将字符串转换为 Date 对象
        const year = date.getFullYear(); // 获取年份
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份
        const day = date.getDate().toString().padStart(2, '0'); // 获取日期
        return `${year}/${month}/${day}`; // 返回 "yyyy/MM/dd" 格式
    }

    static getHostname = (url: string): string => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname; // 提取主域名部分
        } catch (error) {
            console.error('Invalid URL:', url);
            return url; // 如果 URL 无效，直接返回原始值
        }
    };

    static splitAndTrim = (input: string, separator: string = ","): string[] => {
        if (input === undefined || input === null) return [];
        return input
            .trim() // 去掉字符串首尾的空格
            .replace(/,+/g, ',') // 将连续多个逗号替换为一个逗号
            .replace(/(^,|,$)/g, '') // 去掉字符串开头和结尾的多余逗号
            .split(separator) // 按逗号分割
            .map(item => item.trim()) // 去掉每个子字符串的首尾空格
            .filter(item => item !== ""); // 移除空字符串
    }

    static formatSize = (bytes: number, decimals: number = 2): string => {
        if (bytes < 0) throw new Error("Bytes cannot be negative");
        const mb = bytes / (1024 * 1024);
        return `${parseFloat(mb.toFixed(decimals))} MB`;
    }

    static getDuration = (duration: string): number => {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    // 检查对象、数组、字符串等是否为空
    static isEmpty = (value: any): boolean => {
        if (value == null) {
            return true; // null 或 undefined 返回 true
        }

        if (typeof value === 'boolean') {
            return false; // 布尔值不为空
        }

        if (typeof value === 'number') {
            return value === 0; // 数字为0时返回 true
        }

        if (typeof value === 'string') {
            return value.trim().length === 0; // 空字符串或只含空格时返回 true
        }

        if (Array.isArray(value)) {
            return value.length === 0; // 数组为空时返回 true
        }

        if (typeof value === 'object') {
            return Object.keys(value).length === 0; // 空对象返回 true
        }

        return false; // 其他类型都返回 false
    }

    static isUndefined = (value: any): boolean => {
        return typeof value === 'undefined';
    }

    static isNotEmpty = (value: any): boolean => {
        return !this.isEmpty(value);
    }

    static isNotUndefined = (value: any): boolean => {
        return !this.isUndefined(value);
    }

    static getGenderIcon = (value: number): string => {
        return value === 1 ? 'pi pi-mars' : value === 2 ? 'pi pi-venus' : ''
    }

}