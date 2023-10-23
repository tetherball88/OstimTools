import { Stylesheet } from "cytoscape";

export const searchStyle: Stylesheet[] = [
    {
        selector: 'node.found',
        style: {
            'min-zoomed-font-size': 0,
            'z-index': 9999,
        }
    }
]