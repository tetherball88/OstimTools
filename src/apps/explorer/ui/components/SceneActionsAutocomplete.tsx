import { FieldValues } from "react-hook-form";
import { ModsMetadataItem } from "~common/shared/types/ModsMetadata";
import { AutocompleteWithCheckboxes, AutocompleteWithCheckboxesControlled, AutocompleteWithCheckboxesControlledProps, AutocompleteWithCheckboxesProps } from "~common/ui/components";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export interface SceneActionsAutocompleteProps<TFieldValues extends FieldValues> extends
    Omit<AutocompleteWithCheckboxesControlledProps<TFieldValues, ModsMetadataItem, true>, 'getOptionLabel' | 'options' | 'formControl'> {
    label?: string
    formControl?: AutocompleteWithCheckboxesControlledProps<TFieldValues, ModsMetadataItem, true>['formControl']
}

export const SceneActionsAutocomplete = <TFieldValues extends FieldValues>({
    label = 'Select actions',
    formControl,
    ...otherProps
}: SceneActionsAutocompleteProps<TFieldValues>) => {
    const modsMetadata = useExplorerState(state => state.modsMetadata)

    const commonProps: Omit<AutocompleteWithCheckboxesProps<ModsMetadataItem, true>, 'formControl'> = {
        ...otherProps,
        options: modsMetadata?.actions || [],
        groupBy: (option) => option.group,
        getOptionLabel: (option: any) => option?.value ?? option,
        getValue: (val) => val.value || val,
        isOptionEqualToValue: (option, value) => option.value === value as any,
        FieldProps: {
            label,
            placeholder: label
        }
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