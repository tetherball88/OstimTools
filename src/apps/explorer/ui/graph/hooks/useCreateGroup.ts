import { EXPLORER_WRITE_MOD_GROUPS_CONFIG } from "~explorer/events/events"
import { ModGroupConfig } from "~explorer/types/ModsConfig"
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand"
import { useExplorerState } from "~explorer/ui/state/ExplorerState"

export const useCreateGroup = () => {
    const modId = useExplorerState(state => state.selectedModConfig?.info.id)
    const groups = useExplorerState(state => state.selectedModConfig?.groups) || {}
    const loadInitialData = useExplorerState(state => state.loadInitialData)
    const sendCommand = useSendCommand()

    return async (id: string, name: string, children: string[] = []) => {
        if(modId && id) {
            const newGroup: ModGroupConfig = {
                id,
                name,
                children,
            }
            
            sendCommand(EXPLORER_WRITE_MOD_GROUPS_CONFIG, 'Saving groups...', modId, { ...groups, [id]: newGroup})
            loadInitialData()
        }
    }
}