import { create } from 'zustand';
import { getOstimSceneSchema } from '~common/shared/jsonValidators/ostimSceneJsoncSchemaTweaks';
import { explorerSelectedModIdStorage } from '~common/ui/services/Storage/ExplorerSelectedModIdStorage';
import { invokeExplorerGetAllConfigs, invokeExplorerReadScenes, invokeGetModsMetadata } from '~explorer/events/invokers';
import { ExplorerOstimScene } from '~explorer/nodejs/readScenes';
import { ModGroupsConfig } from '~explorer/types/ModsConfig';
import { buildNodesAndEdges } from '~explorer/ui/graph/buildScenesGraphData';
import { OSTIM_ID } from '~explorer/ui/ostimId';
import { analyzeScenes } from '~explorer/ui/state/analyzeScenes';
import { graphSlice } from '~explorer/ui/state/slices/graphSlice';
import { groupsSlice } from '~explorer/ui/state/slices/groupsSlice';
import { jsonEditorSlice } from '~explorer/ui/state/slices/jsonEditorSlice';
import { mainSlice } from '~explorer/ui/state/slices/mainSlice';
import { themesStylesSlice } from '~explorer/ui/state/slices/themeStylesSlice';

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...(infer R)]
    ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
    : unknown;

type ExplorerState = StateFromFunctions<[
    typeof mainSlice,
    typeof graphSlice,
    typeof jsonEditorSlice,
    typeof groupsSlice,
    typeof themesStylesSlice,
]> & {
    allScenes: Record<string, ExplorerOstimScene[]> | null
    loadInitialData: () => Promise<void>
    setSelectedModId: (modId: string | null) => void
    updateGroups: (groups: ModGroupsConfig) => void
    setThemesFromSelectedMod: () => void
};

export const useExplorerState = create<ExplorerState>((set, get, ...args) => ({
    ...mainSlice(set, get, ...args),
    ...graphSlice(set, get, ...args),
    ...jsonEditorSlice(set, get, ...args),
    ...groupsSlice(set, get, ...args),
    ...themesStylesSlice(set, get, ...args),
    allScenes: null,
    setThemesFromSelectedMod: () => set(state => {
        return ({
            ...state,
            globalTheme: state.selectedModConfig?.theme.global ? {...state.selectedModConfig?.theme.global} : null,
            scenesTheme: state.selectedModConfig?.theme.scenesStyles ? {...state.selectedModConfig?.theme.scenesStyles} : null,
            groupsTheme: state.selectedModConfig?.theme.groupsStyles ? {...state.selectedModConfig?.theme.groupsStyles} : null,
        })
    }),
    updateGroups: groups => set(state => ({
        ...state,
        selectedModConfig: state.selectedModConfig ? {
            ...state.selectedModConfig,
            groups,
        } : null
    })),
    setSelectedModId: modId => {
        const state = get()
        const allModsConfigs = state.allModsConfigs
        const allScenes = state.allScenes
        if(!allModsConfigs || !Object.keys(allModsConfigs).length) {
            console.warn(`You don't have any mods added to Explorer.`);
            return state
        }

        if(!allScenes) {
            console.warn(`Your included mods don't have valid Ostim Standalone scenes.`)
            return state;
        }

        if(!modId || !allModsConfigs[modId]) {
            console.warn(`Couldn't find mod config for selected mod id ${modId}. Using the first mod from your configs.`);
            modId = Object.keys(allModsConfigs)[0]
        }
        
        const newState: Partial<ExplorerState> = {
            ...state,
            selectedModId: modId,
        }

        explorerSelectedModIdStorage.setItem(modId);

        
        newState.selectedModConfig = allModsConfigs[modId]

        if(newState.selectedModConfig) {
            const res = buildNodesAndEdges(allScenes[modId], newState.selectedModConfig.positions, newState.selectedModConfig.groups, newState.selectedModConfig.edges)

            Object.assign(newState, res)
        }

        set(newState)

        get().setThemesFromSelectedMod()
    },
    loadInitialData: async () => {
        const newState: Partial<ExplorerState> = {}
        newState.allModsConfigs = await invokeExplorerGetAllConfigs()
        const selectedIdFromStorage = explorerSelectedModIdStorage.getItem()
        const selectedModId = selectedIdFromStorage || Object.keys(newState.allModsConfigs)[0] || null
        
        newState.allScenes = await invokeExplorerReadScenes()

        const metaData = await invokeGetModsMetadata()
        const analyzedMetadata = analyzeScenes([...(newState.allScenes[OSTIM_ID] || []), ...(newState.allScenes[selectedModId || ''] || [])], metaData)
        newState.ostimSceneJsonSchema = getOstimSceneSchema(analyzedMetadata)

        newState.modsMetadata = analyzedMetadata

        set(state => ({
            ...state,
            ...newState
        }))

        get().setSelectedModId(selectedModId)
    },
}))
