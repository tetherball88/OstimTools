export const asyncReduce = async <T, I = any>(array: I[], callback: (acc: T, item: I) => Promise<T>, initialValue: T): Promise<T> => {
    let accumulator = initialValue;
    for (const item of array) {
        accumulator = await callback(accumulator, item);
    }
    return accumulator;
}