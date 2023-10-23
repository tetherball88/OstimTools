import { FC, memo, useMemo, useEffect } from "react";
import { PresetLayoutOptions } from "cytoscape";
import { style } from "~explorer/ui/graph/styles/style";
import { useInitialLayout } from "~explorer/ui/graph/hooks/useInitialLayout";
import { Box, Typography } from "@mui/material";
import { useGraphInteractions } from "~explorer/ui/graph/services/useGraphInteractions";
import { CytoscapeComponent } from "~explorer/ui/graph/CytoscapeComponent";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { globaThemeToCyStylesheet, sceneStylesToCyStylesheet } from "~explorer/ui/graph/globaThemeToCyStylesheet";
import { GroupNodeDialog } from "~explorer/ui/components/GroupNodeForm/GroupNodeDialog";

export const GraphComponent: FC = memo(() => {
    const cy = useExplorerState(state => state.cy)
    const selectedModId = useExplorerState(state => state.selectedModId)
    const selectedModConfig = useExplorerState(state => state.selectedModConfig)
    const globalTheme = useExplorerState(state => state.globalTheme)
    const scenesTheme = useExplorerState(state => state.scenesTheme)
    const groupsTheme = useExplorerState(state => state.groupsTheme)
    const nodes = useExplorerState(state => state.nodes)
    const edges = useExplorerState(state => state.edges)
    const drawingMode = useExplorerState(state => state.drawingMode)
    const groupToEdit = useExplorerState(state => state.groupToEdit)
    useGraphInteractions();

    const regularConfig: PresetLayoutOptions = useMemo(() => ({
        name: 'preset',
        fit: true,
    }), []);

    const initialConfig = useInitialLayout();

    const cytoscapeComponent = useMemo(() => (
        <CytoscapeComponent
            elements={[...nodes, ...edges] as any}
            style={[
                ...style,
                ...globaThemeToCyStylesheet(globalTheme),
                ...sceneStylesToCyStylesheet(scenesTheme),
                ...sceneStylesToCyStylesheet(groupsTheme),
            ]}
            layout={!selectedModConfig?.positions.length ? initialConfig : regularConfig}
            zoom={-10}
            wheelSensitivity={0.3}
        />
    ), [selectedModId])

    useEffect(() => {
        cy?.remove('node,edge')
        cy?.add([...nodes, ...edges] as any)
    }, [nodes, edges])

    useEffect(() => {
        cy?.style().clear().fromJson([
            ...style,
            ...globaThemeToCyStylesheet(globalTheme),
            ...sceneStylesToCyStylesheet(scenesTheme),
            ...sceneStylesToCyStylesheet(groupsTheme),
        ])
    }, [globalTheme, scenesTheme, groupsTheme])

    return (
        <Box
            sx={{
                backgroundColor: globalTheme?.core.core["background-color"] || '#fff',
                border: `3px dashed ${drawingMode ? '#00e676' : '#bbdefb'}`,
                height: '100%',
                position: 'relative',
            }}
        >
            {
                drawingMode && (
                    <Typography
                        sx={{
                            position: "absolute",
                            top: '-3px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: `3px dashed #00e676`,
                            background: 'rgba(255,255,255,0.8)',
                            padding: 1,
                            textAlign: 'center',
                            zIndex: 2,
                        }}
                    >
                        Start drawing connection between 2 scenes. <br />Click on "from" scene and drag mouse to "to" scene
                    </Typography>
                )
            }
            {cytoscapeComponent}
            {!!groupToEdit && <GroupNodeDialog />}
        </Box>
    )
})
