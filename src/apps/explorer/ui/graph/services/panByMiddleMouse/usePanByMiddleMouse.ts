import { Position } from "cytoscape"
import { useCallback, useEffect, useRef } from "react"
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export const usePanByMiddleMouse = () => {
    const cy = useExplorerState(state => state.cy);
    const lastPos = useRef<Position>({ x: 0, y: 0 });
    const isPanning = useRef(false);

    const start = useCallback((e: HTMLElementEventMap['mousedown']) => {
        if (e.button === 1) {
            isPanning.current = true;
            lastPos.current = { x: e.pageX, y: e.pageY };
        }
    }, [])

    const move = useCallback((e: HTMLElementEventMap['mousemove']) => {
        if (isPanning.current && cy) {

            const dx = (e.pageX - lastPos.current.x);
            const dy = (e.pageY - lastPos.current.y);

            lastPos.current = { x: e.pageX, y: e.pageY };
            cy.panBy({ x: dx, y: dy });
        }
    }, [cy])

    const end = useCallback((e: HTMLElementEventMap['mouseup']) => {
        if (e.button === 1) {
            isPanning.current = false;
        }
    }, [])

    useEffect(() => {
        if (!cy) {
            return
        }
        lastPos.current = cy.pan()
        const container = cy.container()

        container?.addEventListener('mousedown', start);

        container?.addEventListener('mousemove', move);

        container?.addEventListener('mouseup', end);

        return () => {
            container?.removeEventListener('mousedown', start);

            container?.removeEventListener('mousemove', move);

            container?.removeEventListener('mouseup', end);
        }
    }, [cy])
}