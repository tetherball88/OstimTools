import { FC } from "react";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { useMainState } from "~common/ui/state/MainState";

interface LockScreenProps {
    open?: boolean
    message?: string
}

export const LockScreen: FC<LockScreenProps> = ({ message, open = false }) => {
    const commandInProgress = useMainState(state => state.commandInProgress);
    const commandMessage = useMainState(state => state.commandMessage);
    
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 1, display: 'flex', flexDirection: 'column' }}
            open={open || !!commandInProgress}
        >
            <CircularProgress color="primary" />
            <Typography variant="h5" sx={{ color: '#fff' }}>{message || commandMessage}</Typography>
        </Backdrop>
    )
}