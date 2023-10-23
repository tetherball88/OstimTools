import { EXPLORER_REMOVE_SCENE } from "~explorer/events/events"
import { ExplorerOstimScene } from "~explorer/nodejs/readScenes"
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand"
import { useExplorerState } from "~explorer/ui/state/ExplorerState"

export const useRemoveScene = () => {
    const loadMods = useExplorerState(state => state.loadInitialData)
    const sendCommand = useSendCommand()

    return async (scene: ExplorerOstimScene) => {
        await sendCommand(EXPLORER_REMOVE_SCENE, 'Removing scene...', scene.filePath)
        loadMods()
    }
}