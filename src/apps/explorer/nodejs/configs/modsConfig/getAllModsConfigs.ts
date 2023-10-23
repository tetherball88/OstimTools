import { asyncReduce, glob, logger, readYaml } from "~common/nodejs/utils";
import { getModFullConfigs } from "~explorer/nodejs/configs/modsConfig/getModFullConfigs";
import { getExplorerConfigPath } from "~explorer/nodejs/utils";
import { AllModsConfigs, ModInfoConfig } from "~explorer/types/ModsConfig";

const modsBaseConfigsPath = `${getExplorerConfigPath()}\\mods\\**\\modInfo.yml`;

export const getAllModsConfigs = async (): Promise<AllModsConfigs> => {
    const files = await glob(modsBaseConfigsPath);
    if(!files?.length) {
        return {};
    }
    const mods = await Promise.all(files.map(async file => {
        try {
            return (await readYaml(file) as ModInfoConfig).id
        } catch(e) {
            logger.error(e.Message)
            return null
        }
    }));

    return asyncReduce<AllModsConfigs, string | null>(mods, async (acc, modId) => {
        if(!modId) {
            return acc;
        }

        const res = await getModFullConfigs(modId)

        if(!res) {
            return acc;
        }

        return { ...acc, [res.info.id]: res }
    }, {});
}