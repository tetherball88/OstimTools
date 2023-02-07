import { FC } from "react";
import { ControllerRenderProps } from "react-hook-form";

import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';


interface AutocompleteWithCheckboxesProps {
    disabled?: boolean
    data: string[]
    label: string
    placeholder: string
    notInDataMsg?: string
    dontRenderChips?: boolean
    autocompleteProps?: Omit<AutocompleteProps<any, any, any, any>, 'value' | 'onChange' | 'renderInput' | 'options'>
    FieldProps?: Omit<TextFieldProps, 'value' | 'label' | 'InputProps' | 'variant'>
    onChange?: (value: string[]) => void
    value?: string[]
    formControlProps?: ControllerRenderProps<any, any>
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const AutocompleteWithCheckboxes: FC<AutocompleteWithCheckboxesProps> = ({
    data,
    label,
    placeholder,
    disabled,
    notInDataMsg = '',
    dontRenderChips = false,
    autocompleteProps,
    FieldProps,
    value,
    onChange,
    formControlProps: { onChange: formOnchange, value: formValue, ...otherFormControlProps } = {},
}) => {
    return (
        <Autocomplete
            {...autocompleteProps}
            disabled={disabled}
            multiple
            options={data}
            getOptionLabel={(option) => option}
            onChange={(event, value, reason) => {
                if (reason === 'selectOption' || reason === 'removeOption') {
                    formOnchange?.(value);
                    onChange?.(value);
                }
            }}
            value={formValue || value}
            disableCloseOnSelect
            renderTags={(value, getTagProps) => {
                if (dontRenderChips) {
                    return null;
                }

                return value.map((option, index) => {
                    const notInData = !data.includes(option);
                    return (
                        <Chip
                            {...(getTagProps({ index }))}
                            label={(
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {notInData ? (
                                        <Tooltip title={notInData ? notInDataMsg : ''}>
                                            <ReportGmailerrorredIcon color="warning" />
                                        </Tooltip>
                                    ) : null}
                                    {option}
                                </Box>
                            )}
                        />
                    )
                })
            }}
            renderOption={(props, option, { selected }) => (
                <Box component="li" {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option}
                </Box>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    {...FieldProps}
                    {...otherFormControlProps}
                    label={label}
                    placeholder={placeholder}
                />
            )}
        />
    )
}