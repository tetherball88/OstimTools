import { FC, createContext, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';

import { ModuleSpecificConfig, PackConfig } from "~bridge/types";
import { useRegisterFields } from '~bridge/ui/components/ModulesList/useRegisterFields';
import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { REMOVE_MODULE } from '~bridge/events/events';
import { ConfirmRemoveButton } from '~bridge/ui/components/ConfirmRemoveButton';
import { Actions } from '~bridge/ui/components/Actions';
import { EditModuleConfigModal } from '~bridge/ui/components/Dialogs';
import { useBridgeState } from '~bridge/ui/state/store';

interface ModulesItemProps {
    module: ModuleSpecificConfig
    pack: PackConfig
}

interface ModuleContext {
    module: ModuleSpecificConfig | null
}

const moduleContext = createContext<ModuleContext>({
    module: null
})

export const useModuleContext = () => {
    return useContext(moduleContext)
}

export const ModulesItem: FC<ModulesItemProps> = ({ module, pack }) => {
    const [editModule, setEditModule] = useState(false);
    const removeModule = useBridgeState(state => state.removeModule);
    const nemesisValidation = useBridgeState(state => state.nemesisValidation);

    const methods = useForm<ModuleSpecificConfig>({
        defaultValues: {
            ...module,
            furnitureMap: module.furnitureMap || [],
        },
        mode: 'onBlur'
    });
    const { isValid } = methods.formState;

    const allValid = isValid && !nemesisValidation;

    useRegisterFields(methods)

    const openEditModal = () => setEditModule(true)
    const closeEditModal = () => setEditModule(false);

    const sendCommand = useSendCommand();

    const removeModuleHandler = async () => {
        await sendCommand(REMOVE_MODULE, 'Removing module configs...', pack, module);
        removeModule(module, pack.pack.name);
    }

    return (
        <moduleContext.Provider value={{ module }}>
            <FormProvider {...methods}>
                <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: 2, paddingBottom: 2 }}>
                    <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '150px', minWidth: '50px' }}>{module.module.name}</Typography>
                    <Box
                        sx={{
                            marginRight: '15px'
                        }}
                    >
                        <Badge badgeContent="!" color="error" invisible={allValid}>
                            <Tooltip title={allValid ? "Edit module configuration" : "Something wrong with module's config, please fix before firther actions with this module."}>
                                <Button
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal();
                                    }}
                                >
                                    Edit
                                </Button>
                            </Tooltip>
                        </Badge>
                    </Box>
                    <Box sx={{ marginRight: 3 }}>
                        <ConfirmRemoveButton tooltip="Remove module config files along with output files" onConfirm={removeModuleHandler} />
                    </Box>
                    <Box>
                        {
                            !allValid ? (
                                <Alert severity='error' sx={{ marginBottom: 1 }}>
                                    {
                                        nemesisValidation ? 'Please check global config. It seems your Nemesis path is invalid' : 'Please check module\'s config.'
                                    }
                                </Alert>
                            ) : null
                        }
                        <Actions module={module} pack={pack} disabled={!allValid} />
                    </Box>
                </Box>
                <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
                <EditModuleConfigModal
                    open={editModule}
                    onClose={closeEditModal}
                    packName={pack.pack.name}
                    author={pack.pack.author}
                />
            </FormProvider>
        </moduleContext.Provider>
    )
}