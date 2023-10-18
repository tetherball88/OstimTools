import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { PackConfig } from '~bridge/types';
import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { WRITE_PACK_CONFIG } from '~bridge/events/events';
import { PackForms } from '~bridge/ui/components/Forms';
import { useBridgeState } from '~bridge/ui/state/store';

export interface EditPackConfigModalProps {
    open: boolean
    onClose: () => void
    packName: string
}

export const EditPackConfigModal: FC<EditPackConfigModalProps> = ({
    open,
    onClose,
    packName
}) => {
    const updatePackConfig = useBridgeState(state => state.updatePackConfig);
    const configs = useBridgeState(state => state.configs);
    const { pack } = configs[packName];
    const methods = useForm<PackConfig>({ defaultValues: { pack }, mode: 'onBlur' });
    const sendCommand = useSendCommand();

    const onSave = async (data: PackConfig) => {
        await sendCommand(WRITE_PACK_CONFIG, 'Saving pack config...', data);
        updatePackConfig(data);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSave)}>
                    <DialogTitle>Edit pack config</DialogTitle>
                    <DialogContent>
                        <PackForms disablePackName />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit">Update</Button>
                    </DialogActions>
                </form>
            </FormProvider>

        </Dialog>
    )
}