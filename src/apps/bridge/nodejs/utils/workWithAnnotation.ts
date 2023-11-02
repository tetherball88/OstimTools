import childProcess from 'child_process';
import util from 'util';
import path from 'path';
import { logger, readFile, remove, writeFile } from '~common/nodejs/utils';
import { CombinedConfig } from '~bridge/types';

const exec = util.promisify(childProcess.exec);

const getTmpFilePath = (config: CombinedConfig) => {
    const { global: {hkannoExe} } = config;
    if(!hkannoExe) {
        throw new Error('You didn\'t provide hkanno exe path.');
    }
    const hkAnnoFolder = path.dirname(hkannoExe)
    return path.resolve(`${hkAnnoFolder}`, './tmp.txt')
}

const removeFootstepsLines = (annotations: string) => {
    const regex = /(^)[\d.]+\s+(FootLeft|FootRight)\n?/gm;
    return annotations.replace(regex, "")
}

export const readAnnotations = async (hkxFile: string, config: CombinedConfig) => {
    const { global: {hkannoExe} } = config;
    if(!hkannoExe) {
        throw new Error('You didn\'t provide hkanno exe path.');
    }

    if(hkxFile.length > 170) {
        throw new Error(`${hkxFile} - length of hkx path is longer than 170 characters, hkanno can't process this file. Please reduce length of your path.`)
    }
    
    const hkAnnoFolder = path.dirname(hkannoExe)
    const tmpFilePath = getTmpFilePath(config)
    try {
        const res = await exec(`${hkannoExe} dump -o "${tmpFilePath}" "${path.normalize(hkxFile)}"`, {
            cwd: hkAnnoFolder
        });

        if(res.stderr) {
            throw new Error(res.stderr)
        }
    } catch(e) {
        logger.error(e.message)
    }

    const content = await readFile(tmpFilePath);

    await remove(tmpFilePath)

    const durationRegex = /# duration: ([\d.]+)/;
    const durationMatch = content.match(durationRegex);
    const duration = durationMatch ? parseFloat(durationMatch[1]) : 2;

    const linesRegex = /^[^#].+/gm;
    const linesMatch = content.replace(/\n/g, '').match(linesRegex);
    const linesWithoutHash = linesMatch ? linesMatch.join('\n') : null;

    return {
        duration,
        annotationLines: linesWithoutHash ? removeFootstepsLines(linesWithoutHash) : null
    }
}

export const updateAnnotations = async (hkxFile:string, oldContent: string | null, addContent: string | null, config: CombinedConfig) => {
    const { global: {hkannoExe} } = config;
    if(!hkannoExe) {
        throw new Error('You didn\'t provide hkanno exe path.');
    }

    if(hkxFile.length > 170) {
        throw new Error(`${hkxFile} - length of hkx path is longer than 170 characters, hkanno can't process this file. Please reduce length of your path.`)
    }
    
    const hkAnnoFolder = path.dirname(hkannoExe)
    const tmpFilePath = getTmpFilePath(config)
    let newContent = oldContent || ''
    if(addContent) {
        if(newContent) {
            newContent += '\n'
        } 
        newContent += addContent
    }

    await writeFile(tmpFilePath, newContent)

    await exec(`${hkannoExe} update -i "${tmpFilePath}" "${hkxFile}"`, {
        cwd: hkAnnoFolder
    });

    await remove(tmpFilePath)

    return newContent;
}
