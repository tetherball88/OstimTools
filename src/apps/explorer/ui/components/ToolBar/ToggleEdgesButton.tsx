import { Button, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExplorerNavTypes } from "~explorer/ui/graph/buildScenesGraphData"
import { useExplorerState } from '~explorer/ui/state/ExplorerState'
import InsightsIcon from '@mui/icons-material/Insights';
import { explorerToolbarConfigsStorage } from '~common/ui/services/Storage/ExplorerToolbarConfigsStorage';

type ToggleEdgeOption = {
    type: ExplorerNavTypes,
    label: string
}

const allEdges: ToggleEdgeOption[] = [
    {
        type: 'navDestination',
        label: 'Navigation destination otpion'
    },
    {
        type: 'navOrigin',
        label: 'Navigation origin otpion'
    },
    {
        type: 'transDestination',
        label: 'Transition destination scene'
    },
    {
        type: 'transOrigin',
        label: 'Transition origin scene'
    },
    {
        type: 'autoTrans',
        label: 'Scene auto transition'
    },
    {
        type: 'autoTransActor',
        label: 'Actor auto transition'
    }
]

export const ToggleEdgesButton = () => {
    const initial = explorerToolbarConfigsStorage.getToggleEdges()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [visibleEdges, setVisibleEdges] = useState(initial)
    const cy = useExplorerState(state => state.cy)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const updateCyto = (type: keyof typeof initial, enabled: boolean) => {
        if(type === 'tmp-shown') {
            cy?.edges('.manual-hidden').toggleClass('tmp-shown', enabled)
        }
            
        cy?.edges(`[type = "${type}"]`).toggleClass('hidden', !enabled)
    }

    useEffect(() => {
        if(!cy) {
            return
        }

        Object.entries(visibleEdges).forEach(([type, enabled]) => {
            updateCyto(type as any, enabled)
        })
    }, [cy])

    

    const handleToggle = (type: keyof typeof initial) => {
        const newState = {
            ...visibleEdges,
            [type]: !visibleEdges[type]
        }
        setVisibleEdges(newState);

        explorerToolbarConfigsStorage.setToggledEdges(type, newState[type])

        updateCyto(type, newState[type])
    }
    return (
        <>
            <Tooltip title="Toggle connections">
                <Button onClick={handleClick} ><InsightsIcon /></Button>
            </Tooltip>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItem
                        disablePadding
                    >
                        <ListItemButton
                            role={undefined}
                            onClick={() => {
                                handleToggle('tmp-shown')
                            }}
                            dense
                        >
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={visibleEdges['tmp-shown']}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary="Temporeraly show hidden edges" />
                        </ListItemButton>
                    </ListItem>
                    {allEdges.map((option) => (
                        <ListItem
                            key={option.type}
                            disablePadding
                        >
                            <ListItemButton
                                role={undefined}
                                onClick={() => handleToggle(option.type)}
                                dense
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={visibleEdges[option.type]}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText primary={option.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </>

    )
}