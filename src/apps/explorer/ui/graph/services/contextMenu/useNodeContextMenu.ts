import { useContextMenu } from './useContextMenu';
import { getSceneFromCyEle } from '~explorer/ui/utils/getSceneFromCyElement';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';
import { useRemoveScene } from '~explorer/ui/graph/hooks/useRemoveScene';
import { v4 } from 'uuid';
import { EditGroup } from '~explorer/ui/state/slices/groupsSlice';

export const useNodeContextMenu = () => {
    const editScene = useExplorerState(state => state.editScene)
    const setOpenThemeForms = useExplorerState(state => state.setOpenThemeForms)
    const setGroupToEdit = useExplorerState(state => state.setGroupToEdit)
    const removeNode = useRemoveScene()

    useContextMenu('node:childless', [
        {
            content: 'Styles',
            select: (ele) => {
                ele.select()
                setOpenThemeForms(true)
            }
        },
        {
            content: 'Edit',
            select: (ele) => {
                editScene(getSceneFromCyEle(ele))
            }
        },
        {
            content: 'Remove',
            select: (node) => {
                removeNode(getSceneFromCyEle(node))
            }
        },
        {
            content: 'Create group',
            select: (node) => {
                const newGroup: EditGroup = {
                    id: v4(),
                    name: '',
                    children: []
                }
                const selectedNodes = node.cy().nodes(':selected:childless')

                if(selectedNodes && selectedNodes.length) {
                    newGroup.children = selectedNodes?.map(ele => ele.id())
                } else {
                    newGroup.children = [node.id()]
                }

                setGroupToEdit(newGroup)
            }
        }
    ]
    )
}