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

    static ENTITY = [
        {id: 1, name: 'album'},
        {id: 2, name: 'book'},
        {id: 3, name: 'disc'},
        {id: 4, name: 'game'},
        {id: 5, name: 'music'},
        {id: 6, name: 'goods'},
        {id: 7, name: 'figure'},
        {id: 8, name: 'person'},
    ]

}