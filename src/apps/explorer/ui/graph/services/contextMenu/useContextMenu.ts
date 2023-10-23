import { MenuInstance } from "cytoscape-cxtmenu";
import { useEffect, useRef } from "react";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export const useContextMenu = (selector: string | undefined, commands: cytoscapeCxtmenu.Options['commands']) => {
    const cy = useExplorerState(state => state.cy)
    const menuRef = useRef<MenuInstance | null>(null)
    
    useEffect(() => {
        if (!cy) {
            return
        }
        
        menuRef.current = cy.cxtmenu({
            selector,
            commands
        })

        return () => {
            menuRef.current?.destroy();
        }
    }, [cy]);
}