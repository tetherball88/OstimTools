import { usePanByMiddleMouse } from './panByMiddleMouse/usePanByMiddleMouse';
import { useRegisterAllEvents } from './../registerEvents';
import { EdgeSingular, NodeSingular } from "cytoscape";
import { useTooltip } from "~explorer/ui/graph/services/tooltip/useTooltip";
import { useNodeContextMenu } from '~explorer/ui/graph/services/contextMenu/useNodeContextMenu';
import { useGlobalContextMenu } from '~explorer/ui/graph/services/contextMenu/useGlobalContextMenu';
import { useEdgeContextMenu } from '~explorer/ui/graph/services/contextMenu/useEdgeContextMenu';
import { useCallback } from 'react';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';
import { useGroupContextMenu } from '~explorer/ui/graph/services/contextMenu/useGroupContextMenu';
import { useFocus } from '~explorer/ui/graph/services/focus/useFocus';
import { useCdnd } from '~explorer/ui/graph/services/useCdnd/useCdnd';

export const useGraphInteractions = () => {
    const sceneMaps = useExplorerState(state => state.scenesMap)

    useNodeContextMenu();
    useGlobalContextMenu();
    useEdgeContextMenu();
    useGroupContextMenu();

    const renderNodeTooltip = useCallback((ele: NodeSingular) => {
        const scene = sceneMaps[ele.id()];
        return `
        <div>name: ${scene?.name}</div>
        <div>modpack: ${scene?.modpack}</div>
        `
    }, [sceneMaps])

    usePanByMiddleMouse()

    useTooltip('node:childless', renderNodeTooltip)
    useTooltip('edge', (ele: EdgeSingular) => {
        const sourceScene = ele.source().id();
        const targetScene = ele.target().id();
        const type = ele.data('type')
        return `
        <div>type: ${type}</div>
        <div>origin: ${sourceScene}</div>
        <div>destination: ${targetScene}</div>
        `
    })

    useFocus();

    useCdnd()

    useRegisterAllEvents()
}