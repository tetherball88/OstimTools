import { app } from 'electron';
import { isDev } from './isDev';

export const getAppFolderPath = () => {
    return isDev() ? app.getAppPath() : app.getPath('userData');
}