import { readXml } from "~common/nodejs/utils";
import { createOption, separateByCapitalLetters } from "~connectAddon/nodejs/utils";


export const createOptionsFromFiles = async (files: string[]) => {
    const options = [];
    for (const file of files) {
        const fileContent = await readXml(file);
        const id = fileContent.scene.$.id;
        const text = 'Go to ' + (separateByCapitalLetters(fileContent.scene.info[0].$.name)?.join(' ') || fileContent.scene.info[0].$.name);
        options.push(createOption(id, text))
    }

    return options;
}