import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { FC, useState } from "react";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { ModInfoConfig } from "~explorer/types/ModsConfig";
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand";
import { EXPLORER_REMOVE_MOD } from "~explorer/events/events";
import { ModInfoModal } from "~explorer/ui/components/AddModsButton/AddModsModal";

export const ModsAutocomplete: FC = () => {
    const [modToEdit, setModToEdit] = useState<ModInfoConfig | null>(null)
    const [opened, setOpened] = useState(false)
    const selectedModId = useExplorerState(state => state.selectedModId)
    const loadInitialData = useExplorerState(state => state.loadInitialData)
    const setSelectedModId = useExplorerState(state => state.setSelectedModId)
    const allModsConfigs = useExplorerState(state => state.allModsConfigs)
    const sendCommand = useSendCommand()

    return (
        <>
            <Autocomplete
                size="small"
                getOptionLabel={(info) => info.name}
                options={allModsConfigs ? Object.values(allModsConfigs).map(({ info }) => info) : []}
                onChange={(e, value) => {
                    setSelectedModId(value?.id || null)
                }}
                sx={{
                    width: '250px',
                    background: '#fff',
                    marginRight: '15px'

                }}
                disableClearable
                value={selectedModId && allModsConfigs ? allModsConfigs?.[selectedModId].info : undefined}
                renderOption={(props, option) => {
                    return (
                        <Box
                            component="li"
                            {...props}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between !important',
                                flexWrap: 'nowrap'
                            }}
                        >
                            <Box
                                sx={{
                                    flexShrink: 1,
                                    flexGrow: 1,
                                    overflow: 'auto',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {option.name}
                            </Box>
                            <Box 
                                onClick={e => e.stopPropagation()}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between !important',
                                    flexWrap: 'nowrap'
                                }}
                            >
                                <IconButton color="primary" onClick={() => {
                                    setModToEdit(option)
                                    setOpened(true)
                                }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => {
                                    sendCommand(EXPLORER_REMOVE_MOD, 'Removing mod...', option.id)
                                    loadInitialData()
                                }}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    )
                }}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Select mod"
                        inputProps={{
                            ...params.inputProps,
                        }}
                    />
                )

                }
            />
            {opened && <ModInfoModal open={opened} onClose={() => setOpened(false)} defaultValues={modToEdit} />}
        </>

    )
}