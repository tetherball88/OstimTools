/**
 * Part of config which you don't need to update
 * it uses properties from other modder localized properties or module specific properties
 */
export interface CommonConfig {
    /**
     * builds full path for tweaked animation files {tweakedAnimationFilesPath}\\{moduleName}
     */
    overwriteTweakedAnimationsPath: string
    /**
     * builds file name for scene configs per module
     */
    scenesJsonConfigFilename: string
    /**
     * builds fnis txt file name per module
     */
    fnisTxtFileName: string
    /**
     * builds full path for output fnix txt file
     */
    outputFnisBehaviorTxt: string
    /**
     * builds fnis hkx file name per module
     */
    fnisHkxFileName: string
    /**
     * builds full path for output fnix hkx file
     */
    outputFnisBehaviorHkx: string
    /**
     * builds full path for output hkx files
     */
    outputAnimPath: string
    /**
     * builds full path for output scene xml files
     */
    outputScenePath: string
    /**
     * builds full path for output hubs xml files
     */
    outputHubScenePath: string
    /**
     * builds full path for this script folder + folder for scenes json config files
     */
    outputScenesJsonConfigPath: string
    /**
     * builds hub id per module
     */
    hubIdPath: string
    /**
     * A map of back button from pack hubs to Addon Hub 
     * https://www.nexusmods.com/skyrimspecialedition/mods/81679
     */
    backToAddonHub: Record<string, string>
}