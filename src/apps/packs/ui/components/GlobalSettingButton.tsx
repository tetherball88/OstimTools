import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';

import { usePacksState } from "~packs/ui/state/PacksState";
import { GlobalConfig } from "~packs/types";
import { invokeValidateFnisPath } from "~packs/events/invokers";
import { EditPacksGlobalConfigModal } from "~packs/ui/components/Dialogs";

export const GlobalSettingButton: FC = () => {
    const [openGlobalConfig, setOpenGlobalConfig] = useState(false);
    const { globalConfig, setFnisValidation } = usePacksState();
    const methods = useForm<GlobalConfig>({
        defaultValues: globalConfig,
        mode: 'onBlur'
    });
    const { isValid } = methods.formState

    methods.register('fnisForModdersPath', {
        required: 'Application needs this path to invoke FNIS for developers and copy generated hkx behavior file to your output folder.',
        validate: async (val) => {
            const newFnisValidation = await invokeValidateFnisPath(val);

            return newFnisValidation ? newFnisValidation : true;
        }
    });

    useEffect(() => {
        setFnisValidation(methods.formState.errors.fnisForModdersPath?.message || '')
    }, [methods.formState.errors.fnisForModdersPath])

    let globalSettingTooltip = 'Global PACKS configuration';

    if (!isValid) {
        globalSettingTooltip += '\nFNIS path has problem, please double check it.';
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
            <EditPacksGlobalConfigModal open={openGlobalConfig} onClose={() => setOpenGlobalConfig(false)} />
        </FormProvider>
    )
}