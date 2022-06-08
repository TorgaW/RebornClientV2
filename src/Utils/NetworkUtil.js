import { deleteUserAuthToken, deleteUserDataFromStorage, deleteUserNonce } from "./LocalStorageManager/LocalStorageManager";
import { UserDataStorage } from "../Storages/UserDataStorage";
import axios from "axios";
import { safeAuthorize_header } from "./EndpointsUtil";

export function getDataFromResponse(response) {
    return response?.data?.data;
}

export function getMessageFromResponse(response) {
    return response?.data?.message;
}

export function getStatusFromResponse(response) {
    return response?.data?.status;
}

export function catch401(error) {
    return typeof error === "object" && error.message === "Request failed with status code 401";
}

export function logout() {
    deleteUserDataFromStorage();
    deleteUserNonce();
    deleteUserAuthToken();
    UserDataStorage.update((s)=>{
        s.isLoggedIn = false;
        s.userData = null;
    });
}

export async function makePost(address, body, auth){
    let data;
    let error;
    let status;
    try {
        let t;
        if(auth)
            t = await axios.post(address, body, safeAuthorize_header());
        else
            t = await axios.post(address, body);
        data = getDataFromResponse(t);
        status = getStatusFromResponse(t);
        return [data, status, error];
    } catch (er) {
        return [data, status, er.message];
    }
}
