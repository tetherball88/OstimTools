import { OstimConfigAnimation } from "./OstimConfigTypes"

export interface AnimationGroupSiblingHub {
    lessMHubName?: string
    lessFHubName?: string
    moreMHubName?: string
    moreFHubName?: string
}

export interface AnimationGroup {
    name: string
    actorsKeyword: string
    furniture?: string
    siblingHub: AnimationGroupSiblingHub
    animations: OstimConfigAnimation[]
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
