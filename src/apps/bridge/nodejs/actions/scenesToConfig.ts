import fs from "fs";
import { logger, getFileName, glob, readJson, writeJson } from '~common/nodejs/utils';
import { OstimConfig, OstimConfigAnimation, OstimConfigAnimationStage, OstimConfigAnimationMeta, CombinedConfig, FurnitureTypes } from '~bridge/types';
import { OstimScene } from "~bridge/types/OstimSAScene";
import { getOstimConfig } from "~bridge/nodejs/configs";


export const scenesToConfig = async (config: CombinedConfig) => {
    const {
        scenesJsonConfigFilename,
        outputScenesJsonConfigPath,
        outputScenePath,
    } = config
    logger.log('--- Started generating ostim scenes config files.');
    await fs.promises.mkdir(outputScenesJsonConfigPath, { recursive: true });

    let ostimConfig: OstimConfig;

    try {
        ostimConfig = await getOstimConfig(config);
    } catch {
        ostimConfig = {};
    }

    const files = await glob(`${outputScenePath}\\**\\*.json`);

    for (const file of files) {
        const animationName = getFileName(file);
        const matched = animationName.match(/(\w+)-(\d+)/i);

        if (/Hub/.test(file) || !matched) {
            continue;
        }

        const animName = matched[1];
        const stageIndex = matched[2];
        const nStageIndex = parseInt(stageIndex) - 1;

        const sceneConfig = ostimConfig[animName] = ostimConfig[animName] || {} as OstimConfigAnimation;

        sceneConfig.stages = sceneConfig.stages || [];

        const stageConfig = sceneConfig.stages[nStageIndex] = sceneConfig.stages[nStageIndex] || {} as OstimConfigAnimationStage;

        const jsonScene: OstimScene = await readJson(file);
        const { tags, furniture } = jsonScene;

        stageConfig.meta = stageConfig.meta || {} as OstimConfigAnimationMeta;

        if (tags?.length) {
            stageConfig.meta.tags = tags;
        }

        if (furniture) {
            stageConfig.meta.furniture = furniture.toLowerCase()  as FurnitureTypes;
        }

        const actors = jsonScene.actors;
        const actions = jsonScene.actions;

        if (actors?.length) {
            stageConfig.actors = actors;
        }

        if (actions?.length) {
            stageConfig.actions = actions;
        }

        if(jsonScene.noRandomSelection)
            stageConfig.noRandomSelection = true

        await writeJson(`${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename}`, ostimConfig);
    }

    logger.log('--- Finished generating ostim scenes config files.');
}