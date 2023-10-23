import { Box, Popover, Tooltip } from '@mui/material'
import { FC, useState, useMemo } from 'react'
import { SketchPicker } from 'react-color'
import { useExplorerState } from '~explorer/ui/state/ExplorerState'
import { StylesheetStyle } from 'cytoscape'

const noColorImage = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=")`

interface ColorSwatchProps {
    color: string | null
    onChange: (val: string) => void
    onCurrentChange: (val: string) => void
    tooltip?: string
}

export const ColorSwatch: FC<ColorSwatchProps> = ({ color, onChange, onCurrentChange, tooltip }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const cy = useExplorerState(state => state.cy)

    const usedColors = useMemo(() => {
        const uniqueColors: Record<string, number> = {}
        ;((cy?.style() as any).json() as StylesheetStyle[]).forEach(({style}) => {
            Object.values(style).forEach(styleValue => {
                if(styleValue.toLowerCase().includes('rgb')) {
                    uniqueColors[styleValue] = uniqueColors[styleValue] || 0
                    uniqueColors[styleValue]++
                }
            })
        })

        return Object.entries(uniqueColors).sort((a, b) => a[1] - b[1]).map(c => c[0]).slice(0, 20)
    }, [cy])
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };


    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Tooltip title={tooltip}>
                <Box
                    onClick={handleClick}
                    sx={{
                        ...(!color ? {backgroundImage: noColorImage} : { backgroundColor: color }),
                        border: '1px solid #000',
                        height: '30px',
                        width: '30px',
                        cursor: 'pointer',
                        outline: 'none',
                        borderRadius: '4px',
                    }}
                />
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                disablePortal
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <SketchPicker 
                    color={color || '#000'}
                    onChange={({ hex }) => onCurrentChange(hex)} 
                    onChangeComplete={({ hex }) => onChange(hex)} 
                    disableAlpha
                    presetColors={usedColors.map((color, index) => ({ color, title: `Color ${index + 1}` }))}
                />
            </Popover>
        </>

    )
}