import { ModsMetadata } from '~common/shared/types/ModsMetadata'
import schema from './ostimSceneJsonSchema.json'

const getObjByPath = <Obj extends Record<string, any>>(obj: Obj, path: string) => path.split('.').reduce((o, i) => o[i], obj)

const pathsToScenesObjects = ['OstimSceneWithNavigation', 'OstimSceneTransition'] as const
const actorPropsPath = (scenePath: typeof pathsToScenesObjects[number]) => `definitions.${scenePath}.properties.actors.items.properties`
const actionPropsPath = (scenePath: typeof pathsToScenesObjects[number]) => `definitions.${scenePath}.properties.actions.items.properties`
const scenePropsPath = (scenePath: typeof pathsToScenesObjects[number]) => `definitions.${scenePath}.properties`

export const getOstimSceneSchema = (metadata: ModsMetadata) => {
    schema.definitions['Record<string,string>'] = {
        "type": "object",
        "propertyNames": {
            "type": "string"
        },
        "additionalProperties": {
            "type": "string"
        }
    } as any


    pathsToScenesObjects.forEach(scenePath => {
        if (metadata.actorTags?.length) {
            const actorsProperties = getObjByPath(schema, actorPropsPath(scenePath))
            actorsProperties.tags = {
                ...actorsProperties.tags,
                anyOf: [
                    {
                        items: {
                            type: "string"
                        },
                        type: "array"
                    },
                    {
                        items: {
                            enum: metadata.actorTags.map(tag => tag.value),
                            type: "string"
                        },
                        type: "array"
                    }

                ],
            }

            delete actorsProperties.tags.items
        }

        if (metadata.sceneTags?.length) {
            const sceneProperties = getObjByPath(schema, scenePropsPath(scenePath))
            sceneProperties.tags = {
                ...sceneProperties.tags,
                anyOf: [
                    {
                        items: {
                            type: "string"
                        },
                        type: "array"
                    },
                    {
                        items: {
                            enum: metadata.sceneTags.map(tag => tag.value),
                            type: "string"
                        },
                        type: "array"
                    }

                ],
            }

            delete sceneProperties.tags.items
        }

        if (metadata.actions?.length) {
            const actionProperties = getObjByPath(schema, actionPropsPath(scenePath))
            actionProperties.type = {
                ...actionProperties.type,
                anyOf: [
                    {
                        type: "string"
                    },
                    {
                        enum: metadata.actions.map(action => action.value),
                        type: "string"
                    }

                ],
            }

            delete actionProperties.type.type
        }

        if (metadata.furnitures?.length) {
            const sceneProperties = getObjByPath(schema, scenePropsPath(scenePath))
            sceneProperties.furniture = {
                ...sceneProperties.furniture,
                anyOf: [
                    {
                        type: "string"
                    },
                    {
                        enum: metadata.furnitures.map(action => action.value),
                        type: "string"
                    }

                ],
            }

            delete sceneProperties.furniture.type
        }
    })

    return schema;
}