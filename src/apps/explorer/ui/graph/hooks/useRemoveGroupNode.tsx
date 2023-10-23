
import { EXPLORER_WRITE_MOD_GROUPS_CONFIG } from "~explorer/events/events"
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand"
import { useExplorerState } from "~explorer/ui/state/ExplorerState"

export const useRemoveGroupNode = () => {
    const cy = useExplorerState(state => state.cy)
    const selectedModConfig = useExplorerState(state => state.selectedModConfig)
    const sendCommand = useSendCommand()
    const loadInitialData = useExplorerState(state => state.loadInitialData)

    return async (id: string) => {
        const parent = cy?.nodes(`#${id}`);
        
        parent?.children().forEach(node => {
            node.move({
                parent: null
            })
        })

        parent?.remove()        

        if(selectedModConfig) {
            delete selectedModConfig.groups[id]
            await sendCommand(EXPLORER_WRITE_MOD_GROUPS_CONFIG, 'Removing group...', selectedModConfig.info.id, selectedModConfig.groups)
        }
        
        loadInitialData()
    }
}