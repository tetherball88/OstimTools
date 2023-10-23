import path from 'path'
import { glob, readFile } from "~common/nodejs/utils";
import { ModsMetadata, ModsMetadataItem } from '~common/shared/types/ModsMetadata';
import { getAllModsConfigs } from '~explorer/nodejs/configs/modsConfig/getAllModsConfigs';
import { ModFullConfig } from '~explorer/types/ModsConfig';

const parseTags = async (path: string, modName: string) => {
    try {
        const content = await readFile(path);
        return content.split('\n').map((line) => {
            const tag = line.split(' ')[0].replace('\r', '')
    
            return {
                group: modName,
                value: tag
            }
        })
    } catch(e) {
        return [];
    }
    
}

const getActionsAndFurnitures = async (globPath: string, modName: string) => {
    const files = await glob(globPath);

    return files.map((file) => {
        const fileNameWithoutExtension = path.parse(file).name;

        return {
            group: modName,
            value: fileNameWithoutExtension
        }
    })
}

const filterDuplicates = <T extends ModsMetadataItem>(arr: T[]) => {
    const found: Record<string, boolean> = {}

    return arr.filter(item => {
        if(!found[item.value]) {
            found[item.value] = true;
            return true
        }

        return false;
    })
}

export const getModsMetadata = async (): Promise<ModsMetadata> => {
    const modsConfig = await getAllModsConfigs();
    const res: ModsMetadata = { actions: [], furnitures: [], actorTags: [], sceneTags: [] }

    if (!modsConfig) {
        return res;
    }

    let modsConfigs: ModFullConfig[] = Object.values(modsConfig)

    const ostimModConfigIndex = modsConfigs.findIndex(config => config.info.id === 'ostimStandaloneAdvancedAdultAnimationFramework')

    if(ostimModConfigIndex !== -1) {
        modsConfigs = [modsConfigs.splice(ostimModConfigIndex, 1)[0], ...modsConfigs]
    }

    for (const mod of modsConfigs) {
        const modId = mod.info.id
        const modPath = mod.info.path
        const actionsGlob = `${modPath}\\SKSE\\Plugins\\OStim\\actions\\**\\*.json`;
        const furntiureGlob = `${modPath}\\SKSE\\Plugins\\OStim\\furniture types\\**\\*.json`;
        const actorTagsPath = `${modPath}\\SKSE\\Plugins\\OStim\\list of commonly used actor tags.txt`;
        const sceneTagsPath = `${modPath}\\SKSE\\Plugins\\OStim\\list of commonly used scene tags.txt`;

        const actorTags = await parseTags(actorTagsPath, modId);
        const sceneTags = await parseTags(sceneTagsPath, modId);

        const actions = await getActionsAndFurnitures(actionsGlob, modId);
        const furnitures = await getActionsAndFurnitures(furntiureGlob, modId);

        res.actorTags.push(...actorTags)
        res.sceneTags.push(...sceneTags)
        res.actions.push(...actions)
        res.furnitures.push(...furnitures)
    }

    res.actorTags = filterDuplicates(res.actorTags)
    res.sceneTags = filterDuplicates(res.sceneTags)
    res.actions = filterDuplicates(res.actions)
    res.furnitures = filterDuplicates(res.furnitures)
    
    return res;
}
