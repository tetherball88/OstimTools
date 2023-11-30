import { readJson, writeJson } from "../../../../../common/nodejs/utils";
import { OstimConfig as NewOstimConfig, OstimConfigAnimation, OstimConfigAnimationStage } from "../../../types";
import { OstimConfig as OldOstimConfig } from "./OldOstimConfigTypes";

export const convertOldOstimConfig = async (configPath: string): Promise<NewOstimConfig> => {
    const oldOstimConfig = await readJson(configPath) as OldOstimConfig
    if(!oldOstimConfig) {
        throw new Error(`No config were found by this path: ${configPath}`)
    }
    const newConfig: NewOstimConfig = {}
    for(const [animName, animConfig] of Object.entries(oldOstimConfig)) {
        const newAnimConfig: OstimConfigAnimation = newConfig[animName] = {
            name: animConfig.name,
            actorsKeyword: animConfig.actorsKeyword,
            stages: [],
            folders: {
                moduleName: animConfig.folders.moduleName,
                posFolderName: animConfig.folders.posFolderName,
                animName: animConfig.folders.animName
            },
        } as any

        for(const [stageIndex, stage] of animConfig.stages.entries()) {
            const newStage: OstimConfigAnimationStage = newAnimConfig.stages[stageIndex] = {
                actors: [],
                meta: {
                    tags: stage.meta.tags?.length ? stage.meta.tags.split(',') : [],
                    ...(stage.meta.furniture ? { furniture: stage.meta.furniture } : {}),
                    ...(stage.meta.noRandomSelection ? { noRandomSelection: stage.meta.noRandomSelection === 'true' } : {})
                },
                id: stage.id.split('|').reverse()[0],
                fileName: stage.fileName.split('-').reverse()[0],
                actions: []
            }

            for(const [actorIndex, actor] of stage.actors.entries()) {
                newStage.actors[actorIndex] = {
                    intendedSex: actor.gender,
                    ...(actor.penisAngle ? {  sosBend: Number(actor.penisAngle) as any } : {}),
                    scale: Number(actor.scale),
                    feetOnGround: actor.feetOnGround === '1',
                    tags: actor.tags?.length ? actor.tags.split(','): [],
                }

                if(actor.lookUp) {
                    if(actor.lookUp.includes('-')) {
                        newStage.actors[actorIndex].lookDown = Math.abs(Number(actor.lookUp))
                    } else {
                        newStage.actors[actorIndex].lookUp = Number(actor.lookUp)
                    }
                }

                if(actor.lookLeft) {
                    if(actor.lookLeft.includes('-')) {
                        newStage.actors[actorIndex].lookRight = Math.abs(Number(actor.lookLeft))
                    } else {
                        newStage.actors[actorIndex].lookLeft = Number(actor.lookLeft)
                    }
                }
                

            }

            for(const [actionIndex, action] of stage.actions?.entries() || []) {
                newStage.actions[actionIndex] = {
                    type: action.type,
                    ...(action.actor ? { actor: Number(action.actor) } : { actor: 0 }),
                    ...(action.target ? { target: Number(action.target) } : {}),
                    ...(action.performer ? { performer: Number(action.performer) } : {}),
                }
            }
        }
    }

    await writeJson(configPath, newConfig)

    return newConfig
}
