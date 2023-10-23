import { writeJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModThemeConfig } from "~explorer/types/ModThemeConfig"

export const writeModThemeConfig = (modId: string, modThemeConfig: ModThemeConfig) => writeJson(`${getExplorerConfigPath()}\\mods\\${modId}\\theme.json`, modThemeConfig)