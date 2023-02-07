import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { usePacksState } from '~packs/ui/state/PacksState';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { ModuleSpecificConfig } from '~packs/types';
import { WRITE_MODULE_CONFIG } from '~packs/events/events';
import { ModuleForms } from '~packs/ui/components/Forms';

export interface EditModuleConfigModalProps {
    open: boolean
    onClose: () => void
    packName: string
}

export const EditModuleConfigModal: FC<EditModuleConfigModalProps> = ({
    open,
    onClose,
    packName,
}) => {
    const methods = useFormContext()
    const { updateModuleConfig } = usePacksState();
    
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
                        <ModuleForms disableModuleName />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit">Update</Button>
                    </DialogActions>
                </form>
        </Dialog>
    )
}