import { FC, useEffect } from 'react';
import { Global } from '@emotion/react';

import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';


import { Terminal } from './Terminal';
import { useMainState } from '~common/ui/state/MainState';


interface TerminalDrawerProps {
    open: boolean
    toggle: (open: boolean) => void
}

export const TerminalDrawer: FC<TerminalDrawerProps> = ({ open, toggle }) => {
    const { commandInProgress } = useMainState();
    
    const toggleHandler = () => toggle(!open);
    const closeHandler = () => toggle(false);

    useEffect(() => {
        if(commandInProgress && !open) {
            toggle(commandInProgress)
        }
    }, [commandInProgress, open, toggle])

    return (
        <>
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        overflow: 'visible',
                    },
                }}
            />
            <Drawer
                anchor="bottom"
                variant="persistent"
                open={open}
                onClose={closeHandler}
                sx={{
                    [`& .MuiDrawer-paper`]: { height: '33vh' },
                    paddingTop: '36px',
                    flexShrink: 0,
                }}
            >
                <Button
                    variant="contained"
                    sx={{ position: 'absolute', top: '-36px', left: 0, right: 0, visibility: 'visible', borderRadius: 0 }}
                    onClick={toggleHandler}
                >
                    Toggle console
                    {open ? <KeyboardArrowDown /> : <KeyboardArrowUpIcon />}
                    
                </Button>
                <Terminal />
            </Drawer>
        </>
    );
}