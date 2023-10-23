import { EventObject, SingularElementArgument } from "cytoscape";
import { getPopperInstance } from "cytoscape-popper";
import { useCallback, useEffect, useRef, useState } from "react"
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export const useTooltip = (selector: string, renderTooltip: (ele: SingularElementArgument) => string) => {
    const cy = useExplorerState(state => state.cy)
    const [enabled, setEnabled] = useState(true);
    const [follow, setFollow] = useState(true);
    const renderedPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const activeTooltipRef = useRef<ReturnType<getPopperInstance<any>> | null>(null)

    const destroyTooltip = useCallback(async () => {
        const tooltip = document.getElementById('graph-tooltip');

        if (tooltip) {
            tooltip.innerHTML = ''
        }

        activeTooltipRef.current?.destroy();
    }, [])

    const onMouseOver = useCallback(({ renderedPosition, target }: { renderedPosition: { x: number, y: number }, target: SingularElementArgument }) => {
        target.addClass('hover');
        if (!enabled) {
            return;
        }
        destroyTooltip();

        renderedPositionRef.current = renderedPosition;
        activeTooltipRef.current = target.popper({
            renderedPosition: () => renderedPositionRef.current,
            content: () => {
                const tooltip = document.getElementById('graph-tooltip');
                if (!tooltip) {
                    return undefined;
                }

                tooltip.innerHTML = renderTooltip(target);

                return tooltip
            },
            popper: {
                placement: 'auto',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 15],
                        },
                    },
                ]
            } as any
        })
    }, [enabled, destroyTooltip, renderTooltip]);
    const onMouseMove = useCallback(async ({ renderedPosition }: EventObject) => {
        if (activeTooltipRef.current && follow) {
            renderedPositionRef.current = renderedPosition;
            await activeTooltipRef.current.update()
        }
    }, [follow]);
    const onMouseOut = useCallback((e: EventObject) => {
        destroyTooltip();
        e.target.removeClass('hover')
    }, [destroyTooltip]);

    useEffect(() => {
        if (!cy) {
            return
        }
        cy.on('mouseover', selector, onMouseOver);
        cy.on('mouseout', selector, onMouseOut);
        cy.on('mousemove', selector, onMouseMove);

        return () => {
            cy.off('mouseover', selector, onMouseOver);
            cy.off('mouseout', selector, onMouseOut);
            cy.off('mousemove', selector, onMouseMove);
        }
    }, [cy, onMouseOver, onMouseOut, onMouseMove])

    return {
        enable: () => setEnabled(true),
        disable: () => setEnabled(false),
        startFollowing: () => setFollow(true),
        stopFollowing: () => setFollow(false),
    }
}