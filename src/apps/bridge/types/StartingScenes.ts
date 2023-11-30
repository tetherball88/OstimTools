import { FurnitureTypes } from "~bridge/types"
import { OstimScene, OstimSceneSpeed } from "~common/shared/types/OstimScene"

export type StartingScene = {
    name: string,
    actorsKeyword: string,
    furniture?: FurnitureTypes
    length: number,
	speeds: OstimSceneSpeed[],
    actors: OstimScene['actors'],
    icon?: string
}

export type StartingScenesConfig = {
    sources: string[]
    scenes: StartingScene[]
}