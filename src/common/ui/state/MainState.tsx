import { create } from 'zustand';

interface MainState {
    commandInProgress: boolean
    commandMessage: string
    toggleCommand: (inProgress: boolean, commandMessage?: string) => void
}

export const useMainState = create<MainState>((set) => ({
    commandInProgress: false,
    commandMessage: '',
    toggleCommand: (inProgress, message) => set(state => ({
        ...state,
        commandInProgress: inProgress,
        commandMessage: message
    }))
}))
