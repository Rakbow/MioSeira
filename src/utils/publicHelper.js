export class PublicHelper {
    static copyToClip(content) {
        const aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }

    static deepCopy(object) {
        return JSON.parse(JSON.stringify(object))
    }

}