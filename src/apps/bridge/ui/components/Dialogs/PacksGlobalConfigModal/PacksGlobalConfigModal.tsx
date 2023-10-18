import { FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import { GlobalConfig } from '~bridge/types';
import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { WRITE_GLOBAL_CONFIG } from '~bridge/events/events';
import { TextFieldFile } from '~common/ui/components';
import { useBridgeState } from '~bridge/ui/state/store';

export interface EditBridgeGlobalConfigModalProps {
    open: boolean
    onClose: () => void
}

export const EditBridgeGlobalConfigModal: FC<EditBridgeGlobalConfigModalProps> = ({
    open,
    onClose,
}) => {
    const setGlobalConfig = useBridgeState(state => state.setGlobalConfig);
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
                <DialogTitle>Edit bridge global config</DialogTitle>
                <DialogContent>
                    <Controller
                        name="hkannoExe"
                        control={methods.control}
                        defaultValue=''
                        render={({ field }) => (
                            <Tooltip title="hkanno tool path to exe file. Needs to add ostim events to hkx annotations">
                                <TextFieldFile
                                    {...field}
                                    value={field.value || ''}
                                    label="hkanno exe path"
                                    FieldProps={{
                                        sx: { marginTop: 1, minWidth: '500px' }
                                    }}
                                />
                            </Tooltip>
                        )}
                    />
                    <Controller
                        name="nemesisTransitionToolExe"
                        control={methods.control}
                        defaultValue=''
                        render={({ field }) => (
                            <Tooltip title="Nemesis Animlist Transition Tool path to exe file. Needs to add build nemesis engine patches">
                                <TextFieldFile
                                    {...field}
                                    value={field.value || ''}
                                    label="Animlist transition tool"
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