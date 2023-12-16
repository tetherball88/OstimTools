import { AnimObjects, AnimObjectsActor } from "~bridge/nodejs/configs/readObjects/AnimObjects"
import { readObjectsFromBehavior } from "~bridge/nodejs/configs/readObjects/readObjectsFromBehavior"
import { readObjectsFromSource } from "~bridge/nodejs/configs/readObjects/readObjectsFromSource"
import { CombinedConfig } from "~bridge/types"
import { logger } from "~common/nodejs/utils"

export const readObjects = async (config: CombinedConfig, prefix: string, applyObjectsConfig = true) => {
    const {
        objects: configObjects
    } = config

    let objects: Record<string, AnimObjects> | null = null

    try {
        logger.log("Try parse objects from slal behavior txt file.")
        objects = await readObjectsFromSource(config, prefix)
    } catch(e) {
        logger.warn("Couldn't parse objects from behavior file.")
        logger.log("Another try parse objects from slal source config txt file.")
        try {
            objects = await readObjectsFromBehavior(config, prefix)
        } catch(e) {
            logger.error("Couldn't parse slal source config txt file either. Animations won't have objects")
            logger.log("Double check that you have either behavior txt file in folder with source hkx files or SLAnims\\source\\{name of pack}.txt")
        }
    }

    if(!objects) {
        return null
    }

    if(applyObjectsConfig && configObjects) {
        const { skipObjects, replaceObjects } = configObjects
        Object.entries(objects).forEach(([animName, animObjects]) => {
            const newAnimObjects = {...animObjects}
            Object.entries(newAnimObjects).forEach(([actorIndex, actorObjects]) => {
                const newActorObjects = actorObjects.map(({objects, ...other}) => {
                    let newObjects = [...objects]
                    // filter out skipped objects
                    if(skipObjects?.[animName]) {
                        newObjects = newObjects.filter((obj) => !skipObjects[animName]?.includes(obj))
                    }
    
                    if(!newObjects.length) {
                        return null
                    }
    
                    // use replace objects if provided replaceObjects config
                    if(replaceObjects?.[animName]) {
                        newObjects = newObjects.map((obj) => {
                            return replaceObjects[animName]?.[obj] || obj
                        })
                    }
                    
                    return {
                        ...other,
                        objects: newObjects
                    }
                }).filter(val => !!val) as AnimObjectsActor[]
    
                if(!newActorObjects.length) {
                    delete newAnimObjects[actorIndex]
                    return
                }
    
                newAnimObjects[actorIndex] = newActorObjects
            })
    
            if(!Object.keys(newAnimObjects).length) {
                delete objects?.[animName]
            }
    
            if(objects) {
                objects[animName] = newAnimObjects
            }
        })
    }

    return objects
}