import { IpcRenderer } from "electron";

declare global {
    interface Window {
        api: {
            invoke: IpcRenderer['invoke']
            on: IpcRenderer['on'],
        }
    }
}