import { writeYaml } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModInfoConfig } from "~explorer/types/ModsConfig"

export const writeModInfoConfig = (modId: string, modInfoConfig: ModInfoConfig) => writeYaml(`${getExplorerConfigPath()}\\mods\\${modId}\\modInfo.yml`, modInfoConfig)