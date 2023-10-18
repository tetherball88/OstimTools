import { FurnitureTypes } from "~bridge/types"
import { OstimSceneActor, OstimSceneSpeed } from "~bridge/types/OstimSAScene"

export type StartingScene = {
    name: string,
    actorsKeyword: string,
    furniture?: FurnitureTypes
    length: number,
	speeds: OstimSceneSpeed[],
    actors: OstimSceneActor[]
}

export type StartingScenesConfig = {
    sources: string[]
    scenes: StartingScene[]
}