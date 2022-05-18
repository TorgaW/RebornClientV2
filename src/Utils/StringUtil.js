export function isStringEmptyOrSpaces(str) {
    return str == null || str?.trim() === "";
}