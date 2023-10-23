import { editor } from "monaco-editor"
import { EXPLORER_UPDATE_SCENE } from "~explorer/events/events"
import { ExplorerOstimScene } from "~explorer/nodejs/readScenes"
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand"
import { useExplorerState } from "~explorer/ui/state/ExplorerState"

export const useUpdateScene = () => {
    const loadMods = useExplorerState(state => state.loadInitialData)
    const sendCommand = useSendCommand()

    return async (scene: ExplorerOstimScene, editorInstance: editor.ICodeEditor) => {
        await sendCommand(EXPLORER_UPDATE_SCENE, 'Saving scene to file...', scene.filePath || '', editorInstance.getValue())
        loadMods()
    }
}