import { FurnitureTypes } from "~bridge/types"
import { OstimSceneActor, OstimSceneSpeed } from "~bridge/types/OstimSAScene"

export type DefaultOrigin = {
    name: string,
    actorsKeyword: string,
    furniture?: FurnitureTypes
    length: number,
	speeds: OstimSceneSpeed[],
    actors: OstimSceneActor[]
}