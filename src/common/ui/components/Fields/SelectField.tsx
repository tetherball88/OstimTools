import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import { FC } from "react";
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { ControllerWrapperProps } from "~common/shared/types/ControllerWrapperProps";

export type SelectFieldItem = { value: any, label: string | number }

export interface SelectFieldProps<TFieldValues extends FieldValues> extends SelectProps {
    items: SelectFieldItem[]
    formControl: ControllerWrapperProps<TFieldValues>
}

export const SelectField = <TFieldValues extends FieldValues>({
    items,
    label,
    formControl,
    ...otherProps
}: SelectFieldProps<TFieldValues>): ReturnType<FC> => {
    const { control } = useFormContext<TFieldValues>()
    return (
        <FormControl fullWidth>
            <InputLabel id={`${formControl.name}-select-label`}>{label}</InputLabel>
            <Controller
                control={control}
                {...formControl}
                render={({ field }) => (
                    <Select
                        {...otherProps}
                        {...field}
                        labelId={`${formControl.name}-select-label`}
                        label={label}
                    >
                        {items.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                    </Select>
                )}
            />
        </FormControl>
    )
}