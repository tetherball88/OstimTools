import { Box, ButtonGroup } from "@mui/material"
import { ThemeButton } from "./ThemeButton/ThemeButton";
import { ToggleEdgesButton } from "~explorer/ui/components/ToolBar/ToggleEdgesButton";
import { FiltersButton } from "~explorer/ui/components/ToolBar/FiltersButton";
import { MakeSnapshotButton } from "~explorer/ui/components/ToolBar/MakeSnapshotButton";
import { RelayoutButton } from "~explorer/ui/components/ToolBar/RelayoutButton";
import { ToggleEdgesLabels } from "~explorer/ui/components/ToolBar/ToggleEdgesLabels";
import { ModsAutocomplete } from "~explorer/ui/components/ToolBar/ModsAutocomplete";
import { ValidateScenesButton } from "~explorer/ui/components/ToolBar/ValidateScenesButton";
import { AddModButton } from "~explorer/ui/components/ToolBar/AddModButton";

export const ToolBar = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <ModsAutocomplete />
            <ButtonGroup
                variant="contained"
                sx={{
                    marginRight: '15px'
                }}
            >
                <AddModButton />
                <FiltersButton />
                <ThemeButton />
                <MakeSnapshotButton />
                <RelayoutButton />
                <ToggleEdgesButton />
                <ValidateScenesButton />
            </ButtonGroup>
            <ToggleEdgesLabels />
            
        </Box>
    )
}