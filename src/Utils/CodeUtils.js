export function sleepFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getElementById(id) {
    if(id && typeof id === 'string') {
        return document.getElementById(id);
    }
    return null;
}