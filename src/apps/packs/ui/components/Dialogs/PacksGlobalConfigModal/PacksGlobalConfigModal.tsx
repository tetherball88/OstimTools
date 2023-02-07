import { FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import { usePacksState } from '~packs/ui/state/PacksState';
import { GlobalConfig } from '~packs/types';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { WRITE_GLOBAL_CONFIG } from '~packs/events/events';
import { TextFieldDirectory } from '~common/ui/components';

export interface EditPacksGlobalConfigModalProps {
    open: boolean
    onClose: () => void
}

export const EditPacksGlobalConfigModal: FC<EditPacksGlobalConfigModalProps> = ({
    open,
    onClose,
}) => {
    const { setGlobalConfig } = usePacksState();
    const methods = useFormContext<GlobalConfig>();

    useEffect(() => {
        methods.trigger();
    }, []);

    const sendCommand = useSendCommand();

    const onSave = async (data: GlobalConfig) => {
        await sendCommand(WRITE_GLOBAL_CONFIG, 'Updating global config...', data);
        setGlobalConfig(data);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <form onSubmit={methods.handleSubmit(onSave)}>
                <DialogTitle>Edit packs global config</DialogTitle>
                <DialogContent>
                    <Controller
                        name="fnisForModdersPath"
                        control={methods.control}
                        render={({ field }) => (
                            <Tooltip title="FNIS for modders path - this script will try to run FNIS for modders app to rebuild behavior hkx file from txt. You need to provide path to fnis folder with FNIS.esp file. Keep in mind script expects default file structure in the fnis folder.">
                                <TextFieldDirectory
                                    {...field}
                                    label="FNIS for modders path"
                                    FieldProps={{
                                        sx: { marginTop: 1, minWidth: '500px' }
                                    }}
                                />
                            </Tooltip>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}