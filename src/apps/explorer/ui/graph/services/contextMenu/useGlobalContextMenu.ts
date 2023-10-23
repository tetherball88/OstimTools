import { useContextMenu } from './useContextMenu';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';


export const useGlobalContextMenu = () => {
    const setFileOrFolder = useExplorerState(state => state.setFileOrFolder);
    const editScene = useExplorerState(state => state.editScene);
    const selectedModId = useExplorerState(state => state.selectedModId)
    const allScenes = useExplorerState(state => state.allScenes);
    
    useContextMenu('core', [
        {
            content: 'Open editor',
            select: () => {
                if(selectedModId && allScenes) {
                    editScene(allScenes[selectedModId][0])
                }
                
            }
        },
        {
            content: 'Add scene',
            select: () => {
                setFileOrFolder({
                    path: '',
                    name: '',
                    extension: 'json'
                })
            }
        }
    ]);
}