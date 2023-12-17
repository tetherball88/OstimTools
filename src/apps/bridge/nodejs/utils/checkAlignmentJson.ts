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
        const map: Partial<Record<keyof OstimAlignmentJsonActor, number>> = {}

        actorsLoop: for(const [, actor] of Object.entries(animation)) {
            for(const [propName, propValue] of Object.entries(actor)) {
                if(!propName.startsWith('offset') && propName !== 'rotation') {
                    continue
                }

                if(typeof map[propName as keyof OstimAlignmentJsonActor] === 'number' && map[propName as keyof OstimAlignmentJsonActor] !== actor[propName as keyof OstimAlignmentJsonActor]) {
                    actorsAlignmentSame = false
                    break actorsLoop;
                }

                map[propName as keyof OstimAlignmentJsonActor] = propValue
            }
        }

        for(const [propName, propValue] of Object.entries(map)) {
            if(propValue === 0) {
                delete map[propName as keyof OstimAlignmentJsonActor]
            }
        }

        if(actorsAlignmentSame) {
            sceneContent.offset = {
                ...(map.offsetX ? { x: map.offsetX } : {}),
                ...(map.offsetX ? { y: map.offsetY } : {}),
                ...(map.offsetX ? { z: map.offsetZ } : {}),
                ...(map.offsetX ? { r: map.rotation } : {}),
            }
        } else {
            for(const [actorIndex, actor] of Object.entries(animation)) {
                sceneContent.actors = sceneContent.actors || []
                sceneContent.actors[Number(actorIndex)].offset = {
                    ...(actor.offsetX ? { x: actor.offsetX } : {}),
                    ...(actor.offsetX ? { y: actor.offsetY } : {}),
                    ...(actor.offsetX ? { z: actor.offsetZ } : {}),
                    ...(actor.offsetX ? { r: actor.rotation } : {}),
                }
            }
        }

        
    }
}