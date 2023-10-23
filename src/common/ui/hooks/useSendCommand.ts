import { eventsMap } from "~common/events/eventsMap";
import { useMainState } from "~common/ui/state/MainState"

export type CommonMapInvokers = typeof eventsMap

export const useSendCommand = <AdditionalMapInvokers extends Record<string, (...args: any[]) => any>>(skipOpenTerminal: boolean = false) => {
    const toggleCommand = useMainState(state => state.toggleCommand);

    type MapInvokers = AdditionalMapInvokers & CommonMapInvokers

    return async <Key extends keyof MapInvokers>(
        command: Key, 
        message: string, 
        ...args: Parameters<MapInvokers[Key]>
    ): Promise<ReturnType<MapInvokers[Key]> | null> => {
        try {
            toggleCommand(true, message, skipOpenTerminal);
            const res = await window.api.invoke(command as string, ...args);
            toggleCommand(false, '', skipOpenTerminal);
            return res;
        } catch (e) {
            toggleCommand(false, '', skipOpenTerminal);
            window.dispatchEvent(new CustomEvent('local-log', {detail: {type: 'error', msg: e.message}}));
            return null;
        }
    }
}