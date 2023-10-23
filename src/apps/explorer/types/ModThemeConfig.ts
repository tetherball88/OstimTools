import { ColorProps, GlobalTheme } from "./GlobalTheme";

/**
 * @title Selected scene/s colors
 */
export type ModThemeConfigScene = Partial<Pick<ColorProps, 'color' | 'text-outline-color' | 'background-color'>>

/**
 * @title Group/s colors
 */
export type ModThemeConfigGroup = Partial<Pick<ColorProps, 'background-color' | 'border-color' | 'color' | 'text-outline-color'>>

export interface ModThemeConfig {
    global: GlobalTheme | null
    scenesStyles: Record<string, ModThemeConfigScene> | null
    groupsStyles: Record<string, ModThemeConfigGroup> | null
}