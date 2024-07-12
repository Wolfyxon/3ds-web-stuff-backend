export function pathAtObject(obj: Object, path: string, separator: string = ".") {
    const split = path.split(separator);
    let current = obj;

    split.forEach(sub => {
        current = current[sub];
        if(current === undefined) return null;
    });

    return current;
}