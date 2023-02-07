import { dialog, IpcMainInvokeEvent, OpenDialogOptions, OpenDialogReturnValue } from "electron";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export type Handler<T extends any[], R extends any> = (ev: IpcMainInvokeEvent, ...args: T) => Promise<R>

export const handleSelectFile: Handler<[OpenDialogOptions], OpenDialogReturnValue> = (event, options) => {
    return dialog.showOpenDialog({ ...options, properties: ['openFile'] });
}

export const handleSelectDirectory: Handler<[OpenDialogOptions], OpenDialogReturnValue> = (event, options) => {
    return dialog.showOpenDialog({ ...options, properties: ['openDirectory'] });
}
