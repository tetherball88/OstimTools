import { FC, useEffect, useState } from "react";
import { useSendCommand } from "~common/ui/hooks/useSendCommand";
import { CONECT_ADDON_LOAD_CONFIGS } from "~connectAddon/events/events";
import { AddonConfig } from "~connectAddon/types";
import { ConnectAddon } from "~connectAddon/ui/components";

export const ConnectAddonHub: FC = () => {
    const [config, setConfig] = useState<AddonConfig | null>(null);
    const sendCommand = useSendCommand();

    useEffect(() => {
        (async () => {
            const loadedConfig = await sendCommand(CONECT_ADDON_LOAD_CONFIGS, 'Loading configs...');

            if(loadedConfig)
                setConfig(loadedConfig);
        })()
    }, []);

    if(!config) {
        return null;
    }

    return <ConnectAddon config={config} />
};