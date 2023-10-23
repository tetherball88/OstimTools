import { useEffect } from 'react';
import { EventObject, NodeSingular } from "cytoscape";
import { useUpdateMultiplePositions } from '~explorer/ui/hooks/useUpdateMultiplePositions';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';

export const useRegisterAllEvents = () => {
    const cy = useExplorerState(state => state.cy)
    const updateMultiplePositions = useUpdateMultiplePositions()
    
    const dragNodes = (e: EventObject) => {
        if(!cy) {
            return
        }
        
        const elements: NodeSingular[] = []
        let selected = cy.nodes(':selected').toArray();

        if (!selected.length) {
            selected = [e.target]
        }

        selected.forEach(selectedNode => {
            if(selectedNode.isParent()) {
                elements.push(...selectedNode.children().toArray())
            } else {
                elements.push(selectedNode)
            }
        })

        updateMultiplePositions(elements)
    }


    useEffect(() => {
        if(!cy) {
            return
        }
        
        cy.on('dragfreeon', 'node', dragNodes);

        return () => {
            cy.off('dragfreeon', 'node', dragNodes);
        }
    }, [cy])
}