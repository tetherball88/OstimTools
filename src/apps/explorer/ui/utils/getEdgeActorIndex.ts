import { EdgeSingular } from 'cytoscape';
export const getEdgeActorIndex = (edge: EdgeSingular): number | undefined => {
    return edge.data('actorIndex');
}