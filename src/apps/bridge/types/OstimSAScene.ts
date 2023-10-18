import { FurnitureTypes } from "~bridge/types/FurnitureTypes"

export interface OstimSceneNavigation {
    destination?: string
    origin?: string
    priority?: number
    description?: string
    icon?: string
    border?: string
    noWarnings?: boolean
}

export interface OstimSceneSpeed {
    animation: string
    playbackSpeed?: number
    displaySpeed?: number
}

export interface OstimSceneActor {
    /**
     * @default 'npc'
     */
    type?: string
    intendedSex: 'male' | 'female'
    sosBend?: number
    noStrip?: boolean
    scale?: number
    scaleHeight?: number
    animationIndex?: number
    expressionAction?: number
    expressionOverride?: string
    lookUp?: number
    lookDown?: number
    lookLeft?: number
    lookRight?: number
    tags?: string[]
    feetOnGround?: boolean
    autoTransitions?: Record<string, string>
}

export interface OstimSceneAction {
    type: string
    actor?: number
    target?: number
    performer?: number
}

export interface OstimScene {
    name?: string
    modpack?: string
    length?: number
    destination?: string
    origin?: string
    navigations?: OstimSceneNavigation[]
    speeds?: OstimSceneSpeed[]
    defaultSpeed?: number
    noRandomSelection?: boolean
    furniture?: FurnitureTypes
    tags?: string[]
    autoTransitions?: Record<string, string>
    actors?: OstimSceneActor[]
    actions?: OstimSceneAction[]
}