import { CollectionReturnValue, EventHandler, NodeCollection, NodeSingular } from "cytoscape";
import { useCallback, useEffect, useRef, useState } from "react";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { getOriginalPosition } from "~explorer/ui/utils";

const layoutPadding = 10;
const animationDuration = 500;
const easing = 'ease';

export const useFocus = () => {
    const cy = useExplorerState(state => state.cy)
    const [enabled, setEnabled] = useState(true);
    const allElesRef = useRef<CollectionReturnValue>()
    const allNodesRef = useRef<NodeCollection>()
    const nhoodRef = useRef<CollectionReturnValue | null>(null);
    const othersRef = useRef<CollectionReturnValue | null>(null);
    const focusInProgressRef = useRef(false);

    const removeClasses = useCallback(() => {
        allElesRef.current?.removeClass('faded highlighted hidden');
    }, []);

    const zoomOut = useCallback(() => {
        const nhood = nhoodRef.current;
        if (!nhood || !cy) {
            return;
        }

        cy.batch(() => {
            removeClasses();

            nhood.addClass('highlighted');

            othersRef.current?.positions(getOriginalPosition);
        });

        const layout = nhood.layout({
            name: 'preset',
            fit: true,
            positions: getOriginalPosition,
            animate: true,
            animationDuration: animationDuration,
            animationEasing: easing,
            padding: layoutPadding
        } as any);

        layout.run();

        return layout.promiseOn('layoutstop');
    }, [cy])

    const showOthersFaded = useCallback(() => {
        if (!cy) {
            return
        }

        cy.batch(() => {
            othersRef.current?.removeClass('hidden').addClass('faded');
        });
    }, [cy]);

    const zoomIn = useCallback((target: NodeSingular) => {
        const pos = target.position();
        const nhood = nhoodRef.current

        if (!nhood) {
            return Promise.resolve();
        }

        const layout = nhood.layout({
            name: 'concentric',
            fit: true,
            animate: true,
            animationDuration: animationDuration,
            animationEasing: easing,
            boundingBox: { x1: pos.x, x2: pos.x, y1: pos.y, y2: pos.y },
            avoidOverlap: true,
            minNodeSpacing: 50,
            concentric: (ele: any) => ele.same(target) ? 2 : 1,
            levelWidth: () => { return 1; },
        });

        const promise = layout.promiseOn('layoutstop');

        layout.run();

        return promise;
    }, [])

    const focusOnScene = useCallback(async (target: NodeSingular) => {
        if (focusInProgressRef.current) {
            return;
        }

        focusInProgressRef.current = true;
        const nhood = nhoodRef.current = target.closedNeighborhood();
        othersRef.current = allElesRef.current?.not(nhood) || null;

        await zoomOut()
        await zoomIn(target)
        showOthersFaded()
        focusInProgressRef.current = false;
    }, [showOthersFaded, zoomOut, zoomIn])

    const resetClasses = useCallback(() => {
        if (!cy) {
            return
        }
        cy.batch(() => {
            removeClasses();
        });

        cy.animate({
            fit: {
                eles: '*',
                padding: 0
            },
            duration: 500
        })
    }, [cy])

    const animateToOrgPos = useCallback(async () => {
        return Promise.all(nhoodRef.current?.nodes().map(n => {
            return n.animation({
                position: {
                    x: getOriginalPosition(n).x,
                    y: getOriginalPosition(n).y,
                },
            } as any).play().promise();
        }) || []);
    }, [])

    const restorePositions = useCallback(() => {
        if (!cy) {
            return;
        }

        cy.batch(() => {
            othersRef.current?.nodes().positions(getOriginalPosition);
        });

        return animateToOrgPos();
    }, [cy])

    const blurFromScene = useCallback(async () => {
        const nhood = nhoodRef.current
        if (!nhood || !cy) { return Promise.resolve(); }

        cy.stop();
        allNodesRef.current?.stop();

        await restorePositions()
        resetClasses()

        nhoodRef.current = othersRef.current = null;
    }, [restorePositions, resetClasses])

    const onTap = useCallback<EventHandler>((e) => {
        if (!enabled || typeof e.target?.isEdge === 'function' && e.target?.isEdge() || !cy) {
            return;
        }

        if (e.target === cy || e.target.isParent()) {
            blurFromScene();
        } else {
            allElesRef.current = cy.elements('node:childless,edge');
            allNodesRef.current = cy.nodes('node:childless');
            focusOnScene(e.target);
        }
    }, [cy, enabled, blurFromScene, focusOnScene])



    useEffect(() => {
        if (!cy) {
            return
        }
        cy.on('dbltap', onTap);

        return () => {
            cy.off('dbltap', onTap);
        }
    }, [cy])

    return {
        enable: () => setEnabled(true),
        disable: () => setEnabled(false),
    }
}