/**
 * Part of config which you don't need to update
 * it uses properties from other modder localized properties or module specific properties
 */
export interface CommonConfig {
    /**
     * builds file name for scene configs per module
     */
    scenesJsonConfigFilename: string
    oldScenesJsonConfigFilename: string
    modulePath: string
    /**
     * builds nemesis anim list txt file name per module
     */
    nemesisTxtFileName: string
    /**
     * builds full path for output nemesis txt file
     */
    outputNemesisAnimlistTxt: string
    /**
     * builds full path for output hkx files
     */
    outputAnimPath: string
    /**
     * builds full path for output scene scene files
     */
    outputScenePath: string
    /**
     * builds full path for this script folder + folder for scenes json config files
     */
    outputScenesJsonConfigPath: string
    outputSequencePath: string
}