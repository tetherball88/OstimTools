import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

import { FurnitureTypes, ModuleSpecificConfig, AnimationFromModule } from "~bridge/types";
import { AutocompleteWithCheckboxes } from '~common/ui/components';

interface FurnitureMapConfigFormProps {
    selectedAnimations: AnimationFromModule
}

const furnitures: FurnitureTypes[] = ['bed', 'bench', 'chair', 'cookingpot', 'shelf', 'table', 'wall'];

export const FurnitureMapConfigForm: FC<FurnitureMapConfigFormProps> = ({ selectedAnimations }) => {
    const { control, getValues } = useFormContext<ModuleSpecificConfig>();
    const values = getValues()
    
    return (
        <Grid container spacing={2} sx={{ paddingTop: '16px' }}>
            <Alert severity='info'>Provide mapping between animation name and furniture type. Script can't guess furniture type since it's not always the case slal animation name or config has this information(or this information is relevant for OSTIM, like: sofa furniture which doesn't exist in OSTIM)</Alert>
            {
                furnitures.map(furniture => (
                    <Grid key={furniture} item xs={12}>
                        <Controller
                            name={`furnitureMap.${furniture}`}
                            control={control}
                            render={({ field }) => (
                                <AutocompleteWithCheckboxes
                                    formControlProps={field}
                                    disabled={!values.module.inputPath}
                                    label={furniture}
                                    data={Object.keys(selectedAnimations)}
                                    placeholder="Select animations"
                                    notInDataMsg="Animation in this furniture isn't in module animations list"
                                />
                            )}
                        />
                    </Grid>
                ))
            }
        </Grid>
    )
}