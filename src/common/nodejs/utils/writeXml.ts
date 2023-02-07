import { Builder } from 'xml2js';
import { writeFile } from './writeFile';

const xmlBuilder = new Builder({
    attrkey: '$',
    renderOpts: {
        pretty: true,
        indent: '    ',
    },
    headless: true,
});

export const writeXml = (file: string, content: any) => {
    return writeFile(file, xmlBuilder.buildObject(content));
}