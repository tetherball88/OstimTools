import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { usePacksState } from '~packs/ui/state/PacksState';
import { PackConfig } from '~packs/types';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { WRITE_PACK_CONFIG } from '~packs/events/events';
import { PackForms } from '~packs/ui/components/Forms';

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
    const { configs, updatePackConfig } = usePacksState();
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