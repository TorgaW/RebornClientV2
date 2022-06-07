export function isStringEmptyOrSpaces(str) {
    if (typeof str === "string") return str == null || str?.trim() === "";
    else if (typeof str === "object") {
        if (Array.isArray(str)) {
            for (const i of str) {
                if (i == null || i?.trim() === "") return true;
            }
        }
    }
    return false;
}
