import { create } from "zustand";
import { invokeLoadConfigs, invokeLoadGlobalConfig, invokeLoadStartingScenesConfig, invokeValidateNemesisPath } from "~bridge/events/invokers";
import { AllConfigs, GlobalConfig, ModuleSpecificConfig, PackConfig } from "~bridge/types";
import { StartingScenesConfig } from "~bridge/types/StartingScenes";

interface BridgeState {
    configs: AllConfigs
    selectedPackName: string
    selectedModuleName: string
    globalConfig: GlobalConfig
    nemesisValidation: string
    startingScenesConfig: StartingScenesConfig
    addPackConfig: (packConfig: PackConfig) => void
    updatePackConfig: (packConfig: PackConfig) => void
    addModuleConfig: (moduleConfig: ModuleSpecificConfig, packName: string) => void
    updateModuleConfig: (moduleConfig: ModuleSpecificConfig, packName: string) => void
    removeModule: (moduleConfig: ModuleSpecificConfig, packName: string) => void
    removePack: (packName: string) => void
    setGlobalConfig: (globalConfig: GlobalConfig) => void
    setNemesisValidation: (nemesisValidation: string) => void
    loadApp: () => Promise<void>
    updateStartingScenesConfig: (config: StartingScenesConfig) => void
}

export const useBridgeState = create<BridgeState>((set) => ({
    configs: {},
    selectedPackName: '',
    selectedModuleName: '',
    globalConfig: {
        nemesisTransitionToolExe: '',
    },
    nemesisValidation: '',
    startingScenesConfig: {
        sources: [],
        scenes: []
    },
    addPackConfig: packConfig => set(state => {
        return {
            ...state,
            configs: {
                ...state.configs,
                [packConfig.pack.name]: {
                    ...packConfig,
                    modules: [],
                },
            }
        }
    }),
    updatePackConfig: packConfig => set(state => {
        const packName: string = packConfig.pack.name
        return {
            ...state,
            configs: {
                ...state.configs,
                [packName]: {
                    ...state.configs[packName],
                    ...packConfig,
                }
            }
        }
    }),
    addModuleConfig: (moduleConfig, packName) => set(state => {
        const packConfig = state.configs[packName];
        return {
            ...state,
            configs: {
                ...state.configs,
                [packName]: {
                    ...packConfig,
                    modules: [...packConfig.modules, moduleConfig],
                },
            }
        }
    }),
    updateModuleConfig: (moduleConfig, packName) => set(state => {
        const packConfig = state.configs[packName];
        const newModules = packConfig.modules.map(module => {
            if (moduleConfig.module.name === module.module.name) {
                return moduleConfig
            }

            return module;
        })
        return {
            ...state,
            configs: {
                ...state.configs,
                [packName]: {
                    ...packConfig,
                    modules: newModules,
                },
            }
        }
    }),
    removeModule: (moduleConfig, packName) => set(state => {
        const packConfig = state.configs[packName];
        const newModules = packConfig.modules.filter(({ module: { name } }) => name !== moduleConfig.module.name)
        return {
            ...state,
            configs: {
                ...state.configs,
                [packName]: {
                    ...packConfig,
                    modules: newModules,
                },
            }
        }
    }),
    removePack: packName => set(state => {
        const newConfigs = { ...state.configs };
        delete newConfigs[packName];
        return {
            ...state,
            configs: newConfigs
        }
    }),
    setGlobalConfig: globalConfig => set(state => ({
        ...state,
        globalConfig,
    })),
    setNemesisValidation: nemesisValidation => set(state => ({
        ...state,
        nemesisValidation,
    })),
    loadApp: async () => {
        const configs = await invokeLoadConfigs();
        const globalConfig = await invokeLoadGlobalConfig();
        const nemesisValidation = await invokeValidateNemesisPath(globalConfig?.nemesisTransitionToolExe || '');
        const startingScenesConfig = await invokeLoadStartingScenesConfig()

        set(state => ({
            ...state,
            configs,
            globalConfig,
            nemesisValidation,
            startingScenesConfig
        }))
    },
    updateStartingScenesConfig: config => set(state => ({
        ...state,
        startingScenesConfig: config
    }))
}))