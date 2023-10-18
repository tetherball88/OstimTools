import { ipcMain } from 'electron';

import { eventsMap } from '~common/events/eventsMap';

Object.entries(eventsMap).forEach(([eventName, handler]) => {
    ipcMain.handle(eventName, (event, ...otherArgs) => handler(otherArgs[0]));
})
