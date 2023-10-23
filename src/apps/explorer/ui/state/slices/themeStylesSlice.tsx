import { StateCreator } from "zustand"
import { GlobalTheme } from "~explorer/types/GlobalTheme"
import { GroupsStyles, ScenesStyles } from "~explorer/types/ScenesStyles"

interface ThemesStylesSliceState {
    globalTheme: GlobalTheme | null
    scenesTheme: Record<string, ScenesStyles[string]> | null
    groupsTheme: Record<string, GroupsStyles[string]> | null
    touched: boolean
    setGlobalTheme: (globalTheme: GlobalTheme | null) => void
    setScenesTheme: (scenesTheme: Record<string, ScenesStyles[string]> | null) => void
    setGroupsTheme: (groupsTheme: Record<string, GroupsStyles[string]> | null) => void
    setTouched: (touched: boolean) => void
}

export const themesStylesSlice: StateCreator<ThemesStylesSliceState> = (set) => ({
    globalTheme: null,
    scenesTheme: null,
    groupsTheme: null,
    touched: false,
    setGlobalTheme: (globalTheme) => set(state => ({
        state,
        globalTheme,
    })),
    setScenesTheme: (scenesTheme) => set(state => ({
        state,
        scenesTheme,
    })),
    setGroupsTheme: (groupsTheme) => set(state => ({
        state,
        groupsTheme,
    })),
    setTouched: (touched) => set(state => ({
        state,
        touched,
    })),
})