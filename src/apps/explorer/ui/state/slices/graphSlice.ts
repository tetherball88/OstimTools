import { Core } from "cytoscape"
import { StateCreator } from "zustand"
import { OstimScene } from "~common/shared/types/OstimScene"
import { Filters } from "~explorer/types/Filters"
import { GroupGraphNode, ScenesGraphEdge, ScenesGraphNode } from "~explorer/ui/graph/buildScenesGraphData"

export interface GraphSliceState {
    cy: Core | null
    nodes: (ScenesGraphNode | GroupGraphNode)[]
    edges: ScenesGraphEdge[]
    drawingMode: boolean
    scenesMap: Record<string, OstimScene>
    filters: Filters
    setCy: (cy: Core | null) => void
    setNodes: (nodes: (ScenesGraphNode | GroupGraphNode)[]) => void
    setEdges: (edges: ScenesGraphEdge[]) => void
    setDrawingMode: (drawing: boolean) => void
    setScenesMap: (scenesMap: Record<string, OstimScene>) => void
    setFilters: (filters: Filters) => void
}

export const graphSlice: StateCreator<GraphSliceState> = (set) => ({
    cy: null,
    nodes: [],
    edges: [],
    drawingMode: false,
    scenesMap: {},
    filters: {
        bySceneName: '',
        bySceneId: '',
        bySceneTags: [],
        byActorTags: [],
        byActions: []
    },
    setCy: (cy) => set(state => ({
        ...state,
        cy
    })),
    setNodes: (nodes) => set(state => ({
        ...state,
        nodes
    })),
    setEdges: (edges) => set(state => ({
        ...state,
        edges
    })),
    setDrawingMode: (drawing) => set(state => ({
        ...state,
        drawingMode: drawing
    })),
    setScenesMap: (scenesMap) => set(state => ({
        ...state,
        scenesMap
    })),
    setFilters: (filters) => set(state => ({
        ...state,
        filters
    })),
})