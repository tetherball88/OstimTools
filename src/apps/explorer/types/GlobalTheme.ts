export interface ColorProps {
    /**
     * Color for outline text if present
     * @TJS-format color
     */
    'text-outline-color': string
    /**
     * Edge's line and arrow color
     * @TJS-format color
     */
    'line-color': string
    /**
     * ???
     * @TJS-format color
     */
    'overlay-color': string
    /**
     * Node's background color
     * @TJS-format color
     */
    'background-color': string
    /**
     * Node's border color
     * @TJS-format color
     */
    'border-color': string
    /**
     * Node's text color
     * @TJS-format color
     */
    'color': string
}

/**
 * @title Global colors
 */
export interface GlobalTheme {
    /**
     * @title Core colors
     */
    core: {
        'core': Pick<ColorProps, 'background-color'>
    }
    /**
     * @title Colors for edges
     */
    edges: {
        /**
        * @title Regular edge
        */
        edge: Pick<ColorProps, 'text-outline-color' | 'line-color'>
        /**
         * @title Transition with "origin"
         */
        'edge[type = "transOrigin"]': Pick<ColorProps, 'line-color'>
        /**
         * @title Transition with "destination"
         */
        'edge[type = "transDestination"]': Pick<ColorProps, 'line-color'>
        /**
         * @title Nav item with "origin"
         */
        'edge[type = "navOrigin"]': Pick<ColorProps, 'line-color'>
        /**
         * @title Nav item with "destination"
         */
        'edge[type = "navDestination"]': Pick<ColorProps, 'line-color'>
        /**
         * @title Actor's auto transition
         */
        'edge[type = "autoTransActor"]': Pick<ColorProps, 'line-color'>
        /**
         * @title Scene's auto transition
         */
        'edge[type = "autoTrans"]': Pick<ColorProps, 'line-color'>
    }
    /**
     * @title Colors for nodes
     */
    nodes: {
        /**
         * @title Regular node
         */
        node: Pick<ColorProps, 'text-outline-color' | 'overlay-color' | 'background-color' | 'color'>
        /**
         * @title Selected node
         */
        'node:childless:selected': Pick<ColorProps, 'border-color'>
        /**
         * @title Group node
         */
        'node:parent': Pick<ColorProps, 'background-color' | 'border-color' | 'color' | 'text-outline-color'>
        /**
         * @title Selected group node
         */
        'node:parent:selected': Pick<ColorProps, 'border-color'>
        /**
         * @title Filtered nodes
         */
        'node.found': Pick<ColorProps, 'background-color'>
        /**
         * @title Missing node
         */
        'node[?missingNode]': Pick<ColorProps, 'background-color'>
    }
}
