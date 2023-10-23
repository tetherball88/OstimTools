import { KlayLayoutOptions } from "cytoscape-klay";
import { useMemo } from "react";
import { useSavePositions } from "~explorer/ui/utils/useSavePositions";

export const useInitialLayout = () => {
    const savePositions = useSavePositions()
    return useMemo<KlayLayoutOptions>(() => ({
        name: 'klay',
        klay: {
            direction: 'UNDEFINED',
            aspectRatio: 0.5,
            thoroughness: 50,
            spacing: 100,
            edgeSpacingFactor: 1
        },
        nodeDimensionsIncludeLabels: true,
        fit: true, // whether to fit the viewport to the graph
        boundingBox: { x1: 0, y1: 0, x2: 6000, y2: 3000 }, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        stop: async (e) => {
            await savePositions(e.cy);
        }
    }), [])
}