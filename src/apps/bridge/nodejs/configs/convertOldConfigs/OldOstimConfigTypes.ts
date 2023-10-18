import { FurnitureTypes } from "~bridge/types"

/**
 * Object represents actor configuration in ostim json config
 * all these properties will be rendered in scene xml file for each actor
 */
export interface OstimConfigAnimationActor {
    [key: string]: string | undefined
    position: string
    feetOnGround: string
    tags: string,
    scale: string,
    gender: 'male' | 'female'
    penisAngle?: string
    lookUp?: string
    lookLeft?: string
}

/**
 * Scene meta configuration, all properties will be rendered in scene xml file in meta tag
 */
export interface OstimConfigAnimationMeta {
    [key: string]: string | undefined
    tags: string
    furniture?: FurnitureTypes
    noRandomSelection?: string
}

/**
 * Object to represent ostim xml properties for tag action
 */
export interface OstimConfigAnimationAction {
    [key: string]: string | undefined
    type: string
    actor: string
    target?: string
    performer?: string
}

/**
 * In slal there is term stage, each animation series have multiple stages which can be quite different in terms of actions/speed etc
 * This object represents all needed information to create scene xml file
 */
export interface OstimConfigAnimationStage {
    actors: OstimConfigAnimationActor[]
    meta: OstimConfigAnimationMeta
    id: string
    fileName: string
    actions: OstimConfigAnimationAction[]
}

/**
 * Additional information to not parse each time path and get all this info. Instead of it store it in config
 */
export interface OstimConfigAnimationFolders {
    moduleName: string
    posFolderName: string
    classFolderName: string
    animName: string
}

/**
 * Full object represents whole animation serie with multiple stages
 */
export interface OstimConfigAnimation {
    /**
     * animation name
     */
    name: string
    /**
     * keyword represents what set of actors it uses: fm, ffm, ff, fmm, etc...
     */
    actorsKeyword: string
    stages: OstimConfigAnimationStage[]
    folders: OstimConfigAnimationFolders
}

export interface OstimConfig {
    [key: string]: OstimConfigAnimation
}