import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { ModuleSpecificConfig } from '~bridge/types';
import { WRITE_MODULE_CONFIG } from '~bridge/events/events';
import { ModuleForms } from '~bridge/ui/components/Forms';
import { useBridgeState } from '~bridge/ui/state/store';

export interface EditModuleConfigModalProps {
    open: boolean
    onClose: () => void
    packName: string
    author: string
}

export const EditModuleConfigModal: FC<EditModuleConfigModalProps> = ({
    open,
    onClose,
    packName,
    author,
}) => {
    const methods = useFormContext()
    const updateModuleConfig = useBridgeState(state => state.updateModuleConfig);
    
    const sendCommand = useSendCommand();

    const onSave = async (data: ModuleSpecificConfig) => {
        await sendCommand(WRITE_MODULE_CONFIG, 'Updating module config...', packName, data);
        updateModuleConfig(data, packName);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            
                <form onSubmit={methods.handleSubmit(onSave)}>
                    <DialogTitle>Edit pack config</DialogTitle>
                    <DialogContent>
                        <ModuleForms disableModuleName author={author} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit">Update</Button>
                    </DialogActions>
                </form>
        </Dialog>
    )
}