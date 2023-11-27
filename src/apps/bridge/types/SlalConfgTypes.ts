import { AnimObjectsActor } from "~bridge/nodejs/configs/readObjects/AnimObjects"

export interface SlalConfigAnimationStage {
    id: string
    silent?: boolean
    sos: number
}

export interface SlalConfigAnimationActor {
    stages: SlalConfigAnimationStage[],
    type: 'Female' | 'Male'
}
export interface SlalConfigAnimation {
    actors: SlalConfigAnimationActor[],
    id: string
    name?: string
    sound?: string
    tags?: string
}

export interface SlalConfig {
    animations: SlalConfigAnimation[]
}

export interface ParsedSlalConfigActor {
    gender: 'male' | 'female'
    objects?: AnimObjectsActor
}

export interface ParsedSlalConfigStage {
    actors: ParsedSlalConfigActor[]   
}

export interface ParsedSlalConfigAnimation {
    tags: SlalConfigAnimation['tags']
    name: SlalConfigAnimation['name']
    stages: ParsedSlalConfigStage[]
    actorsKeyword: string
}

export interface ParsedSlalConfig {
    [key: string]: ParsedSlalConfigAnimation
}