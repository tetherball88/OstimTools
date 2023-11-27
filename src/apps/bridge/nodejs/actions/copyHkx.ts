
import childProcess from 'child_process';
import fs from "fs";
import util from 'util';

import { copyFile, glob, isHkxFile, logger, remove, writeFile } from "~common/nodejs/utils";
import { getOstimConfig, initialOstimConfigOnFileCopy, readSlalConfig } from "~bridge/nodejs/configs";
import { formatAnimName, getSlalPrefix, parseSlalName } from "~bridge/nodejs/utils";
import { CombinedConfig, OstimConfig, ParsedSlalConfig } from '~bridge/types';
import { writeOstimConfig } from '~bridge/nodejs/configs/ostimConfig/writeOstimConfig';

const exec = util.promisify(childProcess.exec);

const copyFilesForOneSeries = async (
    files: string[],
    config: CombinedConfig,
    slalConfig: ParsedSlalConfig,
    prefix: string,
    ostimConfig: OstimConfig
) => {
    logger.log(`--- Started copying hkx files`);
    const {
        module: {
            name: moduleName,
            include,
            exclude,
            idPrefix = "",

        },
        outputAnimPath,
        outputNemesisAnimlistTxt,
        nemesisTxtFileName,
        pack,
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
        const formattedAnimName = formatAnimName(id, prefix, pack.author, idPrefix);
        
        /**
         * include only animations from include(if empty all animations) and which aren't in exclude
         */
        if ((include?.length && !include.includes(formattedAnimName)) || exclude?.includes(formattedAnimName)) {
            continue;
        }

        const initialOstimConfig = await initialOstimConfigOnFileCopy({ config, slalConfig, file, ostimConfig }, animationsWithoutSlal, prefix);

        if (!initialOstimConfig) {
            logger.error(`Couldn't build initial ostim config.`);
            return;
        }

        const { ostimSceneConfig, newAnimFile } = initialOstimConfig;
        const {
            animName,
            posFolderName,
        } = ostimSceneConfig.folders;
        ostimConfig[animName] = ostimSceneConfig

        const destinationAnimPath = `${outputAnimPath}\\${posFolderName}\\${animName}`;

        // copy and rename animation file hkx
        await copyFile(file, `${destinationAnimPath}\\${newAnimFile}`);

        const buildBehaviorLine = (options = 'b -Tn', objectNames: string[] = []) => {
            return `${options} ${newAnimFile.replace(/\.hkx/i, '')} ..\\${moduleName}\\${posFolderName}\\${animName}\\${newAnimFile} ${objectNames.join(' ')} \r\n`
        }

        let data = buildBehaviorLine()

        const [,stageIndex] = newAnimFile.replace(/\.hkx/i, '').split('_').reverse()
        const actorObjects = slalConfig[animName]?.stages[Number(stageIndex) - 1]?.actors[parsedSlalName.actorIndex - 1]?.objects
        
        if(actorObjects?.objects && (actorObjects.stage == stageIndex || actorObjects.stage === 'all')) {
            data = buildBehaviorLine('b -o', actorObjects.objects)
        }

        // add animation files to nemesis behavior txt file

        await fs.promises.appendFile(`${outputNemesisAnimlistTxt}\\${nemesisTxtFileName}`, data);
    }
    if (animationsWithoutSlal.size) {
        logger.warn(`Couldn't find slal config for such animations: ${[...animationsWithoutSlal].join(', ')}`);
        logger.warn('^^^ You will need to manually add actors and meta tags to your scene json config file.');
    }

    logger.log(`--- Finished copying hkx files`);
}

export const copyHkx = async (config: CombinedConfig) => {
    const {
        global: {
            nemesisTransitionToolExe: nemesisTransitionTool
        },
        module: {
            inputPath,
            slalJsonConfig,
            name: moduleName,
            nemesisPrefix,
        },
        pack,
        outputNemesisAnimlistTxt,
        nemesisTxtFileName,
    } = config;

    logger.log(`--- Started copying animation files for ${moduleName}`);
    const slalPrefix = await getSlalPrefix(slalJsonConfig);

    if (slalPrefix === '') {
        logger.warn('Couldn\'t find SLAL animation prefix from SLAL source txt file');
    }

    const slalConfig = await readSlalConfig(config, slalPrefix);

    if (!slalConfig) {
        logger.error(`Couldn't parse and read slal config for files copying for module ${moduleName}`)
        return;
    }

    await writeFile(`${outputNemesisAnimlistTxt}\\${nemesisTxtFileName}`, '');

    const files = await glob(`${inputPath}\\*.{hkx,HKX}`);

    if (!files?.length) {
        logger.error(`Couldn't find any hkx files in the inputPath: ${inputPath}. Please make sure you provided correct inputPath with animations' hkx files.`);
        logger.log(`--- Stopped copying animation files for ${moduleName}`);
        return;
    }

    let ostimConfig: OstimConfig = {}

    try {
        ostimConfig = await getOstimConfig(config);
    } catch {
        logger.warn(`Wasn't able to find ostim config for animation ${moduleName} module.`);
    }

    await copyFilesForOneSeries(files, config, slalConfig, slalPrefix, ostimConfig);

    await writeOstimConfig(config, ostimConfig)

    try {
        logger.log(`--- Started generating Nemesis patches.`);
        logger.log('Please close Nemesis transition tool app after you finish there to proceed to next stage.');
        remove(`${pack.outputPath}\\Nemesis_Engine\\mod\\${nemesisPrefix}`)
        await exec(`"${nemesisTransitionTool}" -l "${outputNemesisAnimlistTxt}\\${nemesisTxtFileName}" -o "${pack.outputPath}" -p "${nemesisPrefix}" -n "${moduleName}" -a "${pack.author}"`)
        logger.log(`--- Finished generating Nemesis patches`);
    } catch (error) {
        logger.error(error.message);
        logger.log(`--- Stopped generating Nemesis patches`);
        return;
    }


    logger.log(`--- Finished copying animation files for ${moduleName}`);
}