import { FurnitureTypes } from "./FurnitureTypes"

/**
 * Config per pack's module
 * @example Anub's pack has multiple modules: AnubsHuman, AnubsDom, AnubsMagick, etc...
 */
export interface ModuleConfig {
    module: {
        /**
         * Module name, it will be your folder name in ostim folders path
         * meshes\0SA\mod\0Sex\anim\{moduleName}\{posName}\{className}\{animName}
         */
        name: string
        /**
         * Folder path to your source hkx files
         * It should be a folder where all your hkx files for particular module
         */
        inputPath: string
        /**
         * Path to folder where is slal json file
         */
        slalJsonConfig: string
        /**
         * Include listed animations from inputPath to this module
         * if include and exclude are empty all animation from inputPath will be included into this module
         * if animation in both include and exclude list it will be excluded
         */
        include: string[]
        /**
         * Exclude listed animations from inputPath from this module
         * if animation in both include and exclude list it will be excluded
         */
        exclude: string[]
        /**
         * Prefix used to generate nemesis engine patches
         * max - 6 symbols, letters and digits
         */
        nemesisPrefix: string
        /**
         * Optional prefix for scene ids
         */
        idPrefix?: string
    }

}

export interface ModuleFurnitureMapConfig {
    /**
     * if pack has furniture animations, you should manually map animName to type of furniture
     * you can find different furniture types in ostim, here is list of furniture at this moment:
    */
    furnitureMap: Record<FurnitureTypes, string[]>
}

export interface TransitionConfig {
    sceneId: string
    destinationId: string
}

export interface ModuleTransitionsConfig {
    transitions?: TransitionConfig[]
}

/**
 * Animation objects to skip in animation
 * useful uf you want to adapt scene with spawned furniture to regular furniture
 */
export interface ModuleObjectsConfig {
    objects?: {
        skipObjects?: Record<string, string[]>
        replaceObjects?: Record<string, Record<string, string>>
    }

}

export type ModuleSections = 'module' | 'furnitureMap' | 'transitions';

/**
 * Other configs which should be set up per pack
 */
export interface ModuleSpecificConfig extends ModuleConfig, ModuleFurnitureMapConfig, ModuleTransitionsConfig, ModuleObjectsConfig { }
