import { Button, Tooltip } from "@mui/material"
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand";
import { EXPLORER_MAKE_SNAPSHOT } from "~explorer/events/events";

export const MakeSnapshotButton = () => {
    const cy = useExplorerState(state => state.cy)
    const modId = useExplorerState(state => state.selectedModId)
    const sendCommand = useSendCommand()
    const globalTheme = useExplorerState(state => state.globalTheme)

    const onClick = async () => {
        if (!cy) {
            return;
        }

        const base64 = cy.jpg({
            full: true,
            output: 'base64',
            bg: globalTheme?.core.core["background-color"]
        })

        if(modId) {
            await sendCommand(EXPLORER_MAKE_SNAPSHOT, 'Making snapshot...', modId, base64);
        }
    }
    return (
        <Tooltip title="Generate image">
            <Button onClick={onClick}><WallpaperIcon /></Button>
        </Tooltip>
    )
}