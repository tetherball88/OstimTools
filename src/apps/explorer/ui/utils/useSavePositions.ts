import { Core } from 'cytoscape';
import { useSendCommand } from '~explorer/ui/hooks/useSendCommand';
import { EXPLORER_WRITE_POSITIONS } from '~explorer/events/events';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';
export const useSavePositions = () => {
    const sendCommand = useSendCommand();
    const selectedModId = useExplorerState(state => state.selectedModId)

    return async (cy: Core) => {
        const positions = (cy.json() as any).elements.nodes.map((n: any) => {
            return {
                data: {
                    id: n.data.id,
                },
                position: n.position
            };
        });

        if(selectedModId) {
            await sendCommand(EXPLORER_WRITE_POSITIONS, 'Writing scenes positions on screen...', selectedModId, positions);
        }
        
        cy.elements().forEach(elem => {
            elem.data('originalPosition', { ...elem.position() });
        });
    }
    
}