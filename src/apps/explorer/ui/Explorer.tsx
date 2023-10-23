import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { GraphComponent } from "~explorer/ui/graph/GraphComponent";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { JsonEditor } from "~explorer/ui/components/JsonEditor/JsonEditor";

import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { ToolBar } from "~explorer/ui/components/ToolBar/ToolBar";
import { AddModButton } from "~explorer/ui/components/ToolBar/AddModButton";
import { AddFileOrFolderForm } from "~explorer/ui/components/AddFileOrFolderForm/AddFileOrFolderForm";

loader.config({ monaco });

export const Explorer: FC = () => {
    const [loading, setLoading] = useState(true)
    const loadInitialData = useExplorerState(state => state.loadInitialData)
    const selectedModConfig = useExplorerState(state => state.selectedModConfig)

    useEffect(() => {
        (async () => {
            await loadInitialData()
            setLoading(false)
        })()
    }, [])

    if (loading) {
        return <>Loading...</>
    }

    if(!selectedModConfig) {
        return (
            <Box sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AddModButton>
                    Add your first mod pack
                </AddModButton>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <ToolBar />
            <GraphComponent />
            <JsonEditor />
            <AddFileOrFolderForm />
        </Box>
    );
}