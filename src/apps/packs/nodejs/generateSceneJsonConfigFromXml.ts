import fs from "fs";
import { logger, getFileName, glob, isXmlFile, readJson, readXml, writeJson } from '~common/nodejs/utils';
import { OstimConfig, OstimConfigAnimation, OstimConfigAnimationStage, OstimConfigAnimationMeta, CombinedConfig } from '~packs/types';


export const generateSceneJsonConfigFromXml = async ({
    scenesJsonConfigFilename,
    outputScenesJsonConfigPath,
    outputScenePath,
}: CombinedConfig) => {
    logger.log('--- Started generating ostim scenes config files.');
    await fs.promises.mkdir(outputScenesJsonConfigPath, { recursive: true });

    let ostimConfig: OstimConfig;

    try {
        ostimConfig = await readJson(`${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename}`);
    } catch {
        ostimConfig = {};
    }

    const files = await glob(`${outputScenePath}\\**\\*.xml`);

    for (const file of files) {
        if (!isXmlFile(file)) {
            return;
        }
        const animationName = getFileName(file);
        const matched = animationName.match(/(\w+)-(\d+)/i);

        if (/Hub/.test(file) || !matched) {
            return;
        }

        let animName = matched[1];
        const stageIndex = matched[2];
        const nStageIndex = parseInt(stageIndex) - 1;

        animName = animName.toLowerCase();

        const sceneConfig = ostimConfig[animName] = ostimConfig[animName] || {} as OstimConfigAnimation;

        sceneConfig.stages = sceneConfig.stages || [];

        const stageConfig = sceneConfig.stages[nStageIndex] = sceneConfig.stages[nStageIndex] || {} as OstimConfigAnimationStage;

        const xmlContent: any = await readXml(file);

        const xmlScene = xmlContent.scene;
        const { tags, furniture } = xmlScene.metadata[0].$ || {};

        stageConfig.meta = stageConfig.meta || {} as OstimConfigAnimationMeta;

        if (tags) {
            stageConfig.meta.tags = tags.toLowerCase();
        }

        if (furniture) {
            stageConfig.meta.furniture = furniture.toLowerCase();
        }

        const actors = xmlScene.actors?.[0]?.actor?.map(({ $: actor }: { $: any }) => actor);
        const actions = xmlScene.actions?.[0]?.action?.map(({ $: action }: { $: any }) => action);

        if (actors) {
            stageConfig.actors = actors;
        }

        if (actions) {
            stageConfig.actions = actions;
        }

        await writeJson(`${outputScenesJsonConfigPath}\\${scenesJsonConfigFilename}`, ostimConfig);
    }

    logger.log('--- Finished generating ostim scenes config files.');
}