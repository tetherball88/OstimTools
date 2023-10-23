import cytoscape, { CytoscapeOptions, use } from "cytoscape";
import { FC, useEffect, useRef } from "react";

import cxtmenu from 'cytoscape-cxtmenu';
// @ts-ignore
import autopanOnDrag from 'cytoscape-autopan-on-drag';
import popper from 'cytoscape-popper';
// @ts-ignore
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';
import klay from 'cytoscape-klay';

import { useExplorerState } from "~explorer/ui/state/ExplorerState";

use(compoundDragAndDrop);
use(klay)
use(cxtmenu);
use(popper);
autopanOnDrag(cytoscape);

export const CytoscapeComponent: FC<CytoscapeOptions> = (props) => {
    const selectedModId = useExplorerState(state => state.selectedModId)
    const containerRef = useRef<HTMLDivElement>(null);
    const setCy = useExplorerState(state => state.setCy)


    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const cyOrig = cytoscape({
            container: containerRef.current,
            ...props
        });

        (cyOrig as any).autopanOnDrag({
            enabled: true,
            selector: 'node',
            speed: 1
        })

        // @ts-ignore
        cyOrig.compoundDragAndDrop({
            newParentNode: () => {
                return { data: { label: '' } }
            },
            boundingBoxOptions: {
                includeOverlays: false,
                includeLabels: true
            },
            overThreshold: 30,
            outThreshold: 200
        })
        setCy(cyOrig);

        return () => {
            cyOrig.destroy();
            setCy(null);
        }
    }, [props, selectedModId])

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', }} />
    )

}