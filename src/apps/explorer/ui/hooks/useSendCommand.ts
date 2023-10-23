import { useSendCommand as useSendCommandCommon } from "~common/ui/hooks/useSendCommand";
import { eventsMap } from "~explorer/events/eventsMap";

export const useSendCommand = (skipOpenTerminal = true) => {
    return useSendCommandCommon<typeof eventsMap>(skipOpenTerminal)
}