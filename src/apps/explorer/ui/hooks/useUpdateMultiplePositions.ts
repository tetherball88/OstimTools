import { NodeSingular } from 'cytoscape';
import { EXPLORER_ADD_OR_UPDATE_POSITIONS } from '~explorer/events/events';
import { PositionsConfigItem } from "~explorer/types/PositionsConfig";
import { useSendCommand } from '~explorer/ui/hooks/useSendCommand';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';

export const useUpdateMultiplePositions = () => {
    const sendCommand = useSendCommand()
    const modId = useExplorerState(state => state.selectedModId)
    
    return async (nodes: NodeSingular[]) => {
        if(!modId) {
            return;
        }
        const positions: PositionsConfigItem[] = nodes.map((n) => ({
            data: { id: n.data('id') },
            position: n.position(),
        }))
        
        await sendCommand(EXPLORER_ADD_OR_UPDATE_POSITIONS, `Updating positions...`, modId, positions)
    }
    
}