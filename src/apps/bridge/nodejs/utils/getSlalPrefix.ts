import path from 'path';
import { getFileName, readFile } from '~common/nodejs/utils';


export const getSlalPrefix = async (slalJsonConfig: string) => {
    try {
        const slalJsonName = getFileName(slalJsonConfig);
        const slalTxtSourseFilePath = path.resolve(path.dirname(slalJsonConfig), `../source/${slalJsonName}.txt`);

        const match = (await readFile(slalTxtSourseFilePath)).match(/anim_id_prefix\("(\w+)"\)/mi);

        return match?.[1] || '';
    } catch {
        return '';
    }

}
