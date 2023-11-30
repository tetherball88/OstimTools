import { Alert, Box, Grid } from "@mui/material";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { ModuleSpecificConfig } from "~bridge/types";
import { AutocompleteWithCheckboxesControlled } from "~common/ui/components";

interface SkipObjectsConfigFormProps {
    moduleObjects: Record<string, string[]>
}

export const SkipObjectsConfigForm: FC<SkipObjectsConfigFormProps> = ({ moduleObjects }) => {
    const { getValues } = useFormContext<ModuleSpecificConfig>();
    const skippedObjects = getValues('objects.skipObjects');

    return (
        <Box>
            <Alert severity='info'>Select animation objects you want to skip from resulting animation. Useful if you are adapting spawned furniture scenes to regular furniture</Alert>
            {
                Object.entries(moduleObjects).map(([name, objects]) => (
                    <Grid key={name} item xs={12} sx={{ mt: 2 }}>
                        <AutocompleteWithCheckboxesControlled<ModuleSpecificConfig, string>
                            formControl={{
                                name: `objects.skipObjects.${name}`
                            }}
                            options={objects}
                            value={skippedObjects?.[name] || []}
                            getOptionLabel={o => o}
                            FieldProps={{
                                label: name,
                                placeholder: "Select object to skip",
                            }}
                        />
                    </Grid>
                ))
            }
        </Box>
    )
}