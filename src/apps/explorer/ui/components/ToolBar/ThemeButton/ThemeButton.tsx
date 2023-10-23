import { Button, Tooltip } from "@mui/material";
import { FC } from "react";
import PaletteIcon from '@mui/icons-material/Palette';
import { ThemeDrawer } from "./ThemeDrawer";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export const ThemeButton: FC = () => {
    const open = useExplorerState(state => state.openThemeForms)
    const setOpenThemeForms = useExplorerState(state => state.setOpenThemeForms)
    return (
        <>
            <Tooltip title="Change colors">
                <Button onClick={() => setOpenThemeForms(true)}><PaletteIcon /></Button>
            </Tooltip>
            {open && <ThemeDrawer />}
        </>
    )
}