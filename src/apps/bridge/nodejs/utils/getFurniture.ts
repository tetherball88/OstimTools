import { ModuleFurnitureMapConfig } from "~bridge/types";

export const getFurniture = (furnitureMap: ModuleFurnitureMapConfig['furnitureMap'], animName: string) => {
    return furnitureMap.find(({ animation }) => animation === animName)?.furniture
}