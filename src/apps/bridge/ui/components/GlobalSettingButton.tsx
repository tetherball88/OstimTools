import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';

import { GlobalConfig } from "~bridge/types";
import { invokeValidateNemesisPath } from "~bridge/events/invokers";
import { EditBridgeGlobalConfigModal } from "~bridge/ui/components/Dialogs";
import { useBridgeState } from "~bridge/ui/state/store";

export const GlobalSettingButton: FC = () => {
    const [openGlobalConfig, setOpenGlobalConfig] = useState(false);
    const globalConfig = useBridgeState(state => state.globalConfig);
    const setNemesisValidation = useBridgeState(state => state.setNemesisValidation);
    const methods = useForm<GlobalConfig>({
        defaultValues: globalConfig,
        mode: 'onBlur'
    });
    const { isValid } = methods.formState

    methods.register('nemesisTransitionToolExe', {
        required: 'To build nemesis patches you need nemesis "Animlist Transition Tool" app',
        validate: async (val) => {
            const newNemesisValidation = await invokeValidateNemesisPath(val);

            return newNemesisValidation ? newNemesisValidation : true;
        }
    });

    useEffect(() => {
        setNemesisValidation(methods.formState.errors.nemesisTransitionToolExe?.message || '')
    }, [methods.formState.errors.nemesisTransitionToolExe])

    let globalSettingTooltip = 'Global Bridge configuration';

    if (!isValid) {
        globalSettingTooltip += 'Nemesis path has problem, please double check it.';
    }

    return (
        <FormProvider {...methods}>
            <Tooltip
                title={globalSettingTooltip}
                sx={{ marginLeft: 1 }}
            >
                <Button
                    variant="contained"
                    onClick={() => setOpenGlobalConfig(true)}
                >
                    <Badge badgeContent="!" color="error" invisible={isValid}>
                        <SettingsIcon sx={{ color: '#fff' }} fontSize="medium" />
                    </Badge>
                </Button>
            </Tooltip>
            <EditBridgeGlobalConfigModal open={openGlobalConfig} onClose={() => setOpenGlobalConfig(false)} />
        </FormProvider>
    )
}