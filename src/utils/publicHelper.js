export class PublicHelper {
    static copyToClip = (content) => {
        const aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }

    static deepCopy = (object) => {
        return JSON.parse(JSON.stringify(object))
    }

    static value2Label = (value, xSet) => {
        for (let item of xSet) {
            if (value === item.value) {
                return item.label;
            }
        }
    };

    static getEntityType = (name) => {
        for (let item of this.ENTITY) {
            if (name === item.name) {
                return item.id;
            }
        }
        return 0;
    };

    static getEntityPath = (id) => {
        for (let item of this.ENTITY) {
            if (id === item.id) {
                return item.name;
            }
        }
        return item;
    };

    static ENTITY = [
        {id: 0, name: 'item'},
        {id: 1, name: 'entry'},
        {id: 2, name: 'person'},
        {id: 99, name: 'product'},
        {id: 100, name: 'franchise'}
    ]

}