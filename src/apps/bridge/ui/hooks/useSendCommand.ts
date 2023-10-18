import { useSendCommand as useSendCommandCommon } from "~common/ui/hooks/useSendCommand";
import { eventsMap } from "~bridge/events/eventsMap";

export const useSendCommand = () => {
    return useSendCommandCommon<typeof eventsMap>()
}