import { ipcMain } from 'electron';

import { handleSelectFile, handleSelectDirectory } from './handlers';
import { SELECT_FILE, SELECT_DIRECTORY } from './events';

ipcMain.handle(SELECT_FILE, handleSelectFile)
ipcMain.handle(SELECT_DIRECTORY, handleSelectDirectory)