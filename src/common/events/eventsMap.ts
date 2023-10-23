import { dialog, OpenDialogOptions } from "electron";
import { CREATE_FILE_OR_FOLDER, DELETE_FILE_OR_FOLDER, RENAME_FILE_OR_FOLDER, SELECT_DIRECTORY, SELECT_FILE } from "~common/events/events";
import { createFileOrFolder } from "~common/nodejs/utils/createFileOrFolder";
import { removeFileOrFolder } from "~common/nodejs/utils/removeFileOrFolder";
import { renameFileOrFolder } from "~common/nodejs/utils/renameFileOrFolder";

export const eventsMap = {
    [SELECT_FILE]: (options: OpenDialogOptions) => {
        return dialog.showOpenDialog({ ...options, properties: ['openFile'] });
    },
    [SELECT_DIRECTORY]: (options: OpenDialogOptions) => {
        return dialog.showOpenDialog({ ...options, properties: ['openDirectory'] });
    },
    [CREATE_FILE_OR_FOLDER]: (path: string) => createFileOrFolder(path),
    [DELETE_FILE_OR_FOLDER]: (path: string) => removeFileOrFolder(path),
    [RENAME_FILE_OR_FOLDER]: (oldPath: string, newPath: string) => {
        return renameFileOrFolder(oldPath, newPath)
    }
}