import { Store } from "pullstate";

export const AuthHashStorage = new Store({
    hash: '',
    expiresTime: 0,
    generateHash: ()=>{},
    // getHash: ()=>{},
});