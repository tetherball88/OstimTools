import { Switch, Tooltip, styled } from '@mui/material'
import { useEffect } from 'react';
import { explorerToolbarConfigsStorage } from '~common/ui/services/Storage/ExplorerToolbarConfigsStorage';
import { useExplorerState } from '~explorer/ui/state/ExplorerState'

const LabelSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/></svg>')`,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 32,
        height: 32,
        color: theme.palette.primary.main,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="m3.25 2.75 17 17L19 21l-2-2H5c-1.1 0-2-.9-2-2V7c0-.55.23-1.05.59-1.41L2 4l1.25-1.25zM22 12l-4.37-6.16C17.27 5.33 16.67 5 16 5H8l11 11 3-4z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
    },
}));

export const ToggleEdgesLabels = () => {
    const enabledEdgesLabels = explorerToolbarConfigsStorage.getToggleEdgeLabels()
    const cy = useExplorerState(state => state.cy)

    useEffect(() => {
        cy?.edges().toggleClass('hidden-label', !enabledEdgesLabels)
    }, [cy])

    return (
        <Tooltip
            title="Toggle labels on connections"
        >
            <LabelSwitch
                defaultChecked={enabledEdgesLabels}
                onChange={(e, checked) => {
                    cy?.edges().toggleClass('hidden-label', !checked)
                    explorerToolbarConfigsStorage.setToggleEdgeLabels(checked)
                }}
            />
        </Tooltip>
    )
}