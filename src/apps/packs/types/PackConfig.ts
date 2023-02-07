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
        /**
         * If you tweaked your animations it's better to move them to separate place outside of outputPath
         * otherwise it will be overwritten next time you copy hkx files from inputPath
         * with provided folder for tweaked animations - script will try to find all files in there, parse their names and match files it copied from inputPath
         * it's optional and your pack might not need any tweaking of animations at all
         * make sure that your folder with tweaked files repsect only module folder
         * @example {tweakedAnimationFilesPath}\\{moduleName}\\*.hkx(tweaked animation files)
         */
        tweakedAnimationFilesPath: string
    }
}

export interface PackModuleConfig extends ModuleSpecificConfig, CommonConfig {}

/**
 * Combined pack config
 */
export interface PackFullConfig extends PackConfig {
    modules: ModuleSpecificConfig[]
}