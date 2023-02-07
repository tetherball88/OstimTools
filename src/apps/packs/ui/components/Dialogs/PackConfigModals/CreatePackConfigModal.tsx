import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { PackConfig } from '~packs/types';
import { usePacksState } from '~packs/ui/state/PacksState';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { WRITE_PACK_CONFIG } from '~packs/events/events';
import { PackForms } from '~packs/ui/components/Forms';

export interface CreatePackConfigModalProps {
    open: boolean
    onClose: () => void
}

const emptyState: PackConfig = {
    pack: {
        name: '',
        author: '',
        outputPath: '',
        tweakedAnimationFilesPath: '',
    }
}

export const CreatePackConfigModal: FC<CreatePackConfigModalProps> = ({
    open,
    onClose
}) => {
    const methods = useForm<PackConfig>({
        defaultValues: emptyState, 
        mode: 'onBlur'
    });
    const { addPackConfig } = usePacksState()
    const sendCommand = useSendCommand();

    const onSave = async (data: PackConfig) => {
        await sendCommand(WRITE_PACK_CONFIG, 'Saving pack config...', data);
        addPackConfig(data);
        methods.reset();
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSave)}>
                    <DialogTitle>Create pack config</DialogTitle>
                    <DialogContent>
                        <PackForms />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit">Create</Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    )
}