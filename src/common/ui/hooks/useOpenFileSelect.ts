import { useSendCommand } from "~common/ui/hooks/useSendCommand";
import { SELECT_FILE } from "~common/events/events";
import { OpenDialogOptions } from "electron";

export interface UseOpenFileSelectParams {
    dialogOptions: OpenDialogOptions, 
    onChange: (files: string[]) => void
}

export const useOpenFileSelect = ({dialogOptions, onChange}: UseOpenFileSelectParams) => {
    const sendCommand = useSendCommand();

    return {
        open: async () => {
            const res = await sendCommand(SELECT_FILE, 'Selecting file...', dialogOptions);
    
            if(res) {
                const { filePaths } = res;
                onChange(filePaths);
            }
        }
    }
}