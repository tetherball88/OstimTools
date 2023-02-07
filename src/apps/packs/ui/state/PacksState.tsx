import { FC, createContext, useEffect, PropsWithChildren, useContext, useMemo, useReducer, Reducer, useState } from 'react';
import { LockScreen } from '~common/ui/components';
import { invokeLoadConfigs, invokeLoadGlobalConfig, invokeValidateFnisPath } from '~packs/events/invokers';

import { AllConfigs, GlobalConfig, ModuleConfig, ModuleSpecificConfig, PackConfig } from '~packs/types';

interface State {
    configs: AllConfigs,
    selectedPackName: string,
    selectedModuleName: string,
    globalConfig: GlobalConfig
    fnisValidation: string
}

interface PacksStateContextType extends State {
    addPackConfig: (packConfig: PackConfig) => void
    updatePackConfig: (packConfig: PackConfig) => void
    addModuleConfig: (moduleConfig: ModuleSpecificConfig, packName: string) => void
    updateModuleConfig: (moduleConfig: ModuleSpecificConfig, packName: string) => void
    removeModule: (moduleConfig: ModuleConfig, packName: string) => void
    removePack: (packName: string) => void
    setGlobalConfig: (globalConfig: GlobalConfig) => void
    setFnisValidation: (fnisValidation: string) => void
}

const initialState: State = {
    configs: {},
    selectedPackName: '',
    selectedModuleName: '',
    globalConfig: {
        fnisForModdersPath: '',
    },
    fnisValidation: '',
}

const PacksStateContext = createContext<PacksStateContextType>({} as PacksStateContextType);

const SET_CONFIGS = 'SET_CONFIGS';
const SELECT_PACK = 'SELECT_PACK';
const SELECT_MODULE = 'SELECT_MODULE';
const ADD_PACK = 'ADD_PACK';
const UPDATE_PACK = 'UPDATE_PACK';
const ADD_MODULE = 'ADD_MODULE';
const UPDATE_MODULE = 'UPDATE_MODULE';
const REMOVE_MODULE = 'REMOVE_MODULE';
const REMOVE_PACK = 'REMOVE_PACK';
const SET_GLOBAL_CONFIG = 'SET_GLOBAL_CONFIG';
const SET_FNIS_VALIDATION = 'SET_FNIS_VALIDATION';

const reducer: Reducer<State, any> = (state, action) => {
    switch (action.type) {
        case SET_CONFIGS:
            return {
                ...state,
                configs: action.payload,
            }
        case SELECT_PACK:
            return {
                ...state,
                selectedPackName: action.payload,
                selectedModuleConfig: null,
                selectedModuleName: '',
            }
        case SELECT_MODULE:
            return {
                ...state,
                selectedModuleName: action.payload,
            }
        case ADD_PACK:
            return {
                ...state,
                configs: {
                    ...state.configs,
                    [action.payload.pack.name]: {
                        ...action.payload,
                        modules: [],
                    },
                }
            }
        case UPDATE_PACK: {
            const packName: string = action.payload.pack.name
            return {
                ...state,
                configs: {
                    ...state.configs,
                    [packName]: {
                        ...state.configs[packName],
                        ...action.payload,
                    }
                }
            }
        }
        case ADD_MODULE: {
            const { packName, moduleConfig } = action.payload;
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
        }
        case UPDATE_MODULE: {
            const { packName, moduleConfig } = action.payload;
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
        }
        case REMOVE_MODULE: {
            const { packName, moduleConfig } = action.payload;
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
        }
        case REMOVE_PACK: {
            const packName = action.payload;
            const newConfigs = { ...state.configs };
            delete newConfigs[packName];
            return {
                ...state,
                configs: newConfigs
            }
        }
        case SET_GLOBAL_CONFIG: {
            return {
                ...state,
                globalConfig: action.payload
            }
        }
        case SET_FNIS_VALIDATION: {
            return {
                ...state,
                fnisValidation: action.payload
            }
        }
        default:
            return state;
    }
}

export const PacksStateProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [configsLoading, setConfigsLoading] = useState(true);

    const value = useMemo<PacksStateContextType>(() => ({
        ...state,
        addPackConfig: (packConfig) => dispatch({ type: ADD_PACK, payload: packConfig }),
        updatePackConfig: (packConfig) => dispatch({ type: UPDATE_PACK, payload: packConfig }),
        addModuleConfig: (moduleConfig, packName) => dispatch({ type: ADD_MODULE, payload: { moduleConfig, packName } }),
        updateModuleConfig: (moduleConfig, packName) => dispatch({ type: UPDATE_MODULE, payload: { moduleConfig, packName } }),
        removeModule: (moduleConfig, packName) => dispatch({ type: REMOVE_MODULE, payload: { packName, moduleConfig } }),
        removePack: (packName) => dispatch({ type: REMOVE_PACK, payload: packName }),
        setGlobalConfig: (globalConfig) => dispatch({ type: SET_GLOBAL_CONFIG, payload: globalConfig }),
        setFnisValidation: (fnisValidation) => dispatch({ type: SET_FNIS_VALIDATION, payload: fnisValidation }),
    }), [state, dispatch]);

    useEffect(() => {
        (async () => {
            const res = await invokeLoadConfigs();
            const globalConfig = await invokeLoadGlobalConfig();

            const fnisValidation = await invokeValidateFnisPath(globalConfig?.fnisForModdersPath || '');

            setConfigsLoading(false);

            dispatch({
                type: SET_GLOBAL_CONFIG,
                payload: globalConfig || {},
            })

            dispatch({
                type: SET_CONFIGS,
                payload: res || {},
            })

            dispatch({
                type: SET_FNIS_VALIDATION,
                payload: fnisValidation,
            })
        })();
    }, []);

    return (
        <PacksStateContext.Provider value={value}>
            {configsLoading ? <LockScreen open message="Loading configs from file system..." /> : children}
        </PacksStateContext.Provider>
    )
}

export const usePacksState = () => {
    return useContext(PacksStateContext);
}