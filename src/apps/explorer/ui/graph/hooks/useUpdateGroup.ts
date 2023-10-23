import { useRef } from 'react';
import { EXPLORER_WRITE_MOD_GROUPS_CONFIG } from '~explorer/events/events';
import { ModGroupsConfig } from '~explorer/types/ModsConfig';
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand"
import { useExplorerState } from "~explorer/ui/state/ExplorerState"

export const useUpdateGroup = () => {
    const modId = useExplorerState(state => state.selectedModConfig?.info.id)
    const groups = useExplorerState(state => state.selectedModConfig?.groups) || {}
    const sendCommand = useSendCommand()
    const groupsRef = useRef<ModGroupsConfig>({})
    groupsRef.current = groups
    
    return async (id: string, name: string, addChildren: string[] = [], removeChildren: string[] = []) => {
        const group = groupsRef.current[id]
        if(modId && group) {
            group.name = name
            if(removeChildren) {
                group.children = group.children.filter((child) => !removeChildren.includes(child))
            }
            if(addChildren) {
                group.children = [...group.children, ...addChildren]
            }
            
            sendCommand(EXPLORER_WRITE_MOD_GROUPS_CONFIG, 'Saving groups...', modId, { ...groupsRef.current })
        }
    }
}