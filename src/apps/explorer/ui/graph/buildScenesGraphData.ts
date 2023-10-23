import { ExplorerOstimScene } from '~explorer/nodejs/readScenes';
import { OstimScene } from '~common/shared/types/OstimScene';
import { PositionsConfig } from '~explorer/types/PositionsConfig';
import { ModEdgesConfig, ModGroupsConfig } from '~explorer/types/ModsConfig';
import { ElementDefinition } from 'cytoscape';

export type ExplorerNavTypes = 'transOrigin' | 'transDestination' | 'navOrigin' | 'navDestination' | 'autoTransActor' | 'autoTrans'

export interface ExplorerEdgeCommon {
    id: string
    source: string,
    target: string,
    type: ExplorerNavTypes
    label: string
}

export interface ExplorerEdgeAutoTrans extends ExplorerEdgeCommon {
    type: 'autoTrans',
    autoTransKey: string
}

export interface ExplorerEdgeAutoTransActor extends ExplorerEdgeCommon {
    type: 'autoTransActor'
    autoTransKey: string
    actorIndex: number
}

export type ExplorerEdge = ExplorerEdgeCommon | ExplorerEdgeAutoTrans | ExplorerEdgeAutoTransActor

export type ScenesGraphEdge = {
    data: ExplorerEdge
    classes?: ElementDefinition['classes']
}

export interface GroupGraphNode {
    data: {
        id: string,
        label: string,
        isGroup: boolean,
    }
}

export interface ScenesGraphNode {
    data: {
        label: string
        id: string,
        parent?: string | null,
        missingNode?: boolean
        originalPosition?: {
            x: number,
            y: number,
        },
        explorerScene: ExplorerOstimScene | null
    }
    position?: {
        x: number,
        y: number,
    }
}

const addPosition = (node: ScenesGraphNode, positions: PositionsConfig | null): ScenesGraphNode => {
    const found = positions?.find(({ data: { id } }) => id === node.data.id);
    const position = found?.position

    node.data.originalPosition = position ? { ...position } : undefined;
    node.position = position;
    
    return node;
}

export const buildScenesGraphNode = (scene: ExplorerOstimScene, positions: PositionsConfig | null): ScenesGraphNode => {
    return addPosition({
        data: {
            label: scene.fileName,
            id: scene.fileName,
            explorerScene: scene
        },
    }, positions)
}

export const buildScenesGraphEmptyNode = (id: string, positions: PositionsConfig | null): ScenesGraphNode => addPosition({
    data: {
        label: id,
        id,
        missingNode: true,
        parent: 'external',
        explorerScene: null
    }
}, positions)

export const buildEdgeId = (edge: Omit<ScenesGraphEdge['data'], 'id'>) => {
    return `${edge.source}-${edge.target}-${edge.type}-${edge.label}`;
}

