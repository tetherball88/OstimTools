import { StartingScene } from "~bridge/types/StartingScenes"
import { OstimConfigAnimation } from "./OstimConfigTypes"
import { FurnitureTypes } from "~bridge/types/FurnitureTypes"

export interface AnimationGroupSiblingHub {
    lessMHubName?: string
    lessFHubName?: string
    moreMHubName?: string
    moreFHubName?: string
}

export interface AnimationGroup {
    name: string
    animations: (OstimConfigAnimation | AnimationGroup)[]
    origin: StartingScene
    folderName: string
    furniture?: FurnitureTypes
}

export interface HubNav {
    curr: string
    inviteF: string | null
    inviteM: string | null
    dismiss: string | null
}

export type RecordValueType<R extends Record<string, any>> = R[keyof R];

export type AnimationFromModule = Record<string, {
    name: string, actors: number, stages: number
}>
