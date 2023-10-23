import fs from 'fs'
import path from 'path'
import { readModInfoConfig } from '~explorer/nodejs/configs/modsConfig/ModInfoConfig/readModInfoConfig';

export interface FolderStructure {
    name: string
    children?: FolderStructure[]
    path: string
}

export type FolderStructureResponse = {
    flat: Record<string, FolderStructure>
    tree: FolderStructure
}

const getFolderStructure = (scenesPath: string, flat: Record<string, FolderStructure>): FolderStructure => {
    const stats = fs.statSync(scenesPath);
    const name = path.basename(scenesPath);
    const pathName = scenesPath.replace(/\\/g, '/')
    if (!stats.isDirectory()) {
        flat[name] = {
            path: pathName,
            name,
        }
        return flat[name];
    }

    const children = fs.readdirSync(scenesPath).map((child) => {
        const childPath = path.join(scenesPath, child);
        return getFolderStructure(childPath, flat);
    });

    flat[name] = {
        name,
        children,
        path: pathName
    }
    return flat[name];
}

export const getScenesFolderStructure = async (modId: string): Promise<FolderStructureResponse> => {
    const modPath = (await readModInfoConfig(modId)).path
    const scenesPath = `${modPath}/SKSE/Plugins/Ostim/scenes`;
    const flat = {}

    const tree = getFolderStructure(scenesPath, flat)

    return {
        flat,
        tree
    }
}