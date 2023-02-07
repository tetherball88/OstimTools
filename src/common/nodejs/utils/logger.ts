import { ipcMain } from "electron";

class Logger {
    log(message: string, level: 'log' | 'error' | 'warn' = 'log') {
        console[level](message);
        ipcMain.emit('console-data', level, message);
    }

    error(message: string) {
        this.log(message, 'error');
    }

    warn(message: string) {
        this.log(message, 'warn');
    }
}

export const logger = new Logger