import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import { FC } from "react";
import { Controller, FieldValues, useFormContext, get } from 'react-hook-form';
import { ControllerWrapperProps } from "~common/shared/types/ControllerWrapperProps";

export type SelectFieldItem = { value: any, label: string | number }

export interface AutocompleteControlledProps<TFieldValues extends FieldValues, T, FreeSolo extends boolean = false> extends
    Omit<AutocompleteProps<T, any, any, FreeSolo>, 'onChange' | 'defaultValue' | 'renderInput'> {
    formControl: ControllerWrapperProps<TFieldValues>,
    label?: string
    onChange?: (value: any) => void
    getValue?: (value: any) => any
}

export const AutocompleteControlled = <TFieldValues extends FieldValues, T, FreeSolo extends boolean = false>({ label, onChange, getValue = val => val, formControl, ...other }: AutocompleteControlledProps<TFieldValues, T, FreeSolo>): ReturnType<FC> => {
    const { control, formState: { errors } } = useFormContext<TFieldValues>()

    const error = get(errors, formControl.name);

    return (
        <Controller
            {...formControl}
            control={control}
            render={({ field: { onChange: formOnChange, ...otherFieldProps } }) => (
                <Autocomplete
                    {...other}
                    {...otherFieldProps}
                    onChange={(event, value) => {
                        const val = getValue(value)
                        formOnChange(val);
                        onChange?.(val);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            {...otherFieldProps}
                            label={label}
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
            )}
        />
    )
}