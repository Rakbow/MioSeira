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

}