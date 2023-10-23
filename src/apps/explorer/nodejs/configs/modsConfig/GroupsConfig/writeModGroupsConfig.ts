import { writeJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModGroupsConfig } from "~explorer/types/ModsConfig"

export const writeModGroupsConfig = (modId: string, modGroupsConfig: ModGroupsConfig) => writeJson(`${getExplorerConfigPath()}\\mods\\${modId}\\groups.json`, modGroupsConfig)