import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

import { ModuleSpecificConfig, AnimationFromModule, FurnitureTypes } from "~bridge/types";
import { Box, Button, IconButton } from '@mui/material';
import { AutocompleteControlled } from '~common/ui/components/Fields/AutocompleteControlled';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface FurnitureMapConfigFormProps {
    selectedAnimations: AnimationFromModule
}

const defaultFurnitures: FurnitureTypes[] = ['bed', 'bench', 'chair', 'table', 'shelf', 'wall', 'cookingpot']

export const FurnitureMapConfigForm: FC<FurnitureMapConfigFormProps> = ({ selectedAnimations }) => {
    const { control } = useFormContext<ModuleSpecificConfig>();
    const { prepend, fields, remove } = useFieldArray({
        control,
        name: 'furnitureMap'
    })

    const animationsOptions = Object.keys(selectedAnimations)

    return (
        <Box sx={{ paddingTop: '16px' }}>
            <Alert severity='info'>Provide mapping between animation name and furniture type. Script can't guess furniture type since it's not always the case slal animation name or config has this information(or this information is relevant for OSTIM, like: sofa furniture which doesn't exist in OSTIM)</Alert>
            <Box sx={{ mt: 2, mb: 2 }}>
                <Button onClick={() => prepend({ animation: '', furniture: '' })}>Add animation/furniture</Button>
            </Box>
            <Box>
                {
                    fields.map((field, index) => {
                        return (
                            <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                                <Grid item xs={5}>
                                    <AutocompleteControlled<ModuleSpecificConfig, string>
                                        formControl={{
                                            name: `furnitureMap.${index}.animation`,
                                        }}
                                        options={animationsOptions}
                                        getOptionLabel={o => o}
                                        multiple={false as any}
                                        label={"Animation name"}
                                        placeholder={"Select animation"}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <AutocompleteControlled<ModuleSpecificConfig, string>
                                        formControl={{
                                            name: `furnitureMap.${index}.furniture`
                                        }}
                                        options={defaultFurnitures}
                                        getOptionLabel={o => o}
                                        multiple={false as any}
                                        freeSolo={true as any}
                                        label={"Furniture type(hit enter to add new type)"}
                                        placeholder={"Select furniture"}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Box>
                                        <IconButton color="error" onClick={() => remove(index)}>
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        )
                    })
                }
            </Box>
        </Box>
    )
}