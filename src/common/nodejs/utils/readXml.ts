import { Parser } from 'xml2js';
import { readFile } from './readFile';

const xmlParser = new Parser();
const parseString = (content: string): Promise<Record<string, any>> => new Promise((resolve, reject) => {
    xmlParser.parseString(content, (error, result) => {
        if(error) {
            reject(error);
        } else {
            resolve(result);
        }
    })
})
export const readXml = async (filePath: string) => {
    return parseString(await readFile(filePath));
}