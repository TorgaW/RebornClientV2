/* name for the token */
const tokenName = "reborn-client-v2-token";

/* address of the website */
export const serverAddress = "https://reborn.cash";

/* address of testing JSON */
// const serverAddress_pe = "https://jsonplaceholder.typicode.com";

// use this function as a template
// export function placeholder_EP() {
//     return serverAddress_pe + "/posts";
// }

export function safeAuthorize_header() {
    let item = localStorage.getItem(tokenName);

    // need to parse JWT

    return { headers: { Authorization: "Bearer " + item } };
}

export function authorize_header() {
    let item = localStorage.getItem(tokenName);
    return { headers: { Authorization: "Bearer " + item } };
}

export function createAuthorizeHeader(token) {
    return { headers: { Authorization: "Bearer " + token } };
}

export function signIn_EP() {
    return serverAddress + "/api/auth/signin";
}

export function signUp_EP() {
    return serverAddress + "/api/auth/signup";
}

export function verify2FA_EP(){
    return serverAddress + "/api/userActions/verifyCode";
}

export function getQr_EP(){
    return serverAddress + "/api/userActions/getCode";
}

export function changePassword_EP(){
    return serverAddress + "/api/auth/resetPassword";
}

export function addBalance_EP() {
    return serverAddress + "/api/userActions/addBalance";
}

export function getBalance_EP() {
    return serverAddress + "/api/userActions/getBalance";
}

export function signedMessageMetaMask_EP(){
    return serverAddress + '/api/userActions/connectMetamask';
}

export function getTokenExpiresTime_EP() {
    return serverAddress + "/api/userActions/getExpiresAt";
}

export function getInventory_EP() {
    return serverAddress + "/api/userActions/getInventory";
}

export function getNewsQuantity_EP(){
    return serverAddress + "/api/userActions/getNewsQuantity";
}

export function getComicsQuantity_EP(){
    return serverAddress + "/api/userActions/getComicsQuantity";
}

export function getNewsByIndex_EP(){
    return serverAddress + "/api/userActions/getNewsByIndexes";
}

export function getComicsByIndex_EP(){
    return serverAddress + "/api/userActions/getComicsByIndexes";
}

export function getSpecificNews_EP(){
    return serverAddress + "/api/userActions/getSpecificNews";
}

export function getSpecificComics_EP(){
    return serverAddress + "/api/userActions/getSpecificComics";
}

export function getNFTsByIndexes_EP() {
    return serverAddress + "/api/userActions/getNFTByIndexes";
}

export function getAllNFTs_EP(){
    return serverAddress + "/api/userActions/getNFTS";
}

export function getBoxesByHeroId_EP(){
    return serverAddress + "/api/userActions/getBoxesByHeroId";
}

export function getHeroById_EP(){
    return serverAddress + "/api/userActions/loadHeroByIndex";
}

export function getBoxById_EP(){
    return serverAddress + "/api/userActions/getBox";
}

export function openBox_EP() {
    return serverAddress + "/api/userActions/openBox";
}

export function burnBox_EP() {
    return serverAddress + "/api/userActions/burnBox";
}

// Marketplace

export function marketplace_Load() {
    return serverAddress + "/api/marketplace/loadLots";
}