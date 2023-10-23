import { readJson } from "~common/nodejs/utils"
import { getExplorerConfigPath } from "~explorer/nodejs/utils"
import { ModGroupsConfig } from "~explorer/types/ModsConfig"

const defaultExternalGroup = {
    id: "external",
    name: "External",
    children: []
}

export const readModGroupsConfig = async (modId: string): Promise<ModGroupsConfig> => {
    try {
        const groups = await readJson(`${getExplorerConfigPath()}\\mods\\${modId}\\groups.json`);

        if(!groups.external) {
            groups.external = defaultExternalGroup
        }

        return groups
    } catch(e) {
        return {
            external: defaultExternalGroup
        }
    }
}