import { FC } from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { AddonConfig } from '~connectAddon/types';
import { CONECT_ADDON_WRITE_CONFIGS } from '~connectAddon/events/events';
import { CommonConfigForm } from '~connectAddon/ui/components';

export interface ConnectDialogGlobalConfigModalProps {
    open: boolean
    onClose: () => void;
}

export const ConnectDialogGlobalConfigModal: FC<ConnectDialogGlobalConfigModalProps> = ({ onClose, open }) => {
    const sendCommand = useSendCommand();
    const methods = useFormContext<AddonConfig>();

    const onSave = async (data: AddonConfig) => {
        await sendCommand(CONECT_ADDON_WRITE_CONFIGS, 'Updating ADDON HUB config...', data);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <form onSubmit={methods.handleSubmit(onSave)}>
                <DialogTitle>Edit ADDON HUB config</DialogTitle>
                <DialogContent>
                    <CommonConfigForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}