import { forwardRef } from 'react';
import { ControllerRenderProps, useFormContext, get } from 'react-hook-form';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { SELECT_DIRECTORY } from '~common/events/events';

interface TextFieldDIrectoryProps extends ControllerRenderProps<any, any> {
    label: string;
    value: string
    onChange: (value: string) => void
    FieldProps?: Omit<TextFieldProps, 'value' | 'label' | 'InputProps' | 'variant'>
}

export const TextFieldDirectory = forwardRef<HTMLDivElement, TextFieldDIrectoryProps>(function TextFieldDirectory({ value, label, onChange, FieldProps, ...otherProps }, ref) {
    const { formState: { errors }, trigger } = useFormContext<any>();
    const sendCommand = useSendCommand();
    const onButtonClick = async () => {
        const res = await sendCommand(SELECT_DIRECTORY, 'Selecting directory...', {});

        if(res) {
            const { filePaths: [directory] } = res;
            onChange(directory);
            trigger(otherProps.name);
        }
    }

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
            helperText={error?.message as string}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton color="primary" onClick={onButtonClick}><FolderOpenIcon /></IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
})