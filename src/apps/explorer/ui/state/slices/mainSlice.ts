import { StateCreator } from "zustand"
import { ModsMetadata } from "~common/shared/types/ModsMetadata"
import { invokeGetScenesFolderStructure } from "~explorer/events/invokers"
import { FolderStructureResponse } from "~explorer/nodejs/getFolderStructure"
import { AllModsConfigs, ModEdgesConfig, ModFullConfig } from "~explorer/types/ModsConfig"
import { FileOrFolderData } from "~explorer/ui/components/AddFileOrFolderForm/AddFileOrFolderForm"

export interface MainSliceState {
    selectedModId: string | null
    allModsConfigs: AllModsConfigs | null
    modsMetadata: ModsMetadata | null
    ostimSceneJsonSchema: Record<string, any> | null
    selectedModConfig: ModFullConfig | null
    openThemeForms: boolean
    setOpenThemeForms: (open: boolean) => void
    setAllModsConfigs: (allModsConfigs: AllModsConfigs | null) => void
    setOstimSceneJsonSchema: (schema: Record<string, any>) => void
    setModsMetadata: (modsMetadata: ModsMetadata | null) => void
    setEdgesConfig: (edgesConfig: ModEdgesConfig) => void
    folderStructure: FolderStructureResponse | null
    loadFolderStructure: () => Promise<void>
    fileOrFolder: FileOrFolderData | null
    setFileOrFolder: (fileOrFolder: FileOrFolderData | null) => void

}

export const mainSlice: StateCreator<MainSliceState> = (set, get) => ({
    selectedModId: null,
    allModsConfigs: null,
    modsMetadata: null,
    ostimSceneJsonSchema: null,
    selectedModConfig: null,
    setAllModsConfigs: (allModsConfigs) => set(state => ({
        ...state,
        allModsConfigs
    })),
    setModsMetadata: (modsMetadata) => set(state => ({
        ...state,
        modsMetadata,
    })),
    setOstimSceneJsonSchema: (schema) => set(state => ({
        ...state,
        ostimSceneJsonSchema: schema
    })),
    openThemeForms: false,
    setOpenThemeForms: (open: boolean) => set(state => ({
        ...state,
        openThemeForms: open
    })),
    setEdgesConfig: (edges: ModEdgesConfig) => set(state => ({
        ...state,
        selectedModConfig: state.selectedModConfig ? {
            ...state.selectedModConfig,
            edges,
        } : null
    })),
    folderStructure: null,
    loadFolderStructure: async () => {
        const selectedModId = get().selectedModId

        if(selectedModId) {
            const folderStructure = await invokeGetScenesFolderStructure(selectedModId)

            set(state => ({
                ...state,
                folderStructure,
            }))
        }
        
    },
    fileOrFolder: null,
    setFileOrFolder: (fileOrFolder) => set(state => ({
        ...state,
        fileOrFolder,
    }))
})
