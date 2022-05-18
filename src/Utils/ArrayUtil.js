export function isInArray(element, array) {
    try {
        for (const i of array) {
            if(element === i)
                return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}