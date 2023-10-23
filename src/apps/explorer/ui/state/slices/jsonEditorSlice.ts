import { StateCreator } from "zustand"
import { ExplorerOstimScene } from "~explorer/nodejs/readScenes"

interface JsonEditorSlice {
    editorOpened: boolean
    setEditorOpened: (opened: boolean) => void
    selectedSceneJson: ExplorerOstimScene | null,
    editorTouched: boolean
    setEditorTouched: (touched: boolean) => void
    setSelectedSceneJson: (scene: ExplorerOstimScene | null) => void
    editScene: (scene: ExplorerOstimScene) => void
}

export const jsonEditorSlice: StateCreator<JsonEditorSlice> = (set) => ({
    editorOpened: false,
    setEditorOpened: (opened) => set(state => ({
        ...state,
        editorOpened: opened
    })),
    selectedSceneJson: null,
    setSelectedSceneJson: (scene) => set(state => ({
        ...state,
        selectedSceneJson: scene,
    })),
    editScene: scene => set(state => ({
        ...state,
        editorOpened: true,
        selectedSceneJson: scene,
        editorTouched: false
    })),
    editorTouched: false,
    setEditorTouched: (touched) => set(state => ({
        ...state,
        editorTouched: touched,
    }))
})