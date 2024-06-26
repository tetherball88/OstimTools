import { OstimScene3DOffset, OstimSceneAction, OstimSceneActor } from "~common/shared/types/OstimScene"
import { FurnitureTypes } from "./FurnitureTypes"

/**
 * Scene meta configuration, all properties will be rendered in scene file in meta tag
 */
export interface OstimConfigAnimationMeta {
    tags?: string[]
    furniture?: FurnitureTypes
    noRandomSelection?: boolean
}

/**
 * In slal there is term stage, each animation series have multiple stages which can be quite different in terms of actions/speed etc
 * This object represents all needed information to create scene file
 */
export interface OstimConfigAnimationStage {
    actors: OstimSceneActor[]
    meta: OstimConfigAnimationMeta
    id: string
    fileName: string
    actions: OstimSceneAction[]
    noRandomSelection?: boolean
    offset?: OstimScene3DOffset
    length?: number
}

/**
 * Additional information to not parse each time path and get all this info. Instead of it store it in config
 */
export interface OstimConfigAnimationFolders {
    moduleName: string
    posFolderName: string
    animName: string
}

export interface HkxAnnoation {
    annotationLines: string | null
    duration: number
}

export interface OstimConfigSequenceScene {
    id: string
    duration: number
}

export interface OstimConfigSequence {
    scenes: OstimConfigSequenceScene[],
    tags: string[]
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
    hkxAnnotations?: Record<string, HkxAnnoation>
    sequence?: OstimConfigSequence
}

export interface OstimConfig {
    [key: string]: OstimConfigAnimation
}