import { readJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModEdgesConfig } from "~explorer/types/ModsConfig"

export const readModEdgesConfig = async (modId: string): Promise<ModEdgesConfig> => {
    try {
        const edgesConfig = await readJson(`${getExplorerConfigPath()}\\mods\\${modId}\\edges.json`);

        return edgesConfig
    } catch(e) {
        return {}
    }
}