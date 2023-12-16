import { OstimScene } from "~common/shared/types/OstimScene";

type OstimAlignmentJsonActor = {
    offsetX: number
    offsetY: number
    offsetZ: number
    rotation: number
    scale: number
    sosBend: number
}

type OstimAlignmentJsonAnimation = Record<string, OstimAlignmentJsonActor>

type OstimAlignmentJsonGroup = Record<string, OstimAlignmentJsonAnimation>
export type OstimAlignmentJson = Record<string, OstimAlignmentJsonGroup>

export const checkAlignmentJson = async (stageName: string, sceneContent: OstimScene, alignmentContent: OstimAlignmentJson) => {
    for(const [, group] of Object.entries(alignmentContent)) {
        if(!group[stageName]) {
            continue
        }

        const animation = group[stageName]
        let actorsAlignmentSame = true
        const map: Record<string, number> = {}

        actorsLoop: for(const [, actor] of Object.entries(animation)) {
            for(const [propName, propValue] of Object.entries(actor)) {
                if(!propName.startsWith('offset') && propName !== 'rotation') {
                    continue
                }

                if(typeof map[propName] === 'number' && map[propName] !== actor[propName as keyof OstimAlignmentJsonActor]) {
                    actorsAlignmentSame = false
                    break actorsLoop;
                }

                map[propName] = propValue
            }
        }

        for(const [propName, propValue] of Object.entries(map)) {
            if(propValue === 0) {
                delete map[propName]
            }
        }

        if(actorsAlignmentSame) {
            sceneContent.offset = map
        } else {
            for(const [actorIndex, actor] of Object.entries(animation)) {
                sceneContent.actors = sceneContent.actors || []
                sceneContent.actors[Number(actorIndex)].offset = {
                    x: actor.offsetX,
                    y: actor.offsetY,
                    z: actor.offsetZ,
                    r: actor.rotation
                }
            }
        }

        
    }
}