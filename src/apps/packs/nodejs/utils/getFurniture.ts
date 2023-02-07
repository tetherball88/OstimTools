import { FurnitureTypes, ModuleFurnitureMapConfig } from "~packs/types";

export const getFurniture = (furnitureMap: ModuleFurnitureMapConfig['furnitureMap'], animName: string) => {
    return Object.keys(furnitureMap).find(f => furnitureMap[f as FurnitureTypes].includes(animName));
}