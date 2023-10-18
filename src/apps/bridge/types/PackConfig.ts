import { CommonConfig } from "./CommonConfig"
import { ModuleSpecificConfig } from "./ModuleConfig"

export interface PackConfig {
    pack: {
        /**
         * Pack original author
         */
        author: string
        name: string
        /**
         * Folder where all needed osa/ostim folders "meshes/**" will be created
         * @example - {outputPath}\meshes\0SA\mod\0Sex\anim\{moduleName}\{posName}\{className}\{animName}
         */
        outputPath: string
    }
}

export interface PackModuleConfig extends ModuleSpecificConfig, CommonConfig {}

/**
 * Combined pack config
 */
export interface PackFullConfig extends PackConfig {
    modules: ModuleSpecificConfig[]
}