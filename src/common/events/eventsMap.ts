import { dialog, OpenDialogOptions } from "electron";
import { SELECT_DIRECTORY, SELECT_FILE } from "~common/events/events";

export const eventsMap = {
    [SELECT_FILE]: (options: OpenDialogOptions) => {
        return dialog.showOpenDialog({ ...options, properties: ['openFile'] });
    },
    [SELECT_DIRECTORY]: (options: OpenDialogOptions) => {
        return dialog.showOpenDialog({ ...options, properties: ['openDirectory'] });
    }
}