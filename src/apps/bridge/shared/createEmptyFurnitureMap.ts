import { FurnitureTypes, ModuleFurnitureMapConfig } from "~bridge/types";

const furnitures: FurnitureTypes[] = ['bed', 'bench', 'chair', 'cookingpot', 'shelf', 'table', 'wall'];

export const createEmptyFurnitureMap = (obj?: ModuleFurnitureMapConfig['furnitureMap']) => {
    const newObj = {} as ModuleFurnitureMapConfig['furnitureMap'];

    for (const f of furnitures) {
        newObj[f] = obj?.[f] || [];
    }

    return newObj;
}