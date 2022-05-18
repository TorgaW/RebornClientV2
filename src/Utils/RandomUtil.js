export function getRandomString(length) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min) ?? 0;
    max = Math.floor(max) ?? 10;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
