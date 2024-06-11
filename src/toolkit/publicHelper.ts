import {Attribute, EntityInfo, META} from "@/config/Web_Const";
import {RouteLocationNormalizedLoaded} from "vue-router";

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
        {id: 2, name: 'person'},
        {id: 99, name: 'product'},
        {id: 100, name: 'franchise'}
    ]

    static handleAttributes = (obj: Record<string, any>) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                if(Array.isArray(value)) {
                    if (value.every(item => this.isAttribute(item))) {
                        obj[key] = value.map(i => i.value);
                    }
                }else {
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

    static getEntityInfo = (route: RouteLocationNormalizedLoaded) => {
        let typeName = route.path.split('/')[2];
        let info = new EntityInfo();
        info.type = this.getEntityType(typeName);
        info.id = parseInt(route.params.id.toString());
        return info;
    }

}