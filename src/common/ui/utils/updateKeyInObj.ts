export const updateKeyInObj = <T extends Record<string, any>>(obj: T, oldKey: string, newKey: string) => {
    const newObj: any = {};

    for (const key in obj) {
        if (key === oldKey) {
            newObj[newKey] = obj[key]
            continue;
        }

        newObj[key] = obj[key]
    }

    return newObj as T;
}