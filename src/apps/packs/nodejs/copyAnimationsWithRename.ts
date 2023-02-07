
import fs from "fs";
import util from 'util'
import childProcess from 'child_process'

import { ParsedSlalConfig, CombinedConfig } from '~packs/types';
import { copyFile, getFileName, glob, isHkxFile, logger, writeFile } from "~common/nodejs/utils";
import { animNameOsaRegex, formatAnimName, getSlalPrefix, parseSlalName } from "~packs/nodejs/utils";
import { fnisPathes, initialOstimConfigOnFileCopy, readSlalConfig } from "~packs/nodejs/configs";

const exec = util.promisify(childProcess.exec);

const copyFilesForOneSeries = async (
    files: string[],
    config: CombinedConfig,
    slalConfig: ParsedSlalConfig,
    prefix: string,
    onlyFnis = false,
) => {
    logger.log(`--- Started copying hkx files`);
    const {
        module: {
            name: moduleName,
            include,
            exclude,
        },
        outputAnimPath,
        outputFnisBehaviorTxt,
        fnisTxtFileName,
    } = config;
    const animationsWithoutSlal: Set<string> = new Set

    for (const file of files) {
        if (!isHkxFile(file)) {
            continue;
        }

        const parsedSlalName = parseSlalName(file);

        if (!parsedSlalName) {
            continue;
        }

        const { id } = parsedSlalName;
        const formattedAnimName = formatAnimName(id, prefix);

        /**
         * include only animations from include(if empty all animations) and which aren't in exclude
         */
        if ((include?.length && !include.includes(formattedAnimName)) || exclude?.includes(formattedAnimName)) {
            continue;
        }

        const initialOstimConfig = await initialOstimConfigOnFileCopy({ config, slalConfig, file }, animationsWithoutSlal, prefix);

        if (!initialOstimConfig) {
            logger.error(`Couldn't build initial ostim config.`);
            return;
        }

        const { ostimSceneConfig, newAnimFile } = initialOstimConfig;
        const {
            posFolderName,
            classFolderName,
            animName,
        } = ostimSceneConfig.folders;

        const destinationAnimPath = `${outputAnimPath}\\${posFolderName}\\${classFolderName}\\${animName}`;

        if (!onlyFnis) {

            // copy and rename animation file hkx
            await copyFile(file, `${destinationAnimPath}\\${newAnimFile}`);
        }

        // add animation files to fnis behavior txt file
        const data = `b -Tn ${newAnimFile.replace(/\.hkx/i, '')} ..\\..\\..\\..\\0SA\\mod\\0Sex\\anim\\${moduleName}\\${posFolderName}\\${classFolderName}\\${animName}\\${newAnimFile} \r\n`;
        await fs.promises.appendFile(`${outputFnisBehaviorTxt}\\${fnisTxtFileName}`, data);
    }
    if (animationsWithoutSlal.size) {
        logger.warn(`Couldn't find slal config for such animations: ${[...animationsWithoutSlal].join(', ')}`);
        logger.warn('^^^ You will need to manually add actors and meta tags to your xml config file.');
    }

    logger.log(`--- Finished copying hkx files`);
}

const copyTweakedAnimationFiles = async ({
    overwriteTweakedAnimationsPath,
    outputAnimPath,
}: CombinedConfig) => {
    logger.log(`--- Started copying tweaked hkx files`);
    if (!overwriteTweakedAnimationsPath) {
        logger.log(`--- You didn't provide folder path for tweaked animation files. Don't worry it's optional step.`);
        logger.log(`--- Stopped copying tweaked hkx files`);
        return;
    }

    let tweakedFiles: string[] = []

    try {
        tweakedFiles = await glob(`${overwriteTweakedAnimationsPath}\\**\\*.hkx`);
    } catch (e) {
        logger.log(`There is no hkx files in your tweaked file folder ${overwriteTweakedAnimationsPath}`);
        logger.log(`--- Stopped copying tweaked hkx files`);
    }

    if (!tweakedFiles?.length) {
        return;
    }

    const originalFiles = await glob(`${outputAnimPath}\\**\\*.hkx`)

    for (const tweakedFile of tweakedFiles) {
        const tweakedFilename = getFileName(tweakedFile);

        const tweakedMatched = tweakedFilename.match(animNameOsaRegex);

        if (!tweakedMatched) {
            logger.warn(`Tweaked file name ${tweakedFilename} couldn't be parsed with osa regex.`);
            continue;
        }

        const [, , , animName, stageIndex, actorIndex] = tweakedMatched;
        const foundOrigFile = originalFiles.find(f => f.includes(`${animName}_${stageIndex}_${actorIndex}`));

        if (!foundOrigFile) {
            logger.log(originalFiles.filter(file => file.includes('afc2')).join(', '))
            logger.warn(`Couldn't find original file for tweaked file: ${tweakedFile}`);
            continue;
        }

        await fs.promises.copyFile(tweakedFile, foundOrigFile);
    }

    logger.log(`--- Finished copying tweaked hkx files`);
}

export const copyAnimationsWithRename = async (config: CombinedConfig, onlyHkx = false, onlyFnis = false) => {
    const {
        global: {
            fnisForModdersPath,
        },
        module: {
            inputPath,
            slalJsonConfig,
            name: moduleName,
        },
        outputFnisBehaviorTxt,
        outputFnisBehaviorHkx,
        fnisTxtFileName,
        fnisHkxFileName,

    } = config;

    logger.log(`--- Started copying animation files for ${moduleName}`);
    const slalPrefix = await getSlalPrefix(slalJsonConfig);

    if(typeof slalPrefix === 'undefined') {
        logger.error('Couldn\'t find SLAL animation prefix from SLAL source txt file');
        return;
    }
    const slalConfig = await readSlalConfig(slalJsonConfig, slalPrefix);

    if (!slalConfig) {
        logger.error(`Couldn't parse and read slal config for files copying for module ${moduleName}`)
        return;
    }

    await writeFile(`${outputFnisBehaviorTxt}\\${fnisTxtFileName}`, '');

    const files = await glob(`${inputPath}\\*.hkx`);

    if (!files?.length) {
        logger.error(`Couldn't find any hkx files in the inputPath: ${inputPath}. Please make sure you provided correct inputPath with animations' hkx files.`);
        logger.log(`--- Stopped copying animation files for ${moduleName}`);
        return;
    }

    await copyFilesForOneSeries(files, config, slalConfig, slalPrefix, onlyFnis);

    await copyTweakedAnimationFiles(config);

    if (onlyHkx) {
        return;
    }

    const { exe: fnisExe, output: fnisOutput } = fnisPathes(fnisForModdersPath);

    try {
        logger.log(`--- Started generating FNIS file.`);
        logger.log('Please close FNIS For Modders app after you finish there to proceed to next stage.');
        await exec(`"${fnisExe}"`);
        logger.log(`--- Finished generating FNIS file`);
    } catch (error) {
        logger.error(error.message);
        logger.log(`--- Stopped generating FNIS file`);
        return;
    }


    logger.log(`--- Started copying generated FNIS file to ouput folder`);
    await copyFile(`${fnisOutput}\\${fnisHkxFileName}`, `${outputFnisBehaviorHkx}\\${fnisHkxFileName}`);
    logger.log(`--- Finished copying generated FNIS file to ouput folder`);

    logger.log(`--- Finished copying animation files for ${moduleName}`);
}