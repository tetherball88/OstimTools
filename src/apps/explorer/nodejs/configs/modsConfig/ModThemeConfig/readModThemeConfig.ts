import { readJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModThemeConfig } from "~explorer/types/ModThemeConfig"
import { defaultGlobalColors } from "~explorer/ui/state/defaultGlobalTheme"
import { merge } from 'lodash'

export const readModThemeConfig = async (modId: string): Promise<ModThemeConfig> => {
    try {
        const {global, ...other} = await readJson(`${getExplorerConfigPath()}\\mods\\${modId}\\theme.json`);

        return {
            global: merge({}, defaultGlobalColors, global),
            ...other
        }
    } catch(e) {
        return {
            global: defaultGlobalColors,
            scenesStyles: null,
            groupsStyles: null,
        }
    }
    
}