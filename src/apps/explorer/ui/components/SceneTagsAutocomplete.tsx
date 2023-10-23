import { createFilterOptions } from "@mui/material";
import { FieldValues } from "react-hook-form";
import { ModsMetadataItem } from "~common/shared/types/ModsMetadata";
import { AutocompleteWithCheckboxes, AutocompleteWithCheckboxesControlled, AutocompleteWithCheckboxesControlledProps, AutocompleteWithCheckboxesProps } from "~common/ui/components";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export interface SceneTagsAutocompleteProps<TFieldValues extends FieldValues> extends
    Omit<AutocompleteWithCheckboxesControlledProps<TFieldValues, ModsMetadataItem, true>, 'getOptionLabel' | 'options' | 'formControl'> {
    label?: string
    formControl?: AutocompleteWithCheckboxesControlledProps<TFieldValues, ModsMetadataItem, true>['formControl']
}

const filter = createFilterOptions<ModsMetadataItem>();

export const SceneTagsAutocomplete = <TFieldValues extends FieldValues>({
    label = 'Select scene tags',
    formControl,
    ...otherProps
}: SceneTagsAutocompleteProps<TFieldValues>) => {
    const modsMetadata = useExplorerState(state => state.modsMetadata)

    const commonProps: Omit<AutocompleteWithCheckboxesProps<ModsMetadataItem, true>, 'formControl'> = {
        ...otherProps,
        freeSolo: true,
        options: modsMetadata?.sceneTags || [],
        getOptionDisabled: (option) => option.value.indexOf('Hit Enter to add custom tag ') === 0,
        filterOptions: (options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== '') {
                filtered.push({ value: `Hit Enter to add custom tag "${params.inputValue}"`, group: '' });
            }

            return filtered;
        },
        groupBy: (option) => option.group,
        getOptionLabel: (option: any) => option?.value ?? option,
        getValue: (val) => val.value || val,
        isOptionEqualToValue: (option, value) => option.value === value as any,
        FieldProps: {
            label,
            placeholder: label
        },
    }

    if (!formControl) {
        return (
            <AutocompleteWithCheckboxes<ModsMetadataItem, true>
                {...commonProps}
            />
        )
    }

    return (
        <AutocompleteWithCheckboxesControlled<TFieldValues, ModsMetadataItem, true>
            {...commonProps}
            formControl={formControl}
        />
    )
}