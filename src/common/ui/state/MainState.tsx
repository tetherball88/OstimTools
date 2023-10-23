import { create } from 'zustand';

interface MainState {
    commandInProgress: boolean
    commandMessage: string
    toggleCommand: (inProgress: boolean, commandMessage?: string, skipOpenTerminal?: boolean) => void
}

export const useMainState = create<MainState>((set) => ({
    commandInProgress: false,
    commandMessage: '',
    toggleCommand: (inProgress, message, skipOpenTerminal = false) => set(state => ({
        ...state,
        commandInProgress: skipOpenTerminal ? false : inProgress,
        commandMessage: message
    }))
}))
