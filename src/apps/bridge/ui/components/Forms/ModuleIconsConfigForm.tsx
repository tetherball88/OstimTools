import { Button, Box, Grid, IconButton, Tooltip, createFilterOptions } from '@mui/material';
import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { ModuleSpecificConfig, AnimationFromModule } from "~bridge/types";
import { AutocompleteControlled } from '~common/ui/components/Fields/AutocompleteControlled';
import { TextFieldControlled } from '~common/ui/components/Fields/TextFieldControlled';
interface ModuleIconsConfigFormProps {
    selectedAnimations: AnimationFromModule
}
const filter = createFilterOptions<string>();

export const ModuleIconsConfigForm: FC<ModuleIconsConfigFormProps> = ({ selectedAnimations }) => {
    const { control } = useFormContext<ModuleSpecificConfig>();
    const { fields, prepend, remove } = useFieldArray({
        control,
        name: 'icons'
    })

    const allAnimIds = Object.keys(selectedAnimations).filter(animId => {
        return !fields.find(field => field.sceneId === animId)
    })

    return (
        <>
            <Box sx={{ mt: 2, mb: 2 }}>
                <Button onClick={() => prepend({ sceneId: '', icon: '' })}>Add animation</Button>
            </Box>
            {
                fields.map((field, index) => (
                    <Grid key={field.id} container spacing={2} sx={{ paddingTop: '16px' }}>
                        <Grid item xs={5}>
                            <Tooltip title="Animation name.">
                                <Box>
                                    <AutocompleteControlled<ModuleSpecificConfig, string>
                                        formControl={{
                                            name: `icons.${index}.sceneId`
                                        }}
                                        freeSolo
                                        options={allAnimIds}
                                        getOptionLabel={o => o}
                                        label={"Animation's id"}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);

                                            const { inputValue } = params;
                                            // Suggest the creation of a new value
                                            const isExisting = options.some((option) => inputValue === option);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push(inputValue);
                                            }

                                            return filtered;
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={5}>
                            <Tooltip title="Animation icon.">
                                <Box>
                                    <TextFieldControlled
                                        formControl={{
                                            name: `icons.${index}.icon`
                                        }}
                                        label="Animation's icon"
                                    />
                                </Box>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={2}>
                            <Box>
                                <IconButton color="error" onClick={() => remove(index)}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}