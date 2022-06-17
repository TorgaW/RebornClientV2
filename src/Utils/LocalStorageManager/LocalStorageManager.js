const webName = "reborn-client";
const optionsPostfix = "-v2-options";
const tokenName = "reborn-client-v2-token";
const userDataPostfix = "-v2-data";
const userNoncePostfix = "-v2-user-nonce";

export function createLocalOptionsIfNotExist() {
    let ops = getLocalOptions() ?? {};
    let opsk = Object.keys(ops);
    if (opsk.length < 5)
    {
        let opt = {
            'autoConnectToMetaMask': ops?.autoConnectToMetaMask ?? true,
            'showGamePrice': ops?.showGamePrice ?? true,
            'showBCHPrice': ops?.showBCHPrice ?? true,
            'systemMessagesPlace': ops?.systemMessagesPlace ?? "up-right",
            'soundVolume': ops?.soundVolume ?? 0.5,
        }
        // console.log('new options', opt);
        saveLocalOptions(
            JSON.stringify(opt)
        );
    }
}

export function saveLocalOptions(options) {
    localStorage.setItem(webName + optionsPostfix, JSON.stringify(options));
}

export function getLocalOptions() {
    try {
        let parsed = JSON.parse(localStorage.getItem(webName + optionsPostfix));
        if(typeof parsed === 'string')
            parsed = JSON.parse(parsed)
        return parsed;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function saveUserDataToStorage(data, token) {
    localStorage.setItem(webName + userDataPostfix, JSON.stringify(data));
    if(token)
        localStorage.setItem(tokenName, token);
}

export function deleteUserDataFromStorage() {
    localStorage.removeItem(webName + userDataPostfix);
    localStorage.removeItem(tokenName);
}

export function getUserDataFromStorage() {
    return { data: localStorage.getItem(webName + userDataPostfix), token: localStorage.getItem(tokenName) };
}

export function getUserAuthToken() {
    let item = localStorage.getItem(tokenName);
    return item;
}

export function deleteUserAuthToken() {
    localStorage.removeItem(tokenName);
}

export function saveUserNonce(nonce) {
    localStorage.setItem(webName + userNoncePostfix, nonce);
}

export function deleteUserNonce() {
    localStorage.removeItem(webName + userNoncePostfix);
}

export function getUserNonce() {
    return localStorage.getItem(webName + userNoncePostfix);
}
