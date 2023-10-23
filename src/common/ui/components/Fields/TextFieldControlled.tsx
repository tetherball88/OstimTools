import { OutlinedTextFieldProps, TextField } from "@mui/material";
import { FC } from "react";
import { Controller, FieldValues, useFormContext, get } from 'react-hook-form';
import { ControllerWrapperProps } from "~common/shared/types/ControllerWrapperProps";

export type SelectFieldItem = { value: any, label: string | number }

interface TextFieldControlledProps<TFieldValues extends FieldValues> extends Omit<OutlinedTextFieldProps, 'variant' | 'defaultValue' | 'name'> {
    formControl: ControllerWrapperProps<TFieldValues>
}

export const TextFieldControlled = <TFieldValues extends FieldValues>({ formControl, ...other }: TextFieldControlledProps<TFieldValues>): ReturnType<FC> => {
    const { control, formState: { errors } } = useFormContext<TFieldValues>()
    const err = get(errors, formControl.name);
    return (
        <Controller
            {...formControl}
            control={control}
            render={({ field }) => (
                <TextField
                    fullWidth
                    {...other}
                    {...field}
                    error={!!err}
                    helperText={err?.message}
                />
            )}
        />
    )
}