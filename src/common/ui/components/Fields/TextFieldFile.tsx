import { FileFilter } from 'electron';
import { forwardRef } from 'react';
import { ControllerRenderProps, useFormContext, get } from 'react-hook-form';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { useOpenFileSelect } from '~common/ui/hooks/useOpenFileSelect';

interface TextFieldFileProps extends ControllerRenderProps<any, any> {
    label: string;
    value: string
    onChange: (value: string) => void
    filters?: FileFilter[]
    FieldProps?: Omit<TextFieldProps, 'value' | 'label' | 'InputProps' | 'variant'>
    
}

export const TextFieldFile = forwardRef<HTMLDivElement, TextFieldFileProps>(function TextFieldFile({ value, label, onChange, filters, FieldProps, ...otherProps }, ref) {
    const { formState: { errors }, trigger } = useFormContext<any>();
    const { open } = useOpenFileSelect({
        onChange: ([file]) => {
            onChange(file);
            trigger(otherProps.name);
        },
        dialogOptions: {
            filters,
        }
    })
    const error = get(errors, otherProps.name);

    return (
        <TextField
            {...otherProps}
            {...FieldProps}
            ref={ref}
            fullWidth
            label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            error={!!error}
            helperText={error?.message}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton color="primary" onClick={open}><FileOpenIcon /></IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
})