export const buildScenesGraphEdge = (scene: ExplorerOstimScene, edgesData: ModEdgesConfig): ScenesGraphEdge[] => {
    const edges: ScenesGraphEdge[] = []
    if ('origin' in scene.content) {
        const newEdge: { data: Omit<ScenesGraphEdge['data'], 'id'> } = {
            data: {
                source: scene.content.origin,
                target: scene.fileName,
                label: 'Scene transition',
                type: 'transOrigin'
            }
        }
        const id = buildEdgeId(newEdge.data);

        edges.push({
            data: {
                ...newEdge.data,
                id,
            },
            ...(edgesData[id]?.classes?.length ? { classes: edgesData[id]?.classes } : {})
        })
    } else if ('destination' in scene.content) {
        const newEdge: { data: Omit<ScenesGraphEdge['data'], 'id'> } = {
            data: {
                source: scene.fileName,
                target: scene.content.destination,
                label: 'Scene transition',
                type: 'transDestination'
            },
        }
        const id = buildEdgeId(newEdge.data);

        edges.push({
            data: {
                ...newEdge.data,
                id,
            },
            ...(edgesData[id]?.classes?.length ? { classes: edgesData[id]?.classes } : {})
        })
    } else if ('navigations' in scene.content) {
        const navigationEdges = scene.content.navigations.map<ScenesGraphEdge>(nav => {
            if ('origin' in nav) {
                const newEdge: { data: Omit<ScenesGraphEdge['data'], 'id'> } = {
                    data: {
                        source: nav.origin,
                        target: scene.fileName,
                        label: nav.description,
                        type: 'navOrigin'
                    }
                }
                const id = buildEdgeId(newEdge.data);
                return {
                    data: {
                        ...newEdge.data,
                        id,
                    },
                    ...(edgesData[id]?.classes?.length ? { classes: edgesData[id]?.classes } : {})
                }
            } else {
                const newEdge: { data: Omit<ScenesGraphEdge['data'], 'id'> } = {
                    data: {
                        source: scene.fileName,
                        target: nav.destination,
                        label: nav.description,
                        type: 'navDestination'
                    }
                }
                const id = buildEdgeId(newEdge.data);
                return {
                    data: {
                        ...newEdge.data,
                        id,
                    },
                    ...(edgesData[id]?.classes?.length ? { classes: edgesData[id]?.classes } : {})
                }
            }
        })

        edges.push(...navigationEdges)
    } 
    
    if (scene.content.autoTransitions) {
        const res: ScenesGraphEdge[] = []
        Object.keys(scene.content.autoTransitions).forEach(autoTransKey => {
            const destination = scene.content.autoTransitions?.[autoTransKey]
            if(!destination) {
                return
            }

            const newEdge: { data: Omit<ExplorerEdgeAutoTrans, 'id'> } = {
                data: {
                    source: scene.fileName,
                    target: destination,
                    type: 'autoTrans',
                    autoTransKey,
                    label: `Scene auto transition: ${autoTransKey}`
                }
            }
            const id = buildEdgeId(newEdge.data);
    
            res.push({
                data: {
                    ...newEdge.data,
                    id,
                },
                ...(edgesData[id]?.classes?.length ? { classes: edgesData[id]?.classes } : {})
            })
        })
        edges.push(...res)
    }
    
    if (scene.content.actors) {
        const res: ScenesGraphEdge[] = []
        scene.content.actors.forEach((actor, actorIndex) => {
            const actorAutoTrans = actor.autoTransitions
            if (actorAutoTrans) {
                Object.keys(actorAutoTrans).forEach(autoTransKey => {
                    const destination = actorAutoTrans[autoTransKey]
                    if(!destination) {
                        return
                    }

                    const newEdge: { data: Omit<ExplorerEdgeAutoTransActor, 'id'> } = {
                        data: {
                            source: scene.fileName,
                            target: destination,
                            type: 'autoTransActor',
                            autoTransKey,
                            actorIndex,
                            label: `Actor ${actorIndex} auto transition: ${autoTransKey}`
                        }
                    }
                    const id = buildEdgeId(newEdge.data);
            
                    res.push({
                        data: {
                            ...newEdge.data,
                            id,
                        },
                        ...(edgesData[id]?.classes?.length ? { classes: edgesData[id]?.classes } : {})
                    })
                })
            }
        })
        edges.push(...res)
    }

    return edges
}

export const buildNodesAndEdges = (scenes: ExplorerOstimScene[], positions: PositionsConfig | null, groups: ModGroupsConfig, edgesData: ModEdgesConfig) => {
    const edges: ScenesGraphEdge[] = []
    const scenesMap: Record<string, OstimScene> = {}
    const modPaths = new Set<string>()
    const nodes: (ScenesGraphNode | GroupGraphNode)[] = []

    scenes.forEach(scene => {
        scenesMap[scene.fileName] = scene.content
        modPaths.add(scene.modPath);
        nodes.push(buildScenesGraphNode(scene, positions));
        const sceneEdges = buildScenesGraphEdge(scene, edgesData)
        
        edges.push(...sceneEdges);        
    })

    let needExternal = false

    for(const edge of edges) {
        const { source, target } = edge.data

        if(!scenesMap[source]) {
            nodes.push(buildScenesGraphEmptyNode(source, positions))
            needExternal = true
        }

        if(!scenesMap[target]) {
            nodes.push(buildScenesGraphEmptyNode(target, positions))
            needExternal = true
        }
    }

    for (const parentId of Object.keys(groups)) {
        const group = groups[parentId]
        const addExternal = parentId === 'external' && needExternal

        if(!group.children.length && !addExternal) {
            continue;
        }
        
        nodes.push({
            data: {
                id: parentId,
                label: group.name,
                isGroup: true
            }
        })

        group.children.forEach(childId => {
            const child = nodes.find(({ data: { id } }) => id === childId) as ScenesGraphNode
            if(child) {
                child.data.parent = parentId
            }
        })
    }

    return {
        edges,
        scenesMap,
        nodes
    }
}
