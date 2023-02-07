import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { ModuleSpecificConfig } from '~packs/types';
import { createEmptyFurnitureMap } from '~packs/shared/createEmptyFurnitureMap';
import { usePacksState } from '~packs/ui/state/PacksState';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { WRITE_MODULE_CONFIG } from '~packs/events/events';
import { ModuleForms } from '~packs/ui/components/Forms';

export interface CreateModuleConfigModalProps {
    open: boolean
    onClose: () => void
    packName: string
}

export const CreateModuleConfigModal: FC<CreateModuleConfigModalProps> = ({
    open,
    onClose,
    packName
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
            furnitureMap: createEmptyFurnitureMap(),
            customScale: {},
            specialSwapRules: {},
            icons: {},
        }, 
        mode: 'onBlur'
    });
    const { addModuleConfig } = usePacksState();

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
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSave)}>
                    <DialogTitle>Create module config</DialogTitle>
                    <DialogContent>
                        <ModuleForms />
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