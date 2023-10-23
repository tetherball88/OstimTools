import { readAllModsScenes } from '~explorer/nodejs/readScenes';
import { EXPLORER_UPDATE_SCENE, EXPLORER_MAKE_SNAPSHOT, EXPLORER_READ_ALL_SCENES, EXPLORER_REMOVE_POSITION, EXPLORER_WRITE_POSITIONS, EXPLORER_REMOVE_SCENE, EXPLORER_GET_META_DATA_FROM_MODS, EXPLORER_GET_CONFIGS, EXPLORER_WRITE_MOD_INFO_CONFIG, EXPLORER_ADD_OR_UPDATE_POSITIONS, EXPLORER_REMOVE_MOD, EXPLORER_WRITE_MOD_THEME_CONFIG, EXPLORER_WRITE_MOD_GROUPS_CONFIG, EXPLORER_WRITE_MOD_EDGES_CONFIG, EXPLORER_GET_SCENES_FOLDER_STRUCTURE, EXPLORER_READ_SCENE } from '~explorer/events/events';
import { saveImage } from '~explorer/nodejs/saveImage';
import { ModEdgesConfig, ModGroupsConfig, ModInfoConfig } from '~explorer/types/ModsConfig';
import { PositionsConfig, PositionsConfigItem } from '~explorer/types/PositionsConfig';
import { removeScene } from '~explorer/nodejs/removeScene';
import { updateScene } from '~explorer/nodejs/updateScene';
import { getModsMetadata } from '~explorer/nodejs/getModsMetadata';
import { getAllModsConfigs } from '~explorer/nodejs/configs/modsConfig/getAllModsConfigs';
import { writeModPositionsConfig } from '~explorer/nodejs/configs/modsConfig/ModPositionsConfig/writeModPositionsConfig';
import { addOrUpdatePositions } from '~explorer/nodejs/configs/modsConfig/ModPositionsConfig/addOrUpdatePositions';
import { removePositionsConfig } from '~explorer/nodejs/configs/modsConfig/ModPositionsConfig/removePositionConfig';
import { writeModInfoConfig } from '~explorer/nodejs/configs/modsConfig/ModInfoConfig/writeModInfoConfig';
import { removeMod } from '~explorer/nodejs/configs/modsConfig/removeMod';
import { writeModThemeConfig } from '~explorer/nodejs/configs/modsConfig/ModThemeConfig/writeModThemeConfig';
import { ModThemeConfig } from '~explorer/types/ModThemeConfig';
import { writeModGroupsConfig } from '~explorer/nodejs/configs/modsConfig/GroupsConfig/writeModGroupsConfig';
import { writeModEdgesConfig } from '~explorer/nodejs/configs/modsConfig/EdgesConfig/writeModEdgesConfig';
import { getScenesFolderStructure } from '~explorer/nodejs/getFolderStructure';
import { readJson } from '~common/nodejs/utils';

export const eventsMap = {
    [EXPLORER_GET_CONFIGS]: () => getAllModsConfigs(),
    [EXPLORER_READ_ALL_SCENES]: () => readAllModsScenes(),
    [EXPLORER_MAKE_SNAPSHOT]: (modId: string, base64: string) => saveImage(modId, base64),
    [EXPLORER_WRITE_MOD_INFO_CONFIG]: (modId: string, config: ModInfoConfig) => writeModInfoConfig(modId, config),
    [EXPLORER_WRITE_POSITIONS]: (modId: string, positions: PositionsConfig) => writeModPositionsConfig(modId, positions),
    [EXPLORER_ADD_OR_UPDATE_POSITIONS]: (modId: string, eles: PositionsConfigItem[]) => addOrUpdatePositions(modId, eles),
    [EXPLORER_REMOVE_POSITION]: (modId: string, positionId: string) => removePositionsConfig(modId, positionId),
    [EXPLORER_REMOVE_SCENE]: (filePath: string) => removeScene(filePath),
    [EXPLORER_UPDATE_SCENE]: (sceneOriginalId: string, sceneStr: string) => updateScene(sceneOriginalId, sceneStr),
    [EXPLORER_GET_META_DATA_FROM_MODS]: () => getModsMetadata(),
    [EXPLORER_REMOVE_MOD]: (modId: string) => removeMod(modId),
    [EXPLORER_WRITE_MOD_THEME_CONFIG]: (modId: string, themeConfig: ModThemeConfig) => writeModThemeConfig(modId, themeConfig),
    [EXPLORER_WRITE_MOD_GROUPS_CONFIG]: (modId: string, config: ModGroupsConfig) => writeModGroupsConfig(modId, config),
    [EXPLORER_WRITE_MOD_EDGES_CONFIG]: (modId: string, config: ModEdgesConfig) => writeModEdgesConfig(modId, config),
    [EXPLORER_GET_SCENES_FOLDER_STRUCTURE]: (modId: string) => getScenesFolderStructure(modId),
    [EXPLORER_READ_SCENE]: (scenePath: string) => readJson(scenePath)
}
