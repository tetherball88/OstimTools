import { FurnitureTypes } from "~bridge/types"
import { OstimSceneActor, OstimSceneSpeed } from "~common/shared/types/OstimScene"

export type DefaultOrigin = {
    name: string,
    actorsKeyword: string,
    furniture?: FurnitureTypes
    length: number,
	speeds: OstimSceneSpeed[],
    actors: OstimSceneActor[]
}