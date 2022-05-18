import { deleteUserAuthToken, deleteUserDataFromStorage, deleteUserNonce } from "./LocalStorageManager/LocalStorageManager";
import { UserDataStorage } from "../Storages/UserDataStorage";

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
