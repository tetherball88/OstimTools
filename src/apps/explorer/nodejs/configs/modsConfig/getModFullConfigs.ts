import { logger } from "~common/nodejs/utils"
import { readModEdgesConfig } from "~explorer/nodejs/configs/modsConfig/EdgesConfig/readModEdgesConfig"
import { readModGroupsConfig } from "~explorer/nodejs/configs/modsConfig/GroupsConfig/readModGroupsConfig"
import { readModInfoConfig } from "~explorer/nodejs/configs/modsConfig/ModInfoConfig/readModInfoConfig"
import { readModPositionsConfig } from "~explorer/nodejs/configs/modsConfig/ModPositionsConfig/readModPositionsConfig"
import { readModThemeConfig } from "~explorer/nodejs/configs/modsConfig/ModThemeConfig/readModThemeConfig"
import { ModFullConfig } from "~explorer/types/ModsConfig"

export const getModFullConfigs = async (modId: string): Promise<ModFullConfig | null> => {
    try {
        return {
            info: await readModInfoConfig(modId),
            positions: await readModPositionsConfig(modId),
            theme: await readModThemeConfig(modId),
            groups: await readModGroupsConfig(modId),
            edges: await readModEdgesConfig(modId),
        }
    } catch(e) {
        logger.error(e.message)

        return null
    }
    
}