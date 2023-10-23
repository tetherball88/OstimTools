import { Stylesheet } from "cytoscape";

export const focusStyle: Stylesheet[] = [
    {
        selector: 'node:childless.highlighted',
        style: {
            'min-zoomed-font-size': 0,
            'z-index': 9999,
        }
    },
    {
        selector: 'edge.highlighted',
        style: {
            'opacity': 1,
            'width': 2,
            'z-index': 9999,
        }
    },
    {
        selector: '.faded',
        style:  {
            'events': 'no',
        }
    },
    {
        selector: 'node:childless.faded',
        style: {
            'opacity': 0.2,
        }
    },
    {
        selector: 'edge.faded',
        style: {
            'opacity': 0.2,
        }
    },
]