import {META} from "@/config/Web_Const";


export class EntryHelper {
    static getRouter = (type: Number) => {
        if (type === META.ENTRY_TYPE.PRODUCT) {
            return "product";
        }else if (type === META.ENTRY_TYPE.PERSON) {
            return "person";
        }else if (type === META.ENTRY_TYPE.CHARACTER) {
            return "character";
        }else if (type === META.ENTRY_TYPE.CLASSIFICATION) {
            return "subject";
        }else if (type === META.ENTRY_TYPE.EVENT) {
            return "subject";
        }else if (type === META.ENTRY_TYPE.MATERIAL) {
            return "subject";
        }
    }
}
