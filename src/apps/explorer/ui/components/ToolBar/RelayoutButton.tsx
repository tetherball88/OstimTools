import { Button, Tooltip } from "@mui/material"
import GrainIcon from '@mui/icons-material/Grain';
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { useInitialLayout } from "~explorer/ui/graph/hooks/useInitialLayout";
import { useConfirm } from "material-ui-confirm";

export const RelayoutButton = () => {
    const cy = useExplorerState(state => state.cy)
    const layoutConfig = useInitialLayout();
    const confirm = useConfirm()

    const onClick = async () => {
        if (!cy) {
            return;
        }

        try {
            await confirm({
                title: 'Confirm re-layout',
                description: 'It will overwrite all nodes positions including those you manually layouted.'
            })
            const layout = cy.layout(layoutConfig);
            layout.run();
        } catch(e) {
            return;
        }
    }
    return (
        <>
            <Tooltip title="Generate layout. Will dismiss all your manual changes!">
                <Button onClick={onClick}><GrainIcon /></Button>
            </Tooltip>
        </>
    )
}