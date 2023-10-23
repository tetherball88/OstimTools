import { ModThemeConfig } from "./ModThemeConfig"
import { PositionsConfigItem } from "./PositionsConfig"

export interface ModsConfigMod {
    path: string
    name?: string
}

export type ModsConfig = {
    ostimMod: string
    mods: ModsConfigMod[]
}

export interface ModInfoConfig {
    id: string
    name: string
    path: string
}

export interface ModGroupConfig {
    id: string
    name: string
    children: string[]
}

export type ModGroupsConfig = Record<string, ModGroupConfig>

export type ModEdgesConfig = Record<string, { classes: string[] }>

export type ModPositionsConfig = PositionsConfigItem[]

export interface ModFullConfig {
    info: ModInfoConfig
    positions: ModPositionsConfig
    theme: ModThemeConfig
    groups: ModGroupsConfig
    edges: ModEdgesConfig
}

export type AllModsConfigs = Record<string, ModFullConfig>