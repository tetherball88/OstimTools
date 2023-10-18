import { FC, useState } from "react";

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import { StartingScenesModal } from "~bridge/ui/components/Dialogs/StartingScenesModal";

export const StartingScenesButton: FC = () => {
    const [openGlobalConfig, setOpenGlobalConfig] = useState(false);
    return (
        <>
            <Tooltip
                title={""}
                sx={{ marginLeft: 1 }}
            >
                <Button
                    variant="contained"
                    onClick={() => setOpenGlobalConfig(true)}
                >
                    Starting scenes
                </Button>
            </Tooltip>
            <StartingScenesModal open={openGlobalConfig} onClose={() => setOpenGlobalConfig(false)} />
        </>
    )
}