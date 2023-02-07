import { FurnitureTypes } from "./FurnitureTypes"

export interface SpecialSwapRules {
    [key: string]: {
        stages: (null | number[])[]
        /**
         * Apply indexes from first stage to all stages
         */
        applyToAllStages?: boolean
    }
}

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
    }

}

export interface ModuleCustomScaleConfig {
    /**
     * If your animation was designed for some particular actor scales you can provide it here. It will be added to actors in scene xml file
     * @example { [animName]: [1.15,null,1.15] } - where animName - name of your animation(you can find in copied hkx files), 
     * and array of numbers is ostim positioned actors and their scale, null means no custom scale should be applied to actor
     */
    customScale: Record<string, Array<number | null>>
}

export interface ModuleFurnitureMapConfig {
    /**
     * if pack has furniture animations, you should manually map animName to type of furniture
     * you can find different furniture types in ostim, here is list of furniture at this moment:
    */
    furnitureMap: Record<FurnitureTypes, string[]>
}

export interface ModuleIconsConfig {
    /**
     * If you want customize how your different animations looks when you select them from pack hub
     * all possible icons you can find in OSA.swf(flash) file
     */
    icons: Record<string, string[]>
}

export interface ModuleSpecialSwapRulesConfig {
    /**
     * If for some animation auto swapping logic doesn't work you can manually specify which slal index actor should be at which ostim index
     */
    specialSwapRules: SpecialSwapRules
}

export type ModuleSections = 'module' | 'customScale' | 'furnitureMap' | 'icons' | 'specialSwapRules';

/**
 * Other configs which should be set up per pack
 */
export interface ModuleSpecificConfig extends ModuleConfig, ModuleCustomScaleConfig, ModuleFurnitureMapConfig, ModuleIconsConfig, ModuleSpecialSwapRulesConfig { }




