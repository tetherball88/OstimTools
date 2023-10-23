import { Box, Button, Drawer, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { FC } from "react";
import { EXPLORER_WRITE_MOD_THEME_CONFIG } from "~explorer/events/events";
import { GlobalThemeForm } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/GlobalThemeForm";
import { ChildScenesStylesForm } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/ScenesStylesForm";
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";


export const ThemeDrawer: FC = () => {
    const globalTheme = useExplorerState(state => state.globalTheme)
    const scenesTheme = useExplorerState(state => state.scenesTheme)
    const groupsTheme = useExplorerState(state => state.groupsTheme)
    const touched = useExplorerState(state => state.touched)
    const setTouched = useExplorerState(state => state.setTouched)
    const open = useExplorerState(state => state.openThemeForms)
    const setOpenThemeForms = useExplorerState(state => state.setOpenThemeForms)
    const setThemesFromSelectedMod = useExplorerState(state => state.setThemesFromSelectedMod)
    const selectedModId = useExplorerState(state => state.selectedModId)
    const confirm = useConfirm()
    const sendCommand = useSendCommand()


    const onClose = () => setOpenThemeForms(false)

    const saveStyles = async () => {
        if (selectedModId) {
            await sendCommand(EXPLORER_WRITE_MOD_THEME_CONFIG, 'Saving global colors for mod...', selectedModId, {
                global: globalTheme,
                scenesStyles: scenesTheme,
                groupsStyles: groupsTheme
            })
        }
    }

    const confirmClosing = () => {
        if (touched) {
            return confirm({
                title: 'You\'ll loose unsave changes.',
                description: 'You made changes in styles and didn\'t save them. You\'ll loose all unsaved changes.',
                allowClose: false,
                confirmationText: 'Save',
                cancellationText: 'Don\'t save'
            })

        }
    }
    const closeHandler = async (checkSave: boolean = true) => {
        if (!checkSave || !touched) {
            onClose()
            return;
        }
        try {
            await confirmClosing()
            await saveStyles()
        } catch (e) {
            setThemesFromSelectedMod()
            onClose();
        } finally {
            onClose();
        }
    }

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => closeHandler()}
            sx={{
                pointerEvents: 'none',
                '&>.MuiPaper-root': {
                    overflow: "auto",
                    pointerEvents: 'auto',

                },
            }}
            hideBackdrop
        >
            <Box
                sx={{
                    width: '500px'
                }}
            >
                <Box
                    sx={{
                        marginBottom: '25px'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            margin: '15px',
                            marginBottom: '25px'
                        }}
                    >Change global colors</Typography>
                    <GlobalThemeForm />
                </Box>
                <Box>
                    <ChildScenesStylesForm />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        padding: '15px'
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{
                            marginRight: '30px'
                        }}
                        onClick={() => {
                            closeHandler()
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            await saveStyles()
                            setTouched(false);
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>

        </Drawer >
    )
}