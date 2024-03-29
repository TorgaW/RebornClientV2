import { Buffer } from "buffer";

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

export function insertInString(ins, str, index) {
    if (!str || !ins || typeof index !== "number") return;
    if (typeof str === "string" && typeof ins === "string") {
        if (index > str.length || index < 0) return;
        let t1 = str.slice(0, index);
        let t2 = str.slice(index);
        return t1 + ins + t2;
    }
    if (typeof ins === "object" && Array.isArray(ins) && typeof str === "string") {
        if (index > str.length || index < 0) return;
        let t1 = str.slice(0, index);
        let t2 = str.slice(index);
        let s = "";
        for (const i of ins) s += i;
        return t1 + s + t2;
    }
    if (typeof str === "object" && Array.isArray(str) && typeof ins === "string") {
        let t = [];
        for (const i of str) {
            if (index > i.length || index < 0) return;
            let t1 = i.slice(0, index);
            let t2 = i.slice(index);
            t.push(t1 + ins + t2);
        }
        return t;
    }
}

export function compactString(str, length) {
    if(typeof str === 'string' && typeof length === 'number') {
        return str.slice(0,length)+(str.length > length ? '...':'');
    }
    return '';
}

export function strToBase(str) {
    return Buffer.from(str).toString('base64');
};

export function baseToStr(str) {
    return Buffer.from(str, 'base64').toString('utf-8');
};