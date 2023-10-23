import { useState } from "react";

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Backdrop, Link, Typography, useTheme } from "@mui/material";

import { Packs } from "~bridge/ui/Packs";
import { TerminalDrawer } from "~common/ui/components/Terminal";
import { LockScreen } from "~common/ui/components/LockScreen";
import { START_UPDATING } from "~common/events/events";
import { Explorer } from "~explorer/ui/Explorer";

export const Main = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [openTerminal, setOpenTerminalOrig] = useState(false);
    const theme = useTheme()
    const [isUpdating, setIsUpdating] = useState(false);

    const setOpenTerminal = (op: boolean) => {
        setOpenTerminalOrig(op)
    }

    window.api.on(START_UPDATING, () => {
        setIsUpdating(true)
    })

    return (
        <>
            <Backdrop open={isUpdating}>
                <Box sx={{ display: 'flex', flexDirection: 'column', color: "#fff", alignItems: 'center', textAlign: "center", zIndex: 1200 }}>
                    <Typography variant="h2">Update is in progress...</Typography>
                    <Typography variant="h5">Please don't close during update it will break app and you'll need to download full setup for this version!</Typography>
                    <Typography variant="body1">Updates are incremental and app installing them one by one</Typography>
                    <Typography variant="h5">If you missed a lot of updates it would be easier to download the whole setup again{' '}
                        <Link href="https://github.com/tetherball88/OstimTools/releases" target="_blank" sx={{ color: '#bbdefb', fontWeight: 'bold' }}>
                            Ostim releases
                        </Link>
                    </Typography>
                </Box>
            </Backdrop>
            <Container sx={{ minHeight: '100vh', padding: '0 !important', backgroundColor: 'rgb(231, 235, 240)' }} maxWidth={false}>
                <AppBar
                    position="fixed"
                    sx={{
                        marginLeft: -3,
                        marginRight: -3,
                        paddingLeft: 3,
                        paddingRight: 3,
                        width: 'calc(100% + 48px)'
                    }}
                >
                    <Tabs
                        value={currentTab}
                        onChange={(event, index) => setCurrentTab(index)}
                        aria-label="basic tabs example"
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="inherit"
                        indicatorColor="secondary"
                    >
                        <Tab label="bridge" value={0} />
                        <Tab label="explorer" value={1} />
                    </Tabs>
                </AppBar>
                <Box
                    sx={{
                        padding: 3,
                        paddingTop: 9,
                        overflowY: 'auto',
                        transition: theme.transitions.create('height', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        height: openTerminal ? 'calc(67vh - 36px)' : 'calc(100vh - 36px)'
                    }}
                >
                    {currentTab === 0 && <Packs />}
                    {currentTab === 1 && <Explorer />}
                </Box>
                <TerminalDrawer open={openTerminal} toggle={(newOpen) => setOpenTerminal(newOpen)} />
                <LockScreen />
            </Container >
        </>
    )
}