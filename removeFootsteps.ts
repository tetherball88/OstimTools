import { readJson } from './src/common/nodejs/utils';
import { writeJson } from './src/common/nodejs/utils/writeJson';
import path from 'path';
import util from 'util';
import { glob } from './src/common/nodejs/utils/glob'
import { readFile } from './src/common/nodejs/utils/readFile'
import { writeFile } from './src/common/nodejs/utils/writeFile'
import { remove } from './src/common/nodejs/utils/remove'
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

// const modPath = "D:\\repos\\OA3PP-for-OStim-SA";
const modPath = "D:\\Billyy_HumanFurniture"
const hkanno = "D:\\Tools\\hkanno64-001\\hkanno64.exe";

const hkAnnoFolder = path.dirname(hkanno)
const tmpFilePath = `${hkAnnoFolder}\\removeFootstepsTmp.txt`

const readAnnotations = async (file: string) => {
    if(file.length > 170) {
        throw new Error(`${file} - length of hkx path is longer than 170 characters, hkanno can't process this file. Please reduce length of your path.`)
    }
    try {
        const res = await exec(`${hkanno} dump -o "${tmpFilePath}" "${path.normalize(file)}"`, {
            cwd: hkAnnoFolder
        });

        if(res.stderr) {
            throw new Error(res.stderr)
        }
    } catch(e) {
        console.error(e.message)
    }

    const content = readFile(tmpFilePath);

    await remove(tmpFilePath)

    return content;
}

const writeAnnotations = async (file: string, newAnnotations: string) => {
    if(file.length > 170) {
        throw new Error(`${file} - length of hkx path is longer than 170 characters, hkanno can't process this file. Please reduce length of your path.`)
    }
    await writeFile(tmpFilePath, newAnnotations);

    try {
        const res = await exec(`${hkanno} update -i "${tmpFilePath}" "${file}"`, {
            cwd: hkAnnoFolder
        });

        if(res.stderr) {
            throw new Error(res.stderr)
        }
    } catch(e) {
        console.error(e.message)
    }

    await remove(tmpFilePath)
}

const removeFootstepsLines = (annotations: string) => {
    const regex = /(^)[\d.]+\s+(FootLeft|FootRight)\n?/gm;
    return annotations.replace(regex, "")
}

const removeFootsteps = async () => {
    const output: Record<string, any> = {}
    // const globPattern = `${modPath}\\meshes\\**\\*.hkx`;
    const globPattern = `${modPath}\\**\\*.hkx`;

    const files = (await glob(globPattern));
    let i = 0;

    for(const file of files) {
        const fileName = path.basename(file);
        output[fileName] = output[fileName] || {};
        const currentAnnotations = await readAnnotations(file);

        output[fileName].before = currentAnnotations

        await writeAnnotations(file, removeFootstepsLines(currentAnnotations))

        output[fileName].after = await readAnnotations(file);

        if(i % 10 === 0) {
            console.log(Math.floor(100 * i / files.length) + '%')
        }
        i++
    }



    await writeJson(path.resolve('./output.json'), output);
}

removeFootsteps()

// const compareOutputFiles = async () => {
//     const output = await readJson(path.resolve('./output.json'));

//     const globPattern = `${modPath}\\meshes\\**\\*.hkx`;

//     const files = await glob(globPattern);

//     console.log(files.length, Object.keys(output).length);

//     for(const file of files) {
//         const fileName = path.basename(file);

//         if(!output[fileName]) {
//             console.log(file);
//         }
//     }
// }

// compareOutputFiles()