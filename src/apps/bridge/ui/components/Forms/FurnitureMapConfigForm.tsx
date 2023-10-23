import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

import { FurnitureTypes, ModuleSpecificConfig, AnimationFromModule } from "~bridge/types";
import { AutocompleteWithCheckboxesControlled } from '~common/ui/components';

interface FurnitureMapConfigFormProps {
    selectedAnimations: AnimationFromModule
}

const furnitures: FurnitureTypes[] = ['bed', 'bench', 'chair', 'cookingpot', 'shelf', 'table', 'wall'];

export const FurnitureMapConfigForm: FC<FurnitureMapConfigFormProps> = ({ selectedAnimations }) => {
    const {  getValues } = useFormContext<ModuleSpecificConfig>();
    const values = getValues()
    
    return (
        <Grid container spacing={2} sx={{ paddingTop: '16px' }}>
            <Alert severity='info'>Provide mapping between animation name and furniture type. Script can't guess furniture type since it's not always the case slal animation name or config has this information(or this information is relevant for OSTIM, like: sofa furniture which doesn't exist in OSTIM)</Alert>
            {
                furnitures.map(furniture => (
                    <Grid key={furniture} item xs={12}>
                        <AutocompleteWithCheckboxesControlled<ModuleSpecificConfig, string>
                            formControl={{
                                name: `furnitureMap.${furniture}`
                            }}
                            disabled={!values.module.inputPath}
                            options={Object.keys(selectedAnimations)}
                            getOptionLabel={o => o}
                            FieldProps={{
                                label: furniture,
                                placeholder: "Select animations",
                            }}
                        />
                    </Grid>
                ))
            }
        </Grid>
    )
}