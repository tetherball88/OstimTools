import { NodeSingular, Position } from "cytoscape"

export const getOriginalPosition = (elem: NodeSingular): Position => {
    return ({ ...elem.data('originalPosition') })
}