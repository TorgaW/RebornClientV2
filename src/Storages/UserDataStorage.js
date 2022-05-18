import { Store } from "pullstate";
import { getUserDataFromStorage } from "../Utils/LocalStorageManager/LocalStorageManager";

export const UserDataStorage = new Store({
    isLoggedIn: false,
    userData: {},
    getLocalUserData: ()=>{
        let raw = getUserDataFromStorage().data;
        return raw ? JSON.parse(raw):null;
    },
});