import { FC } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { AddModsForm } from '~explorer/ui/components/AddModsButton/AddModsForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useSendCommand } from '~explorer/ui/hooks/useSendCommand';
import { EXPLORER_WRITE_MOD_INFO_CONFIG } from '~explorer/events/events';
import { ModInfoConfig } from '~explorer/types/ModsConfig';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';

export interface AddModsModalProps {
    open: boolean
    defaultValues?: ModInfoConfig | null
    onClose: () => void
}

export const ModInfoModal: FC<AddModsModalProps> = ({
    open,
    onClose,
    defaultValues
}) => {
    const loadInitialData = useExplorerState(state => state.loadInitialData)
    const sendCommand = useSendCommand()
    const methods = useForm<ModInfoConfig>({
        defaultValues: defaultValues || {
            id: '',
            name: '',
            path: '',
        }
    })
    
    const onSave = async (data: ModInfoConfig) => {
        await sendCommand(EXPLORER_WRITE_MOD_INFO_CONFIG, 'Saving mod config...', methods.getValues('id'), data);
        await loadInitialData()
        onClose();
    }
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <form onSubmit={methods.handleSubmit(onSave)}>
                <FormProvider {...methods}>
                    <DialogTitle>Add mods</DialogTitle>
                    <DialogContent>
                        <AddModsForm isEdit={!!defaultValues} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit">{defaultValues ? 'Update' : 'Create'}</Button>
                    </DialogActions>
                </FormProvider>
            </form>
        </Dialog>
    )
}