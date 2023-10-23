import { useContextMenu } from './useContextMenu';
import { useRemoveGroupNode } from '~explorer/ui/graph/hooks/useRemoveGroupNode';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';

export const useGroupContextMenu = () => {
    const removeGroup = useRemoveGroupNode()
    const setGroupToEdit = useExplorerState(state => state.setGroupToEdit)
    
    useContextMenu('node:parent', [
        {
            content: 'Edit group',
            select: (group) => {
                setGroupToEdit({
                    id: group.id(),
                    name: group.data().label,
                    children: (group as any).children().map((ele: any) => ele.id())
                }, 'edit')
            }
        },
        {
            content: 'Remove group',
            select: (ele) => {
                removeGroup(ele.id())
            }
        }
    ]);
}