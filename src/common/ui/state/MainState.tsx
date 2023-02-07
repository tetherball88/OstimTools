import { FC, createContext, PropsWithChildren, useContext, useMemo, useReducer, Reducer } from 'react';

interface State {
    commandInProgress: boolean
    commandMessage: string
}

interface MainStateContextType extends State {
    toggleCommand: (inProgress: boolean, commandMessage?: string) => void
}

const initialState: State = {
    commandInProgress: false,
    commandMessage: '',
}

const MainStateContext = createContext<MainStateContextType>({} as MainStateContextType);

const TOGGLE_COMMAND = 'TOGGLE_COMMAND';

const reducer: Reducer<State, any> = (state, action) => {
    switch (action.type) {
        case TOGGLE_COMMAND: {
            return {
                ...state,
                commandInProgress: action.payload.inProgress,
                commandMessage: action.payload.message
            }
        }
        default:
            return state;
    }
}

export const MainStateProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = useMemo<MainStateContextType>(() => ({
        ...state,
        toggleCommand: (inProgress, message = '') => dispatch({ type: TOGGLE_COMMAND, payload: { inProgress, message } }),
    }), [state, dispatch]);

    return (
        <MainStateContext.Provider value={value}>
            {children}
        </MainStateContext.Provider>
    )
}

export const useMainState = () => {
    return useContext(MainStateContext);
}