import { FC, PropsWithChildren, useState } from "react";
import { Controller, ControllerProps, FieldValues, useFormContext } from "react-hook-form";

import Autocomplete, { AutocompleteProps as MuiAutocompleteProps, AutocompleteRenderGetTagProps } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { AutocompleteValue } from "@mui/material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const AutocompleteChip: FC<PropsWithChildren<{
    index: number,
    getTagProps: AutocompleteRenderGetTagProps,
    notInDataMsg?: string
}>> = ({
    index,
    getTagProps,
    notInDataMsg,
    children
}) => {
        return (
            <Chip
                {...(getTagProps({ index }))}
                label={(
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!!notInDataMsg && (
                            <Tooltip title={notInDataMsg}>
                                <ReportGmailerrorredIcon color="warning" />
                            </Tooltip>
                        )}
                        {children}
                    </Box>
                )}
            />
        )
    }

type AutoCompleteProps<T, FreeSolo extends boolean = false> = MuiAutocompleteProps<T, true, false, FreeSolo>

export interface AutocompleteWithCheckboxesProps<
    T,
    FreeSolo extends boolean = false,
    Value = AutocompleteValue<T, true, false, FreeSolo>
> extends
    Omit<AutoCompleteProps<T, FreeSolo>, 'onChange' | 'renderInput'> {
    notInDataSet?: (option: any) => string
    dontRenderChips?: boolean
    FieldProps?: Omit<TextFieldProps, 'variant'>
    onChange?: (value: Value) => void
    getOptionLabel: Required<AutoCompleteProps<T, FreeSolo>>['getOptionLabel']
    getValue?: (value: any) => any
}

export const AutocompleteWithCheckboxes = <
    T,
    FreeSolo extends boolean = false
>({
    notInDataSet,
    dontRenderChips = false,
    FieldProps,
    onChange,
    getOptionLabel,
    getValue = v => v,
    ...otherProps
}: AutocompleteWithCheckboxesProps<T, FreeSolo>): ReturnType<FC> => {
    const [fieldValue, setFiedlValue] = useState('')
    return (
        <Autocomplete<T, true, false, FreeSolo>
            {...otherProps}
            getOptionLabel={getOptionLabel}
            multiple
            onChange={(event, value) => {
                onChange?.(value.map(getValue));
            }}
            inputValue={fieldValue}
            disableCloseOnSelect={true}
            renderTags={(val, getTagProps) => {
                if (dontRenderChips) {
                    return null;
                }

                return val.map((option, index) => {
                    const label = getOptionLabel(option)
                    return (
                        <AutocompleteChip
                            key={label}
                            index={index}
                            notInDataMsg={notInDataSet?.(option)}
                            getTagProps={getTagProps}
                        >
                            {label}
                        </AutocompleteChip>
                    )
                })
            }}
            renderOption={(props, option, { selected }) => {
                return (
                    <Box component="li" {...props}>
                        <Checkbox
                            checked={selected}
                            icon={icon}
                            checkedIcon={checkedIcon}

                        />
                        {getOptionLabel(option)}
                    </Box>
                )
            }}
            style={{ width: "100%" }}
            renderInput={(params) => (
                <TextField
                    {...FieldProps}
                    {...params}
                    onChange={(e) => {
                        FieldProps?.onChange?.(e)
                        setFiedlValue(e.target.value)
                    }}
                />
            )}
        />
    )
}

export interface AutocompleteWithCheckboxesControlledProps<TFieldValues extends FieldValues, T, FreeSolo extends boolean = false> extends AutocompleteWithCheckboxesProps<T, FreeSolo> {
    formControl: Omit<ControllerProps<TFieldValues>, 'render' | 'control'>
}

export const AutocompleteWithCheckboxesControlled = <TFieldValues extends FieldValues, T, FreeSolo extends boolean = false>({
    formControl,
    FieldProps,
    ...otherProps
}: AutocompleteWithCheckboxesControlledProps<TFieldValues, T, FreeSolo>): ReturnType<FC> => {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            {...formControl}
            control={control}
            render={({ field: { value, onChange, ...otherFieldProps } }) => {
                return (
                    <AutocompleteWithCheckboxes
                        {...otherProps}
                        value={value}
                        onChange={(val) => {
                            otherProps.onChange?.(val);
                            onChange(val);
                        }}
                        FieldProps={{
                            ...FieldProps,
                            InputProps: { ...FieldProps?.InputProps, ...otherFieldProps },
                        }}
                    />
                )
            }}
        />
    )
}