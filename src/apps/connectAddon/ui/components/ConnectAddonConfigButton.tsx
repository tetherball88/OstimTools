import { FC, useState } from "react";

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';

import { ConnectDialogGlobalConfigModal } from "~connectAddon/ui/components/Dialogs";
import { useFormContext } from "react-hook-form";
import { AddonConfig } from "~connectAddon/types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ConnectAddonConfigButtonProps {}

export const ConnectAddonConfigButton: FC<ConnectAddonConfigButtonProps> = () => {
    const [openGlobalConfig, setOpenGlobalConfig] = useState(false);
    const { formState: { errors } } = useFormContext<AddonConfig>();
    let globalSettingTooltip = 'Global ADDON HUB configuration';

    const isErrorInDialog = errors.main || errors.addonHubs

    if(isErrorInDialog) {
        globalSettingTooltip = 'Please check global ADDON HUB configuration!'
    }
    
    return (
        <>
            <Tooltip
                title={globalSettingTooltip}
                sx={{ marginLeft: 1 }}
            >
                <Button
                    variant="contained"
                    onClick={() => setOpenGlobalConfig(true)}
                >
                    <Badge badgeContent="!" color="error" invisible={!isErrorInDialog}>
                        <SettingsIcon sx={{ color: '#fff' }} fontSize="medium" />
                    </Badge>
                </Button>
            </Tooltip>
            <ConnectDialogGlobalConfigModal open={openGlobalConfig} onClose={() => setOpenGlobalConfig(false)} />
        </>
    )
}