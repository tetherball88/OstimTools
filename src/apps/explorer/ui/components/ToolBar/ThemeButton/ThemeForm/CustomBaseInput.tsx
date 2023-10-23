import { FC, useRef, useState, useEffect } from 'react'
import { BaseInputTemplateProps } from '@rjsf/utils'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { ColorSwatch } from '~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/ColorSwatch'

import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';

export const CustomBaseInput: FC<BaseInputTemplateProps> = (props) => {
    const initialValue = useRef<string>(props.value)
    const initialColor = initialValue.current || null
    const [currentColor, setCurrentColor] = useState(initialColor);

    useEffect(() => {
        setCurrentColor(props.value)
    }, [props.value])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={props.schema.description}>
                <Typography variant="caption" sx={{ marginRight: '5px', minWidth: '120px' }}>{props.name}:</Typography>
            </Tooltip>
            <Box>
                <ColorSwatch
                    tooltip={props.schema.description}
                    color={currentColor}
                    onChange={(val) => {
                        props.onChange(val)
                    }}
                    onCurrentChange={(val) => {
                        setCurrentColor(val)
                    }}
                    
                />
            </Box>
            <Tooltip title="Reset color to initial">
                <IconButton
                    sx={{
                        marginLeft: '15px'
                    }}
                    onClick={() => {
                        props.onChange(initialValue.current)
                        setCurrentColor(initialColor)
                    }}
                >
                    <InvertColorsOffIcon />
                </IconButton>
            </Tooltip>
            {!props.required && (
                <Tooltip title="Remove color">
                    <IconButton
                        sx={{
                            marginLeft: '15px'
                        }}
                        onClick={() => {
                            props.onChange(null)
                            setCurrentColor(null)
                        }}
                    >
                        <FormatColorResetIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    )
}