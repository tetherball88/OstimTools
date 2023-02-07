import { glob, readFile } from "~common/nodejs/utils";
import { directorySearchPattern } from "~connectAddon/nodejs/utils";

export const validateSourceModFolder = async (path: string, isGenerated: boolean) => {
    if (isGenerated) {
        try {
            const files = await glob(directorySearchPattern(path), { nodir: true });
            if(!files.length) {
                throw ''
            }
            return '';
        } catch {
            return 'Provided source mod folder doesn\'t have Ostim Tools generated hubs xml files.'
        }
    } else {
        try {
            await readFile(path)
            return '';
        } catch {
            return 'Couldn\'t read provided scene xml file.'
        }
    }
}