import { SELECT_DIRECTORY, SELECT_FILE } from "./events";
import { Handler, handleSelectDirectory, handleSelectFile } from "./handlers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExtractTail<T extends any[]> = T extends [infer _, ...infer Tail] ? Tail : never

export type HandlerToInvokeType<H extends Handler<any, any>, Args extends any[] = ExtractTail<Parameters<H>>, R = ReturnType<H>> = (...args: Args) => R

export const invokeSelectFile: HandlerToInvokeType<typeof handleSelectFile> = () => {
    return window.api.invoke(SELECT_FILE);
}

export const invokeSelectDirectory: HandlerToInvokeType<typeof handleSelectDirectory> = () => {
    return window.api.invoke(SELECT_DIRECTORY);
}