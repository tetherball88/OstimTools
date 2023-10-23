import { readYaml } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModInfoConfig } from "~explorer/types/ModsConfig"

export const readModInfoConfig = (modId: string): Promise<ModInfoConfig> => readYaml(`${getExplorerConfigPath()}\\mods\\${modId}\\modInfo.yml`)