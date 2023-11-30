import { logger } from './logger';
import { readFile } from './readFile';

export const readJson = async (filePath: string) => {
    const content = await readFile(filePath)
    try {
        return JSON.parse(content || 'null');
    } catch(e) {
        logger.error(`Couldn't parse JSON in this file: filePath. Error: ${e.message}`)
    }
}
