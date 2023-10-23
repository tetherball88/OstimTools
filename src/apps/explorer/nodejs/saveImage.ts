import { app } from 'electron';
import { writeFile } from '~common/nodejs/utils';

export const saveImage = (modId: string, base64: string) => {
    const buffer = Buffer.from(base64, 'base64');
    const picturesFolder = app.getPath('pictures');
    return writeFile(`${picturesFolder}\\OstimTools\\${modId}_${Date.now()}.jpg`, buffer);
}