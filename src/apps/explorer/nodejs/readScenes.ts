import path from 'path'
import { asyncReduce, glob, logger, readJson } from "~common/nodejs/utils";
import { OstimScene } from "~common/shared/types/OstimScene";
import { getAllModsConfigs } from '~explorer/nodejs/configs/modsConfig/getAllModsConfigs';
import { getModFullConfigs } from '~explorer/nodejs/configs/modsConfig/getModFullConfigs';

export type ExplorerOstimScene = {
    fileName: string,
    modPath: string,
    content: OstimScene
    filePath: string
}

export const readScenes = async (modId: string): Promise<ExplorerOstimScene[]> => {
    const fullConfig = await getModFullConfigs(modId);
    const info = fullConfig?.info

    if (!info) {
        return []
    }

    const scenesPattern = `${info.path}\\SKSE\\Plugins\\Ostim\\scenes\\**\\*.json`;

    const sceneFiles = await glob(scenesPattern);
    const res: ExplorerOstimScene[] = await asyncReduce<ExplorerOstimScene[], string>(sceneFiles, async (acc, file) => {
        const fileName = path.parse(file).name;

        try {
            const content = (await readJson(file)) as any

            if(!content) {
                return acc
            }

            acc.push({
                fileName,
                content,
                modPath: info.path,
                filePath: file
            })
        } catch(e) {
            logger.warn(e.message)
        }
        

        return acc;
    }, [])

    return res
}

export const readAllModsScenes = async () => {
    const allModsConfigs = await getAllModsConfigs()
    const res: Record<string, ExplorerOstimScene[]> = {}

    for (const mod of Object.values(allModsConfigs)) {
        res[mod.info.id] = await readScenes(mod.info.id)
    }

    return res;
}
