import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { ModuleSpecificConfig } from '~bridge/types';
import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { WRITE_MODULE_CONFIG } from '~bridge/events/events';
import { ModuleForms } from '~bridge/ui/components/Forms';
import { useBridgeState } from '~bridge/ui/state/store';

export interface CreateModuleConfigModalProps {
    open: boolean
    onClose: () => void
    packName: string
    author: string
}

export const CreateModuleConfigModal: FC<CreateModuleConfigModalProps> = ({
    open,
    onClose,
    packName,
    author
}) => {
    const methods = useForm<ModuleSpecificConfig>({
        defaultValues: {
            module: {
                name: '',
                inputPath: '',
                slalJsonConfig: '',
                include: [],
                exclude: [],
            },
            furnitureMap: [],
            transitions: []
        }, 
        mode: 'onBlur'
    });
    const addModuleConfig = useBridgeState(state => state.addModuleConfig)

    const sendCommand = useSendCommand();

    const onSave = async (data: ModuleSpecificConfig) => {
        await sendCommand(WRITE_MODULE_CONFIG, 'Saving module config...', packName, data)
        addModuleConfig(data, packName);
        methods.reset();
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSave)}>
                    <DialogTitle>Create module config</DialogTitle>
                    <DialogContent>
                        <ModuleForms author={author} />
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