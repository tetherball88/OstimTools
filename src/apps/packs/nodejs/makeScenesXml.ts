import { logger, getFileName, glob, writeFile, isHkxFile  } from '~common/nodejs/utils';
import { animNameOsaRegex, parseAnimationPath, groupByActorsAndFurniture } from "~packs/nodejs/utils";
import { renderScene, renderHub } from "~packs/nodejs/renderXml";
import { cleanHubs, cleanScenes } from "./cleanModule";
import { OstimConfig, HubNav, CombinedConfig } from '~packs/types';
import { getOstimConfig } from "./configs";

const generateSceneFiles = async (files: string[], config: CombinedConfig, ostimConfig: OstimConfig) => {
    logger.log('--- Started generating xml scene files.');
    const {
        outputScenePath,
    } = config;
    const createdStagesMap: Record<string, boolean> = {};
    const animsWithoutOstimConfig = new Set;

    for (const file of files) {
        if(!isHkxFile(file)) {
            continue;
        }

        const { animName, classFolder, posFolder } = parseAnimationPath(file);

        const matched = getFileName(file).match(animNameOsaRegex)

        if (!matched) {
            logger.warn('Not a valid file name: ' + file);
            continue;
        }
        const [, , , , stageIndex] = matched;
        const newScene = `${animName}-${stageIndex}`;

        if (createdStagesMap[newScene]) {
            continue;
        }
        createdStagesMap[newScene] = true;

        if (!ostimConfig[animName]) {
            animsWithoutOstimConfig.add(animName);
            continue;
        }

        const newSceneFile = `${newScene}.xml`;
        const destinationScenePath = `${outputScenePath}\\${posFolder}\\${classFolder}`;
        const sceneConfig = ostimConfig[animName];

        await writeFile(`${destinationScenePath}\\${newSceneFile}`, renderScene(sceneConfig, config, parseInt(stageIndex) - 1));
    }

    if (animsWithoutOstimConfig.size) {
        logger.warn(`Couldn't find preconfigured settings for animations: ${Array.from(animsWithoutOstimConfig)}`);
        logger.warn('^^^^ Please review and adjust animations with ostim tags and settings in-game');
    }

    logger.log('--- Finished generating xml scene files.');
}

const generateHubSceneFiles = async (config: CombinedConfig, ostimConfig: OstimConfig) => {
    logger.log('--- Started generating xml hub files.');
    const {
        outputHubScenePath,
    } = config;
    const animsGroups = groupByActorsAndFurniture(config, ostimConfig);
    const hubsNav: Record<string, HubNav> = {}

    Object.values(animsGroups).forEach((animsGroup) => {
        const { name, siblingHub } = animsGroup;
        let hubIntroSceneFileName = animsGroup.animations[0].stages[0].fileName;
        const {
            lessMHubName,
            lessFHubName,
            moreMHubName,
            moreFHubName,
        } = siblingHub;

        animsGroup.animations.forEach(animConfig => {
            animConfig.stages.forEach(({ meta, fileName }) => {
                if (meta.tags.includes('idle') && meta.tags.includes('intro')) {
                    hubIntroSceneFileName = fileName;
                }
            })
        })

        const inviteM = moreMHubName && animsGroups[moreMHubName] ? moreMHubName : null;
        let inviteF = moreFHubName && animsGroups[moreFHubName] ? moreFHubName : null;
        let dismiss = lessFHubName && animsGroups[lessFHubName] ? lessFHubName : lessMHubName && animsGroups[lessMHubName] ? lessMHubName : null;

        // restrict ffmm to be navigatable only from ffm, otherwise it's needs to be ffmm animations files should be doubled, to support navigation from both ffm and fmm
        if (name.toLowerCase().includes('fmm')) {
            inviteF = null
        }

        // ffmm should return to ffm
        if (name.toLowerCase().includes('ffmm')) {
            dismiss = lessMHubName as string;
        }

        hubsNav[name] = {
            curr: hubIntroSceneFileName,
            inviteF,
            inviteM,
            dismiss,
        }
    });

    for(const groupKey of Object.keys(animsGroups)) {
        const animsGroup = animsGroups[groupKey];
        await writeFile(`${outputHubScenePath}\\${groupKey}.xml`, renderHub(
            animsGroup,
            hubsNav,
            config,
        ));
    }
    
    logger.log('--- Finished generating xml hub files.');
}

export const makeScenesXml = async (config: CombinedConfig, onlyScenes = false, onlyHubs = false) => {
    logger.log('--- Started generating xml files.');
    const {
        module: { name: moduleName },
        outputAnimPath,
        outputScenesJsonConfigPath,
        scenesJsonConfigFilename
    } = config;

    let ostimConfig: OstimConfig

    try {
        ostimConfig = await getOstimConfig(moduleName);
    } catch (e) {
        logger.error(`Couldn't load ostim config file ${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename} \n ${e.toString()}`)
        ostimConfig = {}
    }

    const files = await glob(`${outputAnimPath}\\**\\*.hkx`);
    
    if (!files) {
        logger.error('--- Couldn\'t find any hkx file in provided outputPath. Please make sure that you ran "copy hkx" button.');
        logger.log('--- Stopped generating xml files.');
        return;
    }
    
    if (!onlyHubs) {
        await cleanScenes(config);
        await generateSceneFiles(files, config, ostimConfig);
    }


    if (!onlyScenes) {
        await cleanHubs(config);
        await generateHubSceneFiles(config, ostimConfig);
    }
    logger.log('--- Finished generating xml files.');
}