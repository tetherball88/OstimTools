import { Stylesheet } from "cytoscape";

export const coreStyle: Stylesheet[] = [
    {
        selector: 'core',
        style: {
            'active-bg-opacity': 0.333,
        } as any
    },
    {
        selector: 'edge',
        style: {
            'font-size': '6',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'opacity': 1,
            'width': 2,
            'label': 'data(label)',
            'edge-text-rotation': 'autorotate',
            'text-outline-width': '1',
            'text-outline-color': '#fff',
        }
    },
    {
        selector: '.hidden-label',
        style: {
            'label': '',
        }
    },
    {
        selector: 'node',
        style: {
            'width': 'label',
            'font-size': '9',
            'font-weight': 'bold',
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '50',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-events': 'yes',
            'color': '#000',
            'text-outline-width': '1',
            'text-outline-opacity': 1,
            'shape': 'round-rectangle',
            'padding-top': '5',
            'padding-bottom': '5',
            'padding-left': '10',
            'padding-right': '10'
        }
    },
    {
        selector: 'node:childless:selected',
        style: {
            'border-width': 2,
            "border-color": 'green',
        }
    },
    {
        selector: 'node:parent',
        style: {
            'text-max-width': '999999',
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': '2',
            'padding-top': '25',
            'padding-bottom': '25',
            'padding-left': '25',
            'padding-right': '25',
            'text-opacity': 1,
            'text-outline-opacity': 1,
        }
    },
    {
        selector: 'edge.hover',
        style: {
            "z-index": 2,
            'width': 3,
            'line-style': 'dashed',
        }
    },
    {
        selector: '.manual-hidden',
        style: {
            'display': 'none',
        }
    },
    {
        selector: '.manual-hidden.tmp-shown',
        style: {
            'display': 'element',
            'opacity': 0.5
        }
    },
    {
        selector: '.hidden',
        style: {
            'display': 'none',
        }
    },
    
]