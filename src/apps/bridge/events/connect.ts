import { ipcMain } from 'electron';
import { eventsMap } from '~bridge/events/eventsMap';

(Object.entries(eventsMap) as  [string, (...args: any) => Promise<any>][]).forEach(([eventName, handler]) => {
    ipcMain.handle(eventName, (event, ...otherArgs) => handler(...otherArgs))
})
