import { useSendCommand } from '~explorer/ui/hooks/useSendCommand';
import { useContextMenu } from './useContextMenu';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';
import { getSceneFromCyEle } from '~explorer/ui/utils/getSceneFromCyElement';
import { EXPLORER_WRITE_MOD_EDGES_CONFIG } from '~explorer/events/events';
import { useRef } from 'react';
import { ModEdgesConfig } from '~explorer/types/ModsConfig';

const hiddenClass = 'manual-hidden'

export const useEdgeContextMenu = () => {
    const editScene = useExplorerState(state => state.editScene)
    const setEdgesConfig = useExplorerState(state => state.setEdgesConfig)
    const selectedModConfig = useExplorerState(state => state.selectedModConfig)
    const sendCommand = useSendCommand()
    const ref = useRef<ModEdgesConfig>()

    ref.current = selectedModConfig?.edges

    useContextMenu('edge', [
        {
            content: 'Edit Origin Scene',
            select: (edge) => {
                editScene(getSceneFromCyEle((edge as any).source()))
            }
        },
        {
            content: 'Edit Target Scene',
            select: (edge) => {
                editScene(getSceneFromCyEle((edge as any).target()))
            }
        },
        {
            content: 'Hide/Show',
            select: (edge) => {
                edge.toggleClass(hiddenClass)

                if(!selectedModConfig || !ref.current) {
                    return
                }

                const id = edge.id()
                const edgeFromConfig = ref.current[id]
                let newEdges: ModEdgesConfig = { ...ref.current }

                if (edge.hasClass(hiddenClass)) {
                    newEdges = {
                        ...newEdges,
                        [edge.id()]: {
                            ...edgeFromConfig,
                            classes: Array.from(new Set(edgeFromConfig?.classes || []).add(hiddenClass)),
                        }
                    }
                } else {
                    newEdges = {
                        ...newEdges,
                        [edge.id()]: {
                            ...edgeFromConfig,
                            classes: edgeFromConfig?.classes.filter(className => className !== hiddenClass) || [],
                        }
                    }
                }

                setEdgesConfig(newEdges)

                
                sendCommand(EXPLORER_WRITE_MOD_EDGES_CONFIG, 'Saving edges information...', selectedModConfig?.info.id, newEdges)
            }
        }
    ]);
}