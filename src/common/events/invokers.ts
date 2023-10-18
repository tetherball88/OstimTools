import { eventsMap } from "~common/events/eventsMap";
import { SELECT_DIRECTORY, SELECT_FILE } from "./events";

export const invokeSelectFile: typeof eventsMap[typeof SELECT_FILE] = () => {
    return window.api.invoke(SELECT_FILE);
}

export const invokeSelectDirectory: typeof eventsMap[typeof SELECT_DIRECTORY] = () => {
    return window.api.invoke(SELECT_DIRECTORY);
}