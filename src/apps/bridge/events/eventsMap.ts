import { APPLY_ANNOTATIONS, ANALYZE_ANNOTATIONS, ARCHIVE_MOD, CLEAN_NEMESIS, CLEAN_HKX, CLEAN_HUBS_AND_SCENES, CLEAN_MODULE, GET_ALL_ANIMATIONS, LOAD_CONFIGS, LOAD_GLOBAL_CONFIG, REMOVE_MODULE, REMOVE_PACK, RUN_ALL, RUN_COPY_FILES, RUN_SCENES_HUBS, VALIDATE_NEMESIS_PATH, VALIDATE_INPUT_PATH, VALIDATE_SLAL_JSON_PATH, WRITE_GLOBAL_CONFIG, WRITE_MODULE_CONFIG, WRITE_PACK_CONFIG, SCENES_TO_CONFIG, RUN_ALL_2, WRITE_STARTING_SCENES_CONFIG, LOAD_STARTING_SCENES_CONFIG, SEARCH_STARTING_SCENES, GET_ALL_SCENES, BUILD_SEQUENCES, ARCHIVE_PACK_SEQUENCES } from '~bridge/events/events';
import { cleanNemesisFiles, cleanHkxFiles, cleanHubsAndScenes, cleanModule, copyHkx, scenesToConfig, removePack, archiveMod, applyAnnotations, removeModule } from "~bridge/nodejs";
import { getPacksConfigs, getGlobalConfig, mergeConfigs, validateNemesisTransitionToolPath, validateInputPath, validateSlalJsonPath, writeGlobalConfig, writeModuleConfig, writePackConfig, getOstimConfig } from "~bridge/nodejs/configs";
import { makeOstimScenes } from "~bridge/nodejs/actions/makeOstimScenes";
import { readAllAnimationsFromInputPath, readAllScenesFromOutputPath } from "~bridge/nodejs/actions/readAllAnimationsFromInputPath";
import { analyzeAnimations } from "~bridge/nodejs/actions/analyzeAnimations";
import { getSlalPrefix } from "~bridge/nodejs/utils";
import { CombinedConfig, GlobalConfig, ModuleSpecificConfig, OstimConfig, PackConfig, PackFullConfig } from "~bridge/types";
import { StartingScenesConfig } from '~bridge/types/StartingScenes';
import { getStartingScenesConfig, writeStartingScenesConfig } from '~bridge/nodejs/configs/startingScenes';
import { searchStartingScenes } from '~bridge/nodejs/actions/searchStartingScenes';
import { buildSequences } from '~bridge/nodejs/actions/buildSequences';
import { archiveSequence } from '~bridge/nodejs/actions/archiveSequences';

export const eventsMap = {
    [RUN_ALL]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        await cleanModule(combinedConfig);
        await copyHkx(combinedConfig);
        return makeOstimScenes(combinedConfig);
    },
    [RUN_ALL_2]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        // save user's changes to scene files into config
        await scenesToConfig(combinedConfig);
        let ostimConfig: OstimConfig = await getOstimConfig(combinedConfig);

        // analyze climax hkx scenes to find duration and current annotations
        await analyzeAnimations(combinedConfig, ostimConfig)

        // clean module related files for clean copy
        await cleanModule(combinedConfig);

        // copy all animation files
        await copyHkx(combinedConfig);

        // refresh ostim config from file
        ostimConfig = await getOstimConfig(combinedConfig);
        
        // make all scenes
        await makeOstimScenes(combinedConfig);
        
        // make all scenes
        await applyAnnotations(combinedConfig, ostimConfig);
    },
    [RUN_COPY_FILES]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        await cleanHkxFiles(combinedConfig)
        return copyHkx(combinedConfig);
    },
    [RUN_SCENES_HUBS]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        await cleanHubsAndScenes(combinedConfig);
        return makeOstimScenes(combinedConfig);
    },
    [SCENES_TO_CONFIG]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        return scenesToConfig(combinedConfig);
    },
    [CLEAN_MODULE]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        return cleanModule(combinedConfig);
    },
    [CLEAN_HKX]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        return cleanHkxFiles(combinedConfig);
    },
    [CLEAN_NEMESIS]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        return cleanNemesisFiles(combinedConfig);
    },
    [CLEAN_HUBS_AND_SCENES]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        return cleanHubsAndScenes(combinedConfig);
    },
    [REMOVE_MODULE]: async (packConfig: PackConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(packConfig, moduleConfig);
        return removeModule(combinedConfig);
    },
    [REMOVE_PACK]: (config: PackFullConfig) => {
        return removePack(config);
    },
    [LOAD_CONFIGS]: async () => {
        const res = await getPacksConfigs();

        return res;
    },
    [LOAD_STARTING_SCENES_CONFIG]: () => getStartingScenesConfig(),
    [GET_ALL_ANIMATIONS]: async (inputPath: string, slalJsonConfig: string, author: string) => {
        const prefix = await getSlalPrefix(slalJsonConfig);
    
        if(typeof prefix === 'undefined') {
            return {};
        }
    
        const res = await readAllAnimationsFromInputPath(inputPath, prefix, author);
        return res || {};
    },
    [GET_ALL_SCENES]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        const res = await readAllScenesFromOutputPath(combinedConfig);
        return res || {};
    },
    [WRITE_PACK_CONFIG]: (config: PackConfig) => {
        return writePackConfig(config);
    },
    [WRITE_MODULE_CONFIG]: (packName: string, config: ModuleSpecificConfig) => {
        return writeModuleConfig(packName, config);
    },
    [WRITE_GLOBAL_CONFIG]: (config: GlobalConfig) => {
        return writeGlobalConfig(config);
    },
    [WRITE_STARTING_SCENES_CONFIG]: (config: StartingScenesConfig) => {
        return writeStartingScenesConfig(config);
    },
    [LOAD_GLOBAL_CONFIG]: async (): Promise<GlobalConfig> => {
        try {
            const res = await getGlobalConfig();
            return res;
        } catch(e) {
            console.error(e);
            return { nemesisTransitionToolExe: '' };
        }
    },
    [VALIDATE_NEMESIS_PATH]: (nemesisPath?: string) => {
        return validateNemesisTransitionToolPath(nemesisPath);
    },
    [VALIDATE_INPUT_PATH]: (inputPath: string) => {
        return validateInputPath(inputPath);
    },
    [VALIDATE_SLAL_JSON_PATH]: (slalJsonPath: string) => {
        return validateSlalJsonPath(slalJsonPath);
    },
    [APPLY_ANNOTATIONS]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        const ostimConfig: OstimConfig = await getOstimConfig(combinedConfig);
    
        return applyAnnotations(combinedConfig, ostimConfig);
    },
    [ANALYZE_ANNOTATIONS]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        const ostimConfig: OstimConfig = await getOstimConfig(combinedConfig);
    
        return analyzeAnimations(combinedConfig, ostimConfig);
    },
    [ARCHIVE_MOD]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
    
        return archiveMod(combinedConfig);
    },
    [SEARCH_STARTING_SCENES]: async (path: string) => searchStartingScenes(path),
    [BUILD_SEQUENCES]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);
        const ostimConfig: OstimConfig = await getOstimConfig(combinedConfig);
        return await buildSequences(combinedConfig, ostimConfig)
    },
    [ARCHIVE_PACK_SEQUENCES]: async ({ modules, ...otherPackConfig }: PackFullConfig, moduleConfig: ModuleSpecificConfig) => {
        const combinedConfig: CombinedConfig = await mergeConfigs(otherPackConfig, moduleConfig);

        return await archiveSequence(combinedConfig)
    }
}